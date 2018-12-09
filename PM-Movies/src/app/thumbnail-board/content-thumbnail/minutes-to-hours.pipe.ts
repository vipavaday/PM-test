import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutesToHours'
})
export class MinutesToHoursPipe implements PipeTransform {

  transform(minutes: number): string {

    if(minutes == null || Number.isNaN(minutes) || minutes == 0){
      return 'Unknown';
    }

    let hours = (minutes == 0)? 0 : Math.floor(minutes / 60);
    let minutesLeft = minutes % 60;

    if(hours > 0){

      return hours + ' h '+ minutesLeft;
    }

    return minutes + ' "';
  }

}
