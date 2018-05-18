import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgDatesComponent } from './ng-dates.component';

@NgModule({
  imports: [CommonModule],
  declarations: [NgDatesComponent],
  exports: [NgDatesComponent]
})
export class NgDatesModule { }
