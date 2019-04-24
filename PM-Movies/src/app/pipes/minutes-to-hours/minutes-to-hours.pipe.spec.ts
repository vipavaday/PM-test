import { MinutesToHoursPipe } from './minutes-to-hours.pipe';

describe('MinutesToHoursPipe', () => {

  let pipe: MinutesToHoursPipe;

  beforeEach(() => {
    pipe = new MinutesToHoursPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return Unknown duration when undefined', () => {
    expect(pipe.transform(undefined)).toEqual('Unknown duration');
  });

  it('should return Unknown duration when NaN', () => {
    expect(pipe.transform(Number.NaN)).toEqual('Unknown duration');
  });

  it('should return minutes when inferior to an hour', () => {
    expect(pipe.transform(22)).toEqual('22 min');
  });

  it('should return 0 minutes when 0 as input', () => {
    expect(pipe.transform(0)).toEqual('0 min');
  });

  it('should return hours and minutes when superior to an hour', () => {
    expect(pipe.transform(90)).toEqual('1 h 30');
  });

  it('should format minutes with two digits when minutes < 10 and hours > 0', () => {
    expect(pipe.transform(65)).toEqual('1 h 05');
  });

  it('should format minutes with two digits when pure hours', () => {
    expect(pipe.transform(60)).toEqual('1 h 00');
  });

});
