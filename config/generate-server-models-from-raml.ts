import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';
import { safeLoad as loadYaml } from 'js-yaml';

const crudMethods = ['delete', 'get', 'post', 'put', 'update'];
const defaultOptions = {
    fileHead: (title: string, version: string) => `
        // Auto-generated from the RAML for Version ${version} of the ${title}.

        type Integer = number;

        `.trim().replace(/\n[ \t]+/, '\n'),
    emitIntegerAs: 'Integer',
    emitInterfacesAsReadonly: false,
    emitRequestExamples: true,
    emitRequestURLs: false,
    emitResponseExamples: false,
    interfacePrefix: '',
    interfaceSuffix: 'FromServer',
    sortInterfaces: true,
    sortKeys: true,
};
type Options = typeof defaultOptions;

if (require.main === module) {
    // File was loaded from the command line, not required from another module.
    // -> Generate default file
    generate('src/raml/api.raml', 'src/app/common/models/server-models.ts', defaultOptions);
}

export function generate(ramlPath: string, outputFileName: string, optionsToOverride: Partial<typeof defaultOptions>) {
    const options: typeof defaultOptions = Object.assign({}, defaultOptions, optionsToOverride);

    if (!path.isAbsolute(ramlPath)) {
        ramlPath = path.join(__dirname, '..', ramlPath);
    }
    const ramlDocument = loadYaml(readFileSync(ramlPath).toString());
    const { endpoints, models } = parseApiRaml(ramlDocument);

    if (!path.isAbsolute(outputFileName)) {
        outputFileName = path.join(__dirname, '..', outputFileName);
    }

    const typescriptCode = generateTypeScriptInterfaces(models, endpoints, options);
    // console.log(typescriptCode);

    const fileHead = options.fileHead(ramlDocument.title, ramlDocument.version);
    const fileContent = fileHead + '\n\n' + typescriptCode;
    writeFileSync(outputFileName, fileContent, { encoding: 'utf8' });
}

function parseApiRaml(apiRaml): { endpoints: Endpoint[], models: { [name: string]: PropertyDefinition } } {
    const paths = Object.keys(apiRaml).filter(key => key.startsWith('/'));
    const models: { [name: string]: PropertyDefinition } = {};
    const endpoints: Endpoint[] = [];

    for (let pathName of paths) {
        const path = apiRaml[pathName];
        const childPaths = Object.keys(path).filter(key => key.startsWith('/'));

        for (let childPathName of childPaths) {
            const childPath = path[childPathName];
            const methods = Object.keys(childPath).filter(key => crudMethods.indexOf(key) >= 0);

            for (let methodName of methods) {
                const requestSchemaRaml = childPath[methodName];
                const url = pathName + (childPathName === '/' ? '' : childPathName);
                const parsedRequest = parseRequest(requestSchemaRaml, methodName, url, models);
                endpoints.push(parsedRequest);
            }
        }

        // break;

    }

    return { endpoints, models };
}

function parseRequest(requestSchemaRaml: any, methodName: string, url: string, models: ModelMap): Endpoint {
    const responses: ResponseMap = {};
    const parsedRequest: Endpoint = {
        url,
        method: methodName.toUpperCase() as any,
        description: requestSchemaRaml.description,
        responses
    };

    const requestBody = requestSchemaRaml.body && requestSchemaRaml.body['application/json'];
    if (requestBody) {
        // TODO: not available in the RAML yet
        parsedRequest.requestBodySchema = undefined; // = requestBody.schema
        parsedRequest.requestBodyExample = formatJsonAsPOJO(requestBody.example);
    }

    // TODO: not implemented yet
    // parsedRequest.queryParameters = ...;

    parsedRequest.responses = parseResponseSchemas(requestSchemaRaml.responses, models);

    return parsedRequest;
}

function parseResponseSchemas(responseMap: ResponseMapYaml, models: ModelMap): ResponseMap {
    const responseTypes: ResponseMap = {};

    for (let responseCode of Object.keys(responseMap  || {})) {
        const response = responseMap[Number(responseCode)];

        let responseBodySchema: PropertyDefinition | undefined;
        let responseBodyExample: string | undefined;
        if (response.body && response.body['application/json']) {
            const schema: PropertyDefinition = JSON.parse(response.body['application/json'].schema);
            responseBodySchema = parseModel(schema, models);
            responseBodyExample = formatJsonAsPOJO(response.body['application/json'].example || '');
        }

        responseTypes[Number(responseCode)] = {
            description: response.description,
            responseBodySchema,
            responseBodyExample
        };
    }
    return responseTypes;
}

