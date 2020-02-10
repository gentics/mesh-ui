import { t } from 'testcafe';

export class Thumbnail {
    public constructor(private element: Selector) {}

    public imageUrl(): Promise<string> {
        const img = this.element.find('img') as any;
        return t.eval(() => img().src, { dependencies: { img } });
    }

    public showsImage(): Promise<boolean> {
        return this.element.find('img').exists;
    }
}
