import {
  Pipe,
  PipeTransform
} from '@angular/core';

@Pipe({
  name: 'minutesToHours'
})
export class MinutesToHoursPipe implements PipeTransform {

  public transform(minutes: number): string {
    if (minutes === undefined || Number.isNaN(minutes)) {
      return 'Unknown duration';
    }

    const hours = Math.floor(minutes / 60);
    const result: string[] = this.padMinutes(Math.round(minutes % 60), hours);

    if (hours > 0) {
      result.unshift('' + hours);
    }

    if (result.length === 1) {
      return result[0] + ' min';
    }

    return result.join(' h ');
  }

  /**
   * Add a zero before minutes if hours are present and minutes are inferior to 10
   */
  private padMinutes(minutes: number, hours: number): string[] {
    const minutesZeroPad = (!!hours && minutes < 10) ? 2 : (!!hours) ? 1 : 0;
    const minutesLeft = minutes + '';

    return [minutesLeft.padStart(minutesZeroPad, '0')];
  }
}
