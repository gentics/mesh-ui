import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {NoContentComponent} from './components/no-content/no-content.component';


@NgModule({
  declarations: [
      NoContentComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
})
export class SharedModule {}
