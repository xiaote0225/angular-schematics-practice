import { Component, Input } from '@angular/core';

@Component({
    selector:'hello-wang-xun003', //这里使用dasherize
    template: `<h1>Hello {{name}}!</h1>`,
    styles: [`h1 { font-family: Lato;}`]
})
export class HelloWangXun003!Component{ //这里使用classify
    @Input() name: string;
}