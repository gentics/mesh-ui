import * as Quill from 'quill';

import { MeshNode } from '../../../../common/models/node.model';
import { MeshFieldControlApi } from '../../../common/form-generator-models';

import MeshLink from './mesh-link';

const Tooltip: { new (quill?: any, boundsContainer?: any): any } = Quill.import('ui/tooltip');
const LinkBlot = Quill.import('formats/link');

// TODO Find a better way to customize Quill tooltip or maybe even create own tooltip

// Copied from `quill/core/emitter.js`
const Emitter = {
    sources: {
        USER: 'user'
    },
    events: {
        SELECTION_CHANGE: 'selection-change'
    }
};

// Copied from `quill/core/selection.js`
class Range {
    constructor(public index: number, public length = 0) {}
}

// Based on `quill/themes/base.js`
class BaseTooltip extends Tooltip {
    constructor(quill: any, boundsContainer: any) {
        super(quill, boundsContainer);
        this.textbox = this.root.querySelector('input[type="text"]');
        this.meshNode = this.root.querySelector('span.ql-mesh-node');
        this.listen();
    }

    listen() {
        this.textbox.addEventListener('keydown', (event: any) => {
            if (event.key === 'Enter') {
                this.save();
                event.preventDefault();
            } else if (event.key === 'Escape') {
                this.cancel();
                event.preventDefault();
            }
        });
    }

    cancel() {
        this.hide();
    }

    edit(mode = 'link', preview: string | null = null) {
        this.root.classList.remove('ql-hidden');
        this.root.classList.add('ql-editing');
        if (preview != null) {
            this.textbox.value = preview;
        } else if (mode !== this.root.getAttribute('data-mode')) {
            this.textbox.value = '';
        }
        this.position(this.quill.getBounds(this.quill.selection.savedRange));
        this.textbox.select();
        this.textbox.setAttribute('placeholder', this.textbox.getAttribute(`data-${mode}`) || '');
        this.root.setAttribute('data-mode', mode);
        if (mode === 'mesh-link') {
            this.meshNode.textContent = preview;
        } else {
            this.meshNode.textContent = '';
        }
    }

    restoreFocus() {
        const { scrollTop } = this.quill.scrollingContainer;
        this.quill.focus();
        this.quill.scrollingContainer.scrollTop = scrollTop;
    }

    save() {
        let { value } = this.textbox;
        switch (this.root.getAttribute('data-mode')) {
            case 'link': {
                const { scrollTop } = this.quill.root;
                if (this.linkRange) {
                    this.quill.formatText(this.linkRange, 'link', value, Emitter.sources.USER);
                    delete this.linkRange;
                } else {
                    this.restoreFocus();
                    this.quill.format('link', value, Emitter.sources.USER);
                }
                this.quill.root.scrollTop = scrollTop;
                break;
            }
            case 'video': {
                value = extractVideoUrl(value);
            }
            // tslint:disable-next-line:no-switch-case-fall-through
            case 'formula': {
                if (!value) {
                    break;
                }
                const range = this.quill.getSelection(true);
                if (range != null) {
                    const index = range.index + range.length;
                    this.quill.insertEmbed(index, this.root.getAttribute('data-mode'), value, Emitter.sources.USER);
                    if (this.root.getAttribute('data-mode') === 'formula') {
                        this.quill.insertText(index + 1, ' ', Emitter.sources.USER);
                    }
                    this.quill.setSelection(index + 2, Emitter.sources.USER);
                }
                break;
            }
            case 'mesh-link': {
                value = this.meshNode.textContent;
                const { scrollTop } = this.quill.root;
                if (this.linkRange) {
                    this.quill.formatText(this.linkRange, 'mesh-link', value, Emitter.sources.USER);
                    delete this.linkRange;
                } else {
                    this.restoreFocus();
                    this.quill.format('mesh-link', value, Emitter.sources.USER);
                }
                this.quill.root.scrollTop = scrollTop;
                break;
            }
            default:
        }
        this.textbox.value = '';
        this.hide();
    }
}

