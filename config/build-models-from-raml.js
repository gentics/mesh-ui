// Generates the server models from the local mesh instance

const { writeFile } = require('fs');
const { request } = require('http');
const { MeshRamlParser, TypescriptModelRenderer } = require('mesh-model-generator');


getRamlFromServer()
    .then(raml => {
        const parser = new MeshRamlParser();
        return parser.parseRAML(raml);
    })
    .then(parsedRaml => {
        const renderer = new TypescriptModelRenderer({
            emitInterfacesAsReadonly: true,
            emitRequestExamples: true,
            emitRequestURLs: true,
            emitResponseExamples: false,
            interfaceSuffix: 'FromServer',
            sortInterfaces: true,
            sortKeys: true
        });
        return renderer.renderAll(parsedRaml);
    })
    .then(renderedTypeScript => {
        return writeToFile('src/app/common/models/server-models.ts', renderedTypeScript);
    })
    .then(
        () => console.log('OK'),
        err => {
            console.error(err);
            process.exitCode = 1;
        }
    );


function getRamlFromServer() {
    return new Promise((resolve, reject) => {
        const apiRequest = request({
            hostname: 'localhost',
            method: 'GET',
            path: '/api/v1/raml',
            port: 8080
        }, response => {
            const data = [];
            response.setEncoding('utf-8');
            response.on('data', chunk => {
                data.push(String(chunk));
            });
            response.on('end', () => {
                if (response.statusCode >= 200 && response.statusCode < 300) {
                    resolve(data.join(''));
                } else {
                    reject(new Error(response.statusCode + ' ' + response.statusMessage));
                }
            });
        });

        apiRequest.on('error', reject);
        apiRequest.end();
    });
}

function writeToFile(filename, data) {
    return new Promise((resolve, reject) => {
        const absolute = require('path').resolve(__dirname, '..', filename);
        writeFile(absolute, data, { encoding: 'utf-8' }, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
