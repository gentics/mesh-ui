import { Directive, Input } from "@angular/core";

@Directive({
    selector: '[meshProjectTo]'
})
export class MockProjectContentDirective {
    @Input() meshProjectTo: string;
}
