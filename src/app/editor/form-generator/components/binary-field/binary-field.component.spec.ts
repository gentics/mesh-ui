import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { GenticsUICoreModule } from 'gentics-ui-core';
import { BinaryFieldComponent } from './binary-field.component';
import createSpy = jasmine.createSpy;

describe('BinaryFieldComponent:', () => {

    let fixture: ComponentFixture<BinaryFieldComponent>;
    let instance: BinaryFieldComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [GenticsUICoreModule, FormsModule],
            declarations: [BinaryFieldComponent]
        });
        fixture = TestBed.createComponent(BinaryFieldComponent);
        instance = fixture.componentInstance;
    });
});