// Heavily based on `quill/themes/snow.js`
class MeshTooltip extends BaseTooltip {
    constructor(quill: any, private api: MeshFieldControlApi, bounds?: any) {
        super(quill, bounds);
        this.preview = this.root.querySelector('a.ql-preview');
    }

    hide() {
        super.hide();
    }

    listen() {
        super.listen();
        this.root.querySelector('a.ql-action').addEventListener('click', (event: Event) => {
            if (this.root.classList.contains('ql-editing')) {
                this.save();
            } else {
                const mode = this.root.getAttribute('data-mode');
                if (mode === 'link') {
                    this.edit('link', this.preview.textContent);
                } else if (mode === 'mesh-link') {
                    this.edit('mesh-link', this.meshNode.textContent);
                }
            }
            event.preventDefault();
        });
        this.root.querySelector('a.ql-remove').addEventListener('click', (event: Event) => {
            if (this.linkRange != null) {
                const range = this.linkRange;
                this.restoreFocus();
                this.quill.formatText(range, 'link', false, Emitter.sources.USER);
                delete this.linkRange;
            }
            event.preventDefault();
            this.hide();
        });
        this.root.querySelector('a.ql-mesh-browse').addEventListener('click', async (event: Event) => {
            event.preventDefault();
            const node = this.api.getNodeValue() as MeshNode;
            const [uuid] = await this.api.openNodeBrowser({
                startNodeUuid: node.parentNode ? node.parentNode.uuid : node.uuid,
                projectName: node.project.name!,
                titleKey: 'editor.select_node'
            });
            this.edit('mesh-link', uuid);
            // TODO Make node link clickable
            // TODO Show display name instead of uuid
        });
        this.quill.on(Emitter.events.SELECTION_CHANGE, (range: any, oldRange: any, source: any) => {
            if (range == null) {
                return;
            }
            if (range.length === 0 && source === Emitter.sources.USER) {
                const [link, offset] = this.quill.scroll.descendant(
                    (blot: any) => blot instanceof LinkBlot || blot instanceof MeshLink,
                    range.index
                );
                if (link != null) {
                    this.preview.textContent = '';
                    this.meshNode.textContent = '';
                    this.linkRange = new Range(range.index - offset, link.length());
                    if (link instanceof LinkBlot) {
                        this.root.setAttribute('data-mode', 'link');
                        const preview = LinkBlot.formats(link.domNode);
                        this.preview.textContent = preview;
                        this.preview.setAttribute('href', preview);
                    } else if (link instanceof MeshLink) {
                        this.root.setAttribute('data-mode', 'mesh-link');
                        const preview = MeshLink.formats(link.domNode);
                        this.meshNode.textContent = preview;
                    }
                    this.show();
                    this.position(this.quill.getBounds(this.linkRange));
                    return;
                }
            } else {
                delete this.linkRange;
            }
            this.hide();
        });
    }

    show() {
        super.show();
    }

    static TEMPLATE = [
        '<a class="ql-preview" target="_blank" href="about:blank"></a>',
        '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">',
        '<span class="ql-mesh-node"></span>',
        '<a class="ql-mesh-browse"></a>',
        '<a class="ql-action"></a>',
        '<a class="ql-remove"></a>'
    ].join('');
}

// Copied from `quill/themes/base.js`
function extractVideoUrl(url: string) {
    let match =
        url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/) ||
        url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (match) {
        return `${match[1] || 'https'}://www.youtube.com/embed/${match[2]}?showinfo=0`;
    }
    if ((match = url.match(/^(?:(https?):\/\/)?(?:www\.)?vimeo\.com\/(\d+)/))) {
        return `${match[1] || 'https'}://player.vimeo.com/video/${match[2]}/`;
    }
    return url;
}

export default MeshTooltip;
