import { Component } from '@angular/core';

import * as moment from 'moment';
import 'moment/locale/it';
import { Rule } from 'dist/ng-dates/ng-dates';

@Component({
  selector: 'ng-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public fromDay: moment.Moment = moment().startOf('day').add('1', 'days');
  public nextMonth: moment.Moment = moment().startOf('day').add('1', 'months');
  public toDay: moment.Moment = moment().startOf('day').add('15', 'days');
  public minDay: moment.Moment = moment().startOf('day').subtract('1', 'days');
  public maxDay: moment.Moment = moment().startOf('day').add('2', 'months');


  public excludeRule: Rule = {
    type: 'exclude',
    dates: [
      moment().startOf('day').add('3', 'days'),
      moment().startOf('day').add('5', 'days'),
      moment().startOf('day').add('7', 'days'),
    ]
  };

  public includeRule: Rule = {
    type: 'include',
    dates: [
      moment().startOf('day').add('3', 'days'),
      moment().startOf('day').add('5', 'days'),
      moment().startOf('day').add('7', 'days'),
    ]
  };

  constructor() {
    moment.locale('it');
  }

  public show(string, evt) {
    console.log(string, evt);
  }
}
