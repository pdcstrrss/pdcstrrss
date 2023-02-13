import { Utilities } from './utilities.js';

describe('utilities', () => {
  it('should correctly format from seconds to human time', () => {
    expect(Utilities.formatSecondsToHumanTime(60 * 70)).toEqual('70:00');
    expect(Utilities.formatSecondsToHumanTime(71)).toEqual('01:11');
    expect(Utilities.formatSecondsToHumanTime(70)).toEqual('01:10');
    expect(Utilities.formatSecondsToHumanTime(61)).toEqual('01:01');
    expect(Utilities.formatSecondsToHumanTime(60)).toEqual('01:00');
    expect(Utilities.formatSecondsToHumanTime(10)).toEqual('00:10');
    expect(Utilities.formatSecondsToHumanTime(1)).toEqual('00:01');
  });

  it('should correctly format number with leading zeros', () => {
    expect(Utilities.formatIntegerToFixed(1, 0)).toEqual('1');
    expect(Utilities.formatIntegerToFixed(1, 1)).toEqual('1');
    expect(Utilities.formatIntegerToFixed(1, 2)).toEqual('01');
    expect(Utilities.formatIntegerToFixed(1, 3)).toEqual('001');
    expect(Utilities.formatIntegerToFixed(1, 4)).toEqual('0001');
  });
});
