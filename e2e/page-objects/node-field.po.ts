import { browser, by, element } from 'protractor';

export class NodeField {
    async chooseVehicleImage() {
        await this.getFolder().click();
        await this.getFolder().click();
        await this.getBrowseButton().click();
        await this.getProjectBreadcrumb().click();
        await this.getVehicleImagesButton().click();
        await this.getFirstCheckbox().click();
        await this.getChooseButton().click();
    }

    getFolder() {
        return element.all(by.css('a')).get(3);
    }

    getBrowseButton() {
        return element.all(by.css('.right-panel .show-on-hover gtx-button')).first();
    }

    getProjectBreadcrumb() {
        return element.all(by.css('.breadcrumb')).get(2);
    }

    getVehicleImagesButton() {
        return element.all(by.css('.node-browser-container')).get(3);
    }

    getFirstCheckbox() {
        return element.all(by.css('gtx-checkbox')).first();
    }

    getChooseButton() {
        return element.all(by.css('button')).get(33);
    }

    getPath() {
        return element.all(by.css('label.path')).get(0);
    }
}
