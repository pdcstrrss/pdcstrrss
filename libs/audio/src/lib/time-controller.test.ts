import { TimeController } from './time-controller.js';

describe('time controller', () => {
  const timeController = new TimeController();
  timeController.currentTime = 0;
  timeController.duration = 41;

  it('should have correct initial state', () => {
    expect(timeController.canForward).toEqual(true);
    expect(timeController.canRewind).toEqual(false);
    expect(timeController.getHumanCurrentTime).toEqual('00:00');
    expect(timeController.getHumanDuration).toEqual('00:41');
  });
});
