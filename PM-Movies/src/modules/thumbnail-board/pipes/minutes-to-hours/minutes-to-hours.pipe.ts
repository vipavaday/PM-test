import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutesToHours'
})
export class MinutesToHoursPipe implements PipeTransform {

  public transform(minutes: number): string {
    if (minutes === 0 || Number.isNaN(minutes)) {
      return null;
    }

    const hours = Math.floor(minutes / 60);
    const minutesLeft = '' + Math.round(minutes % 60);

    const result: string[] = [ minutesLeft.padStart(2, '0') ];
    if (hours > 0) {
      result.unshift('' + hours);
    }

    if (result.length === 1) {
      return result[0] + ' min ';
    }

    return result.join(' h ');
  }
}
