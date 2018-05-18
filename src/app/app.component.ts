import { Component } from '@angular/core';

import * as moment from 'moment';

@Component({
  selector: 'ng-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public selectedDay: moment.Moment = moment().add('1', 'days');
  public minDay: moment.Moment = moment().subtract('1', 'days');
  public maxDay: moment.Moment = moment().add('2', 'months');

  public show(string, evt) {
    console.log(string, evt);
  }
}
