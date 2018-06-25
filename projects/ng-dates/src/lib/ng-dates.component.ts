import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';

import * as momentNs from 'moment';
const moment = momentNs;

export interface DayObject {
  day: momentNs.Moment;
  label: string;
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
  @Input() public startOfWeek = 0;
  @Input() public full: boolean;
  @Output() public selected: EventEmitter<momentNs.Moment> = new EventEmitter();


  public days: String[];
  public title: String;
  public daysInMonth: DayObject[];

  public currentSelection: momentNs.Moment;
  public today: momentNs.Moment = moment().startOf('day');
  private fromDay: momentNs.Moment;
  private toDay: momentNs.Moment;
  private hoverDay: momentNs.Moment;

  public ngOnInit() {
    this.days = this.weekDays().map((day) => {
      return this.capitalize(day);
    });
    this.fromDay = this.from ? this.from.clone().startOf('day') : null;
    this.toDay = this.to ? this.to.clone().startOf('day') : null;
    this.currentSelection = this.current ? this.current.clone().startOf('month').startOf('day') : moment().startOf('day');
    this.setTitle();
    this.calculateMonthDays();
  }

  public weekDays() {
    const weekdays = moment.weekdaysShort();
    weekdays.push(...weekdays.splice(0, this.startOfWeek));
    return weekdays;
  }

  public capitalize(string: string) {
    return string.toLocaleLowerCase().replace(/^[a-z]/, (m) => m.toUpperCase());
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
    this.title = this.capitalize(this.currentSelection.format('MMMM YYYY'));
  }

  private calculateMonthDays(): void {
    const days = this.currentSelection.daysInMonth();
    const currentMonthDays = [];
    for (let i = 1; i <= days; i++) {
      const day = this.currentSelection.clone().date(i);
      const dayObj = this.generateDateObject(day);
      currentMonthDays.push(dayObj);
    }

    const prevMonthDays = [];
    const nextMonthDays = [];

    const firstDay = currentMonthDays[0].day;
    const prevCount = (((firstDay.day() - this.startOfWeek) % 7) + 7) % 7;
    for (let x = 0; x < prevCount; x++) {
      const day = firstDay.clone().subtract(x, 'days');
      const dayObj = this.generateDateObject(day);
      if (this.full) {
        prevMonthDays.unshift(dayObj);
      } else {
        prevMonthDays.unshift(null);
      }
    }
    const lastDay = currentMonthDays[days - 1].day;
    let nextCount = 0;
    const maxDays = ((6 + this.startOfWeek) - lastDay.day()) % 7;
    for (let y = 0; y < maxDays ; y++) {
      nextCount++;
      const day = lastDay.clone().add(nextCount, 'days');
      const dayObj = this.generateDateObject(day);
      if (this.full) {
        nextMonthDays.push(dayObj);
      } else {
        nextMonthDays.unshift(null);
      }
    }

    this.daysInMonth = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  }


  private generateDateObject(day: momentNs.Moment): DayObject {
    return {
      day,
      label: day.format('D')
    };
  }

  private calculateDayStatus(day: momentNs.Moment): string {
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
    return status;
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
    const status = this.calculateDayStatus(day.day);
    if (status !== 'disabled') {
      this.selected.emit(day.day);
    }
  }

  public hoverOn(day: DayObject): void {
    if ((this.fromDay || this.toDay) && (!this.hoverDay || !this.hoverDay.isSame(day.day))) {
      this.hoverDay = day.day;
    }
  }

  public hoverOff(): void {
    if (this.fromDay || this.toDay) {
      this.hoverDay = null;
    }
  }

  public calculateCssClass(day: DayObject): String {
    const status = this.calculateDayStatus(day.day);
    const dayPrefix = 'ng-dates__day--';
    return `${dayPrefix}${status}`;
  }
}

