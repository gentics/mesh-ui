import { Injectable, TemplateRef } from '@angular/core';

@Injectable()
export class ContentPortalService {

    private portalMap = new Map<string, Array<TemplateRef<any>>>();

    registerPortal(id: string): void {
        if (this.portalMap.has(id)) {
            throw new Error(`A ContentPortal with the id "${id}" already exists.`);
        }
        this.portalMap.set(id, []);
    }

    unregisterPortal(id: string): void {
        this.checkId(id);
        this.portalMap.delete(id);
    }

    addTemplateRef(id: string, templateRef: TemplateRef<any>): void {
        this.getTemplates(id).push(templateRef);
    }

    removeTemplateRef(id: string, templateRef: TemplateRef<any>): void {
        const arr = this.getTemplates(id);
        const index = arr.indexOf(templateRef);
        arr.splice(index, 1);
    }

    getTemplates(id: string): TemplateRef<any>[] {
        this.checkId(id);
        return this.portalMap.get(id) || [];
    }

    private checkId(id: string): void {
        if (!this.portalMap.has(id)) {
            throw new Error(`No ContentPortal with the id "${id}" exists.`);
        }
    }
}
