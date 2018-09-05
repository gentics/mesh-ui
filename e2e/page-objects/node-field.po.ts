import { by, element } from 'protractor';

export class NodeField {
    getBrowseButton() {
        return element.all(by.css('.right-panel .show-on-hover gtx-button')).first();
    }

    getBreadcrumbLink() {
        return element.all(by.css('a.breadcrumb')).get(2);
    }

    getFolderButton(folderName: string) {
        return element(by.cssContainingText('.node-browser-container', folderName));
    }

    getFirstCheckbox() {
        return element.all(by.css('gtx-checkbox')).first();
    }

    getPath() {
        return element.all(by.css('label.path')).get(0);
    }
}
