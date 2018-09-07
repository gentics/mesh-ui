import { MeshNode } from '../models/node.model';

// Pure functions regarding mesh nodes.

/**
 * Tests if the specified language is published.
 */
export function languagePublished(node: MeshNode, language: string): boolean {
    const lang = node.availableLanguages[language];
    return lang && lang.published;
}

/**
 * Tests if the node in the current language is published.
 */
export function currentLanguagePublished(node: MeshNode): boolean {
    if (!node.language) {
        return false;
    }
    return node.availableLanguages[node.language].published;
}

/**
 * Tests if all languages are published.
 */
export function allLanguagesPublished(node: MeshNode): boolean {
    return Object.keys(node.availableLanguages).every(language => node.availableLanguages[language].published);
}

/**
 * Tests if all languages are unpublished.
 */
export function allLanguagesUnpublished(node: MeshNode): boolean {
    return Object.keys(node.availableLanguages).every(language => !node.availableLanguages[language].published);
}
