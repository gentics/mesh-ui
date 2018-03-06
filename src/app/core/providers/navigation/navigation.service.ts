import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ConfigService } from '../config/config.service';

interface NavigationInstruction {
    list?: {
        projectName: string;
        containerUuid: string;
        language: string;
    };

    detail?: {
        projectName: string;
        nodeUuid?: string;
        parentNodeUuid?: string,
        schemaUuid?: string;
        language?: string;
        command?: ValidDetailCommands;
    } | null;
}

export type ValidDetailCommands = 'createNode';

export interface InstructionActions {
    navigate(extras?: NavigationExtras): Promise<boolean>;
    commands(): any[];
}

/**
 * A wrapper around the Angular router which provides a type-safe method of navigating the UI router states for the editor list/detail outlets.
 */
@Injectable()
export class NavigationService {

    constructor(private router: Router, private config: ConfigService) { }

    /**
     * Navigate to a container in the list outlet.
     */
    list(projectName: string, containerUuid: string, language?: string): InstructionActions {
        if (!language) {
            language = this.config.FALLBACK_LANGUAGE;
        }
        return this.instruction({
            list: {
                projectName,
                containerUuid,
                language
            }
        });
    }

    /**
     * Open a node for editing in the detail outlet.
     */
    detail(projectName: string, nodeUuid: string, language?: string): InstructionActions {
        return this.instruction({
            detail: {
                projectName,
                nodeUuid,
                language
            }
        });
    }

    createNode(projectName: string, schemaUuid: string, parentNodeUuid: string, language?: string): InstructionActions {
        return this.instruction({
            detail: {
                projectName,
                command: 'createNode',
                schemaUuid,
                parentNodeUuid,
                language,
            }
        });
    }

    /**
     * Close the node in the detail outlet.
     */
    clearDetail(): InstructionActions {
        return this.instruction({
            detail: null
        });
    }

    /**
     * This is the generic method for generating commands based on the NavigationInstruction config object.
     */
    private instruction(instruction: NavigationInstruction): InstructionActions {
        const commands = this.commands(instruction);

        return {
            navigate: (extras?: NavigationExtras) => {
                return this.router.navigate(commands, extras);
            },
            commands: () => {
                return commands;
            }
        };
    }

    /**
     * Converts the NavigationInstruction object into a router commands array.
     */
    private commands(instruction: NavigationInstruction): any[] {
        const outlets = {} as any;
        if (instruction.detail === null) {
            outlets.detail = null;
        }
        if (instruction.detail) {
            const { projectName, nodeUuid, schemaUuid, parentNodeUuid, language, command } = instruction.detail;
            switch (command) {
                case 'createNode':
                    outlets.detail = [projectName, command, schemaUuid, parentNodeUuid, language];
                break;
                default:
                    outlets.detail = [projectName, nodeUuid, language];
                break;
            }
        }

        if (instruction.list) {
            const { projectName, containerUuid, language } = instruction.list;
            outlets.list = [projectName, containerUuid, language];
        }

        return ['/editor', 'project', { outlets }];
    }
}

