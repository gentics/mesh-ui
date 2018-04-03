import { TagReferenceFromServer } from '../../../common/models/server-models';

/**
 * Compare the Tags of two nodes.
 * Current implementation compares them by jointing tag names with a comma and makes a string equality comparison.
 */
export function tagsAreEqual(prevTags: TagReferenceFromServer[], nextTags: TagReferenceFromServer[]): boolean {
    return getJoinedTags(prevTags) === getJoinedTags(nextTags);
}

export function getJoinedTags(tags: TagReferenceFromServer[]): string {
    return (tags || []).map(tag => tag.uuid).sort().join(',');
}
