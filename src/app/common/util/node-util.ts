import { EMeshNodeStatusStrings } from 'src/app/shared/components/node-status/node-status.component';

import { MeshNode } from '../models/node.model';
import { PublishStatusModelFromServer } from '../models/server-models';

// Pure functions regarding mesh nodes.

/**
 * Tests if the specified language is published.
 */
export function languagePublished(node: MeshNode, language: string): boolean {
    if (!node.availableLanguages) {
        return false;
    }
    const lang = node.availableLanguages[language];
    return lang && node.version === lang.version && lang.published;
}

/**
 * Tests if the node in the current language is published.
 */
export function currentLanguagePublished(node: MeshNode): boolean {
    if (!node.language) {
        return false;
    }
    return languagePublished(node, node.language);
}

/**
 * Tests if all languages are published.
 */
export function allLanguagesPublished(node: MeshNode): boolean {
    if (!node.availableLanguages) {
        return false;
    }
    return Object.keys(node.availableLanguages).every(language => node.availableLanguages[language].published);
}

/**
 * Tests if all languages are unpublished.
 */
export function allLanguagesUnpublished(node: MeshNode): boolean {
    if (!node.availableLanguages) {
        return false;
    }
    return Object.keys(node.availableLanguages).every(language => !node.availableLanguages[language].published);
}

/**
 * Computes and returns the mesh node status of a given node and language.
 */
export function getNodeStatus(node: MeshNode, language: string): EMeshNodeStatusStrings | null {
    if (!node.availableLanguages || !node.availableLanguages[language]) {
        return null;
    }

    const nodeStatusInformation: PublishStatusModelFromServer = node.availableLanguages[language];

    if (!nodeStatusInformation.published && getNodeHasBeenEdited(node)) {
        return EMeshNodeStatusStrings.DRAFT;
        // PUBLISHED
    } else if (nodeStatusInformation.published && !getNodeHasBeenEdited(node)) {
        return EMeshNodeStatusStrings.PUBLISHED;

        // UPDATED
    } else if (nodeStatusInformation.published && getNodeHasBeenEdited(node)) {
        return EMeshNodeStatusStrings.UPDATED;

        // ARCHIVED
    } else if (!nodeStatusInformation.published && !getNodeHasBeenEdited(node)) {
        return EMeshNodeStatusStrings.ARCHIVED;
    }

    return null;
}

function getNodeHasBeenEdited(node: MeshNode): boolean {
    return getNodeVersionParsed(node).versionMinor > 0;
}

function getNodeVersionParsed(node: MeshNode) {
    return {
        versionMajor: parseInt(node.version.split('.')[0], 10),
        versionMinor: parseInt(node.version.split('.')[1], 10)
    };
}