function parseModel(schema: PropertyDefinition, models: ModelMap): PropertyDefinition {
    // if (schema.type === 'object') {
    //     console.log('parseModel ' + schema.type + '(' + (schema.$ref || schema.id) + ')');
    // } else {
    //     console.log('parseModel ' + schema.type);
    // }

    switch (schema.type) {
        case 'any':
        case 'boolean':
        case 'integer':
        case 'number':
        case 'string':
            return schema;

        case 'array':
            // Sometimes, the array type does not provide a "type" key. Needs to be fixed.
            let arrayType: PropertyDefinition = schema.items;
            if (!arrayType.type && (arrayType as ObjectProperty).$ref) {
                arrayType = Object.assign({ type: 'object' }, arrayType) as PropertyDefinition;
            }
            schema.items = parseModel(arrayType, models);
            return schema;

        case 'object':
            const id = schema.$ref || schema.id || '';
            if (id in models) {
                return models[id];
            } else if (schema.id) {
                models[schema.id] = schema;
            }

            if (schema.properties) {
                for (let key of Object.keys(schema.properties)) {
                    schema.properties[key] = parseModel(schema.properties[key], models);
                }
            }

            if (schema.additionalProperties) {
                const hashType: PropertyDefinition = Object.assign({ type: 'object' }, schema.additionalProperties);
                schema.additionalProperties = parseModel(hashType, models);
            }

            return schema;

        default:
            return unhandledCase(schema);
    }
}

function generateTypeScriptInterfaces(models: ModelMap, endpoints: Endpoint[] = [], options: Options): string {
    let lines = [] as string[];
    let modelNames = Object.keys(models);

    if (options.sortInterfaces) {
        modelNames = modelNames
            .map(fullName => ({ fullName, shortName: modelShortname(fullName) }))
            .sort((a, b) => (a.shortName < b.shortName) ? -1 : (a.shortName > b.shortName ? 1 : 0))
            .map(name => name.fullName);
    }

    for (let modelRef of modelNames) {
        const model = models[modelRef];

        if (model.type === 'object') {
            const example = options.emitResponseExamples &&
                endpointsWithResponseType(model, endpoints)
                    .map(responseInfo => responseInfo.response.responseBodyExample)
                    .filter(body => !!body)[0]
                || '';
            const responses = options.emitRequestURLs ? endpointsWithResponseType(model, endpoints) : [];

            lines = [
                ...lines,
                ...generateJsDoc({ description: model.description, example, responses }),
                `export interface ${options.interfacePrefix + modelShortname(modelRef) + options.interfaceSuffix} {`,
                ...renderTypescriptProperties(model.properties, options)
            ];
            lines.push(`}\n`);
        }
    }

    return lines.join('\n');
}

function endpointsWithResponseType(schema: PropertyDefinition, endpoints: Endpoint[]): CombinedResponseInfo[] {
    const list: CombinedResponseInfo[] = [];

    for (let endpoint of endpoints) {
        for (let statusCode of Object.keys(endpoint.responses).map(k => Number(k))) {
            const response = endpoint.responses[statusCode];
            if (response.responseBodySchema === schema || (
                    response.responseBodySchema &&
                    response.responseBodySchema.type === 'object' && (
                        response.responseBodySchema.$ref === (schema as ObjectProperty).id ||
                        response.responseBodySchema.id === (schema as ObjectProperty).id
                    )
                )) {
                list.push({ endpoint, response, statusCode });
            }
        }
    }

    return list;
}

function generateJsDoc({ description, example, responses }: {
            description?: string,
            example?: string
            responses?: CombinedResponseInfo[] 
        }): string[] {

    if (responses && responses.length === 0) {
        responses = undefined;
    }

    if (!description && !example) {
        return [];
    }

    if (!example && description && description.indexOf('. ') < 0) {
        return ['/** ' + description + ' */'];
    }

    const lines: string[] = [];
    if (description) {
        lines.push(...description.replace(/\. /g, '.\n').split('\n'));
    }

    if (description && responses) {
        lines.push('');
    }
    if (responses) {
        if (responses.length === 1) {
            lines.push(`Returned for: ${responses[0].endpoint.method} ${responses[0].endpoint.url}`);
        } else {
            lines.push(`Returned for:`);
            lines.push(...responses.map(res => `    ${res.endpoint.method} ${res.endpoint.url}`));
        }
    }

    if ((description || responses) && example) {
        lines.push('');
    }

    if (example) {
        lines.push('@example');
        lines.push(...example.split('\n'));
    }

    return [
        '/**',
        ...lines.map(line => line ? ' * ' + line : ' *'),
        ' */'
    ];
}

function renderTypescriptProperties(props: { [name: string]: PropertyDefinition }, options: Options): string[] {
    const lines: string[] = [];
    const keys = Object.keys(props);
    if (options.sortKeys) {
        keys.sort();
    }

    for (let key of keys) {
        const prop = props[key];
        if (prop.description) {
            lines.push(...generateJsDoc({ description: prop.description }));
        }

        const readonlyText = options.emitInterfacesAsReadonly ? 'readonly ' : '';
        const valueText = renderTypescriptPropertyDefinition(prop, options);
        const separator = prop.required ? ': ' : '?: ';

        lines.push([readonlyText, formatObjectKey(key), separator, valueText, ';'].join(''));
    }

    return lines.map(line => '    ' + line);
}

