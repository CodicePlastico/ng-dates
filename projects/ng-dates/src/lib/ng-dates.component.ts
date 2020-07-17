import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';

import * as momentNs from 'moment';
const moment = momentNs;

export interface DayObject {
  day: momentNs.Moment;
  label: string;
}

export interface NgDatesColors {
  background: string;
  text: string;
  day_selected_bg: string;
  day_selected_bg_light: string;
  day_selected_text: string;
}
export type NgDatesTheme = 'green' | 'red';
export type NgDatesColorsInput = NgDatesColors | NgDatesTheme;

export type RuleType = 'exclude' | 'include';

export interface Rule {
  type: RuleType;
  dates: momentNs.Moment[];
}

const themeColors = {
  green: {
    background: '#FFF',
    text: '#090909',
    day_selected_bg: '#006633',
    day_selected_bg_light: '#4A8B4F',
    day_selected_text: '#FFF',
  },
  red: {
    background: '#FFF',
    text: '#000',
    day_selected_bg: '#D20019',
    day_selected_bg_light: '#E2343A',
    day_selected_text: '#FFF',
  }
};

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
  @Input() public availabilityRule: Rule;
  @Input() public startOfWeek = 0;
  @Input() public full: boolean;
  @Input() public colorScheme: NgDatesColorsInput;
  @Output() public selected: EventEmitter<momentNs.Moment> = new EventEmitter();


  public days: String[];
  public title: String;
  public daysInMonth: DayObject[];

  public currentSelection: momentNs.Moment;
  public today: momentNs.Moment = moment().startOf('day');
  private fromDay: momentNs.Moment;
  private toDay: momentNs.Moment;
  private hoverDay: momentNs.Moment;
  private dayHover: momentNs.Moment;

  public colors: NgDatesColors;

  public ngOnInit() {
    this.days = this.weekDays().map((day) => {
      return this.capitalize(day);
    });
    this.fromDay = this.from ? this.from.clone().startOf('day') : null;
    this.toDay = this.to ? this.to.clone().startOf('day') : null;
    this.currentSelection = this.current ? this.current.clone().startOf('month').startOf('day') : moment().startOf('day');
    this.setTitle();
    this.calculateMonthDays();

    // set the colors
    if (this.colorScheme) {
      if (typeof this.colorScheme === 'string') { // predefined theme
        this.colors = themeColors[this.colorScheme];
      } else { // custom colors
        this.colors = this.colorScheme;
      }
    } else { // default theme
      this.colors = themeColors.green;
    }
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

  private isExcluded(day: momentNs.Moment) {
    if (this.availabilityRule) {
      const found = this.availabilityRule.dates.find(d => {
        const availableDay = d.clone().startOf('day');
        return availableDay.isSame(day);
      });
      switch (this.availabilityRule.type) {
        case 'exclude':
          return found;
        case 'include':
          return !found;
        default:
          return false;
      }
    }
    return false;
  }

  private calculateDayStatus(day: momentNs.Moment): string {
    let status = '';
    if (this.min && this.min > day || this.max && this.max < day || this.isExcluded(day)) {
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
    } else if (this.dayHover && this.dayHover.isSame(day)) {
      status = 'active-hover';
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
    this.dayHover = day.day;
    if ((this.fromDay || this.toDay) && (!this.hoverDay || !this.hoverDay.isSame(day.day))) {
      this.hoverDay = day.day;
    }
  }

  public hoverOff(): void {
    this.dayHover = null;
    if (this.fromDay || this.toDay) {
      this.hoverDay = null;
    }
  }

  public calculateCssClass(day: DayObject): String {
    const status = this.calculateDayStatus(day.day);
    const dayPrefix = 'ng-dates__day--';
    return `${dayPrefix}${status}`;
  }

  public calculateStyle(day: DayObject): any {
    const status = this.calculateDayStatus(day.day);
    const style = {};

    if (status === 'selected') {
      style['background-color'] = this.colors.day_selected_bg;
      style['color'] = this.colors.day_selected_text;
    } else if (status === 'today') {
      style['color'] = this.colors.day_selected_bg;
      style['font-weight'] = 'bold';
    } else if (status === 'hover') {
      style['background-color'] = this.colors.day_selected_bg_light;
      style['color'] = this.colors.day_selected_text;
    } else if (status === 'disabled') {
      style['opacity'] = 0.4;
    } else if (status === 'active-hover') {
      style['background-color'] = this.colors.day_selected_bg_light;
      style['color'] = this.colors.day_selected_text;
      style['border-radius'] = '2px';
    }

    return style;
  }
}

