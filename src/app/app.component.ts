import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';
import { Rule } from 'dist/ng-dates/ng-dates';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ng-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public formGroup: FormGroup;
  public formValues: any;
  public selected: string;
  public availabilityDate: FormControl = new FormControl();

  constructor(private fb: FormBuilder) {}

  public ngOnInit() {
    this.initializeForm();
    this.formValues = this.retrieveFormValues(this.formGroup.value);
  }

  private initializeForm(): void {
    this.formGroup = this.fb.group({
      min: [],
      max: [],
      range: this.fb.group({
        from: ['from'],
        value: []
      }),
      current: [],
      availabilityRules: this.fb.group({
        type: ['exclude'],
        dates: this.fb.array([])
      }),
      startOfWeek: [0],
      full: [true],
      color: this.fb.group({
        scheme: ['green'],
        colorScheme: this.fb.group({
          background: ['#ffffff'],
          text: ['#090909'],
          day_selected_bg: ['#006633'],
          day_selected_bg_light: ['#4A8B4F'],
          day_selected_text: ['#ffffff']
        })
      })
    });

    this.formGroup.valueChanges.subscribe({
      next: (values) => {
        this.formValues = this.retrieveFormValues(values);
      }
    });

    this.availabilityDate.valueChanges.subscribe({
      next: (value) => {
        if (this.datesControl && value) {
          const control = new FormControl(moment(value));
          this.datesControl.push(control);
        }
      }
    });
  }

  public get datesControl(): FormArray {
    return this.formGroup.get('availabilityRules')?.get('dates') as FormArray;

  }

  public get dates() {
    return this.datesControl ? this.datesControl.value : [];
  }

  public deleteDate(index) {
    if (this.datesControl) {
      this.datesControl.removeAt(index);
    }
  }

  public show(_, evt: moment.Moment) {
    this.formGroup.get('current').setValue(evt.format('YYYY-MM-DD'));
  }

  private retrieveFormValues(values) {
    const { full, startOfWeek, color } = values;
    const min = values.min ? moment(values.min) : '';
    const max = values.max ? moment(values.max) : '';
    const current = values.current ? moment(values.current) : '';
    const from = values.range.from === 'from' && values.range.value ? moment(values.range.value) : '';
    const to = values.range.from === 'to' && values.range.value ? moment(values.range.value) : '';
    const scheme = color.scheme;
    const colorScheme = color.scheme !== 'custom' ? color.scheme : color.colorScheme;
    const availabilityRule = values.availabilityRules.dates.length > 0
      ? {
          type: values.availabilityRules.type,
          dates: values.availabilityRules.dates
        }
      : null;
    return {full, startOfWeek, min, max, current, to, from, scheme, colorScheme, availabilityRule};
  }
}
