import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';

import * as momentNs from 'moment';
const moment = momentNs;

export interface DayObject {
  day: momentNs.Moment;
  label: string;
  status: string;
}

@Component({
  selector: 'ng-dates',
  templateUrl: './ng-dates.component.html',
  styleUrls: ['./ng-dates.component.scss']
})
export class NgDatesComponent implements OnInit, OnChanges {

  @Input() public from: momentNs.Moment;
  @Input() public to: momentNs.Moment;
  @Input() public min: momentNs.Moment;
  @Input() public max: momentNs.Moment;
  @Input() public current: momentNs.Moment;
  @Output() public selected: EventEmitter<momentNs.Moment> = new EventEmitter();

  public days: String[] = moment.weekdaysShort();
  public currentSelection: momentNs.Moment = moment().startOf('day');
  public today: momentNs.Moment = this.currentSelection.clone();
  public title: String;
  public daysInMonth: DayObject[];

  private fromDay: momentNs.Moment;
  private toDay: momentNs.Moment;
  private hoverDay: momentNs.Moment;

  public ngOnInit() {
    this.fromDay = this.from ? this.from.clone().startOf('day') : null;
    this.toDay = this.to ? this.to.clone().startOf('day') : null;
    this.setTitle();
    this.calculateMonthDays();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.current) {
      const { previousValue, currentValue, firstChange} = changes.current;
      if (!firstChange && previousValue !== currentValue) {
        if (currentValue) {
          this.calculateMonthDays();
        }
      }
    }
  }

  private setTitle(): void {
    this.title = this.currentSelection.format('MMMM YYYY');
  }

  private calculateMonthDays(): void {
    const days = this.currentSelection.daysInMonth();
    const currentMonthDays = [];
    for (let i = 1; i <= days; i++) {
      const day = this.currentSelection.clone().date(i);
      const dayObj = this.generateDateObject(day);
      currentMonthDays.push(dayObj);
    }

    const firstDay = currentMonthDays[0].day;
    const prevMonthDays = [];
    const firstDayWeek = firstDay.day();
    const prevCount = firstDayWeek !== 0 ? firstDayWeek : 7;
    for (let x = 1; x < prevCount; x++) {
      const day = firstDay.clone().subtract(x, 'days');
      const dayObj = this.generateDateObject(day);
      prevMonthDays.unshift(dayObj);
    }

    const lastDay = currentMonthDays[days - 1].day;
    const nextMonthDays = [];
    let nextCount = 0;
    for (let y = lastDay.day(); y < 7 ; y++) {
      nextCount++;
      const day = lastDay.clone().add(nextCount, 'days');
      const dayObj = this.generateDateObject(day);
      nextMonthDays.push(dayObj);
    }
    this.daysInMonth = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  }

  private generateDateObject(day: momentNs.Moment): DayObject {
    let status = '';
    if (this.min && this.min > day || this.max && this.max < day) {
      status = 'disabled';
    } else if (
        (this.fromDay && this.fromDay.isSame(day)) ||
        (this.toDay && this.toDay.isSame(day)) ||
        (!this.hoverDay && this.current && this.current.isSame(day)) ||
        (this.hoverDay && this.hoverDay.isSame(day))
      ) {
      status = 'selected';
    } else if (
        this.fromDay &&
        (
          (this.hoverDay && this.fromDay < day && this.hoverDay > day) ||
          (!this.hoverDay && this.current && this.fromDay < day && this.current > day)
        )
      ) {
      status = 'hover';
    } else if (
        this.toDay &&
        (
          (this.hoverDay && this.toDay > day && this.hoverDay < day) ||
          (!this.hoverDay && this.current && this.toDay > day && this.current < day)
          )
      ) {
      status = 'hover';
    } else if (this.today && this.today.isSame(day)) {
      status = 'today';
    } else {
      status = 'active';
    }
    return {
      day,
      label: day.format('D'),
      status
    };
  }

  public prevMonth(): void {
    this.currentSelection.add(1, 'months');
    this.setTitle();
    this.calculateMonthDays();
  }

  public nextMonth(): void {
    this.currentSelection.subtract(1, 'months');
    this.setTitle();
    this.calculateMonthDays();
  }

  public selectDay(day: DayObject): void {
    if (day.status !== 'disabled') {
      this.selected.emit(day.day);
    }
  }

  private calculateHoverDays(): void {
    this.daysInMonth = this.daysInMonth.map((day) => {
      return this.generateDateObject(day.day);
    });
  }

  public hoverOn(day: DayObject): void {
    if ((this.fromDay || this.toDay) && (!this.hoverDay || !this.hoverDay.isSame(day.day))) {
      this.hoverDay = day.day;
      this.calculateHoverDays();
    }
  }

  public hoverOff(): void {
    if (this.fromDay || this.toDay) {
      this.hoverDay = null;
      this.calculateHoverDays();
    }
  }

  public calculateCssClass(status: String): String {
    const dayPrefix = 'ng-dates__day--';
    return `${dayPrefix}${status}`;
  }
}

