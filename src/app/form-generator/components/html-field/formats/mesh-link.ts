import * as Quill from 'quill';

const Inline = Quill.import('blots/inline');

class MeshLink extends Inline {
    static blotName = 'mesh-link';
    static tagName = 'A';
    static className = 'mesh-link';

    static create(uuid: string) {
        const node = super.create(uuid);
        node.setAttribute('href', this.toMeshLink(uuid));
        return node;
    }

    static formats(domNode: HTMLElement) {
        const href = domNode.getAttribute('href');
        if (!href) {
            return;
        }
        const match = href.match(/^{{mesh.link\('(.*)'\)}}$/);
        if (!match) {
            return;
        }
        return match[1];
    }

    static toMeshLink(uuid: string) {
        return `{{mesh.link('${uuid}')}}`;
    }

    format(name: string, uuid: string) {
        if (name !== this.statics.blotName || !uuid) {
            super.format(name, uuid);
        } else {
            this.domNode.setAttribute('href', MeshLink.toMeshLink(uuid));
        }
    }
}

function MeshLinkHandler(value: any) {
    if (value) {
        const { tooltip } = this.quill.theme;
        tooltip.edit('mesh-link');
    } else {
        this.quill.format('mesh-link', false);
    }
}

export { MeshLink as default, MeshLinkHandler };