function renderTypescriptPropertyDefinition(prop: PropertyDefinition, options: Options): string {
    switch (prop.type) {
        case 'any':
        case 'boolean':
        case 'number':
        case 'string':
            return prop.type;
        case 'integer':
            return options.emitIntegerAs || 'number /* (integer) */';
        case 'array':
            const arrayType = renderTypescriptPropertyDefinition(prop.items, options);
            if (/^[A-Za-z$_][A-Za-z0-9$_]*$/.test(arrayType)) {
                return arrayType + '[]';
            } else {
                return 'Array<' + arrayType + '>';
            }
        case 'object':
            const modelName = modelShortname(prop.id || prop.$ref || '');
            if (modelName) {
                return options.interfacePrefix + modelName + options.interfaceSuffix;
            }
            if (prop.additionalProperties) {
                const hashType = renderTypescriptPropertyDefinition(prop.additionalProperties, options);
                // const hashType = 'TODO';
                return '{ [key: string]: ' + hashType + ' }';
            }
            throw new Error('object property without id or additionalProperties: ' + JSON.stringify(prop, null, 2));

        default:
            return unhandledCase(prop);
    }
}

function unhandledCase(unhandled: never): any {
    throw new Error('unhandled case ' + (unhandled as any).type + '.\ntype: ' + typeof unhandled + '\n' + unhandled);
    // throw new Error('unhandled case ' + (unhandled as any).type + '.\nProps:\n' + Object.keys(unhandled));
}

function modelShortname(modelName: string): string {
    // 'urn:jsonschema:com:gentics:mesh:core:rest:user:UserResponse' => 'UserResponse'
    // 'urn:jsonschema:com:gentics:mesh:core:rest:schema:change:impl:SchemaChangeModel' => 'SchemaChangeModel'
    return modelName.replace(/^urn:jsonschema:com:gentics:mesh:core:rest:([a-z]+:)*/, '');
}

function formatJsonAsPOJO(json: string): string {
    return formatValueAsPOJO(JSON.parse(json));
}

function formatValueAsPOJO(value: any): string {
    if (value === null) {
        return 'null';
    }
    switch (typeof value) {
        case 'boolean':
        case 'number':
            return JSON.stringify(value);
        case 'string':
            const jsonString = JSON.stringify(value);
            return '\'' + jsonString.substr(1, jsonString.length - 2) + '\'';
        case 'object':
            if (Array.isArray(value)) {
                if (!value.length) {
                    return '[]';
                }
                return '[\n    ' + value.map(v => indent(formatValueAsPOJO(v))).join(',\n    ') + '\n]';
            } else {
                let keys = Object.keys(value);
                if (keys.length === 0) {
                    return '{ }';
                }
                keys = keys.map(key => formatObjectKey(key) + ': ' + indent(formatValueAsPOJO(value[key])));
                return '{\n    ' + keys.join(',\n    ') + '\n}';
            }

        default:
            throw new Error('unhandled type ' + typeof value);
    }
}

/**
 * "abc" => "abc"
 * "some key" => "'some key'"
 */
function formatObjectKey(key: string): string {
    if (/^[a-zA-Z$_][a-zA-Z0-9$_]*$/.test(key)) {
        return key;
    } else {
        return '\'' + key.replace('\\', '\\').replace('\'', '\\\'') + '\'';
    }
}

function indent(input: string): string {
    return input.split('\n').join('\n    ');
}

interface Endpoint {
    method: 'DELETE' | 'GET' | 'POST' | 'PUT' | 'UPDATE';
    url: string;
    description: string;
    queryParameters?: any; // TODO
    requestBodyExample?: string;
    requestBodySchema?: string;
    responses: ResponseMap;
}

interface ResponseMapYaml {
    [statusCode: number]: {
        description: string;
        body: {
            'application/json': {
                /** JSON that can be parsed to a PropertyDefinition */
                schema: string,
                example?: string
            }
        }
    };
}

interface ResponseMap {
    [statusCode: number]: Response;
}

interface Response {
    description: string;
    responseBodySchema?: PropertyDefinition;
    responseBodyExample?: string;
}

interface CombinedResponseInfo {
    endpoint: Endpoint;
    statusCode: number;
    response: Response;
}

interface ModelMap {
    [name: string]: PropertyDefinition;
}

interface PrimitiveProperty {
    type: 'any' | 'boolean' | 'integer' | 'number' | 'string';
    description?: string;
    required?: boolean;
}

interface ArrayProperty {
    type: 'array';
    description?: string;
    required?: boolean;
    items: PropertyDefinition;
}

interface ObjectProperty {
    type: 'object';
    description?: string;
    required?: boolean;
    id: string;
    $ref: string;
    properties: {
        [name: string]: PropertyDefinition;
    };
    /** Defines the property it is assigned on as a hash of the described type */
    additionalProperties?: PropertyDefinition;
}

type PropertyDefinition = PrimitiveProperty | ArrayProperty | ObjectProperty;
