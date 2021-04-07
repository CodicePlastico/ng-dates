# NgDates
Ng Dates is a simple **date picker** for [Angular](https://angular.io) applications.
Inspired by [Ryanair](https://www.ryanair.com/) datepicker, allows you to select a **single date** or a **range** of dates from a predeterminated set.
**Powerful** and **configurable** can be easily integrated into any Angular application.

![npm](https://img.shields.io/npm/v/ng-dates)
![npm](https://img.shields.io/npm/dm/ng-dates)
![npm type definitions](https://img.shields.io/npm/types/ng-dates)

## Installation
Download ng-dates from npm

```js
npm install ng-dates
```

## Usage
Import `NgDatesModule` module in your `AppModule`

```js
import { NgDatesModule } from 'ng-dates';
```

Insert `ng-dates` component in your HTML template

```js
<ng-dates></ng-dates>
```
### Attributes (Input):  
**All attributes are optional** 

| Name                 | Type                                | Default            | Description                                                                                                                                                                                                                                        |  
|----------------------|:-----------------------------------:|:------------------:|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| from                 | `Moment` 		                     | `undefined`        | Range start date                                                                                                                                                                                     |  
| to          			| `Moment`                            | `undefined`        | Range end date                                                                                                                                                                                                        |  
| min             		| `Moment`                            | `undefined`        | Minimum selectable date                                                                                                                                                                                                         |  
| max          			| `Moment`                            | `undefined`        | Max selectable date                                                                                                                                                                                                                  |  
| current    		       | `Moment`                            | `undefined`        | Current selection                                                                                                                                           |  
| availabilityRule     | `{type: exclude | include, dates: Moment[]`| `undefined`       | Allows to narrow the range of selectable dates by including or excluding specific days                                         |  
| startOfWeek          | `Number`                            | 0                  | A number from 0 to 6 to indicate the first day of the week (starting with Sunday)|  
| full              	| `Boolean`                    | `true`        | Show/Hide prev and next months days. 
|  
| colorScheme          | `green | red | NgDatesColors*`                    | `green`        | Customize colors. 

```
* interface NgDatesColors {
  background: string;
  text: string;
  day_selected_bg: string;
  day_selected_bg_light: string;
  day_selected_text: string;
} 
``` 
### Attributes (Output):   
| Name                 | Event Arguments                     | Description                                                                                                                                                      |  
|----------------------|:-----------------------------------:|------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| selected             | `Moment`                            | This event will be emitted when a valid date is clicked  

## People

Proudly made by [CodicePlastico](https://codiceplastico.com/)

## License

[MIT](LICENSE) 
