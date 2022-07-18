import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { getFuzzyRegExp } from 'src/app/common/util/fuzzy-search';

export interface HighlightElement {
    marker: boolean;
    value: string;
}

export function createHighlightParts(content: string, highlight: string): HighlightElement[] {
    if (typeof content !== 'string') {
        return [];
    }

    if (typeof highlight !== 'string' || highlight == null || highlight.length < 1) {
        return [{ marker: false, value: content }];
    }

    const parts: HighlightElement[] = [];
    const regex = getFuzzyRegExp(highlight);
    let matches: null | string[] = null;
    let lastPos = 0;

    while ((matches = regex.exec(content)) != null) {
        const start = regex.lastIndex - matches[0].length;

        // Part before the match
        if (start > 0 && lastPos !== start) {
            parts.push({
                marker: false,
                value: content.substring(lastPos, start)
            });
        }

        // The match itself
        parts.push({
            marker: true,
            value: matches[0]
        });

        // Update the last position
        lastPos = regex.lastIndex;
    }

    // After the last match
    if (lastPos !== content.length) {
        parts.push({
            marker: false,
            value: content.substring(lastPos)
        });
    }

    return parts;
}

@Component({
    selector: 'mesh-highlight',
    templateUrl: './highlight.component.html',
    styleUrls: ['./highlight.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HighlightComponent implements OnChanges {
    @Input()
    public content: string;

    @Input()
    public highlight: string;

    highlightParts: HighlightElement[] = [];

    constructor() {}

    ngOnChanges(changes: SimpleChanges) {
        this.highlightParts = createHighlightParts(this.content, this.highlight);
    }
}
