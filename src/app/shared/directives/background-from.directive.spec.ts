import { BackgroundFromDirective } from './background-from.directive';

describe('BackgroundFromDirective', () => {
    it('should create an instance', () => {
        const directive = new BackgroundFromDirective();
        expect(directive).toBeTruthy();
    });
});

// `
// <div [meshBackgroundFrom]="'somename'"></div>

// <div meshBackgroundFrom="somename"></div>
// `

