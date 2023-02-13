import { Utilities } from './utilities.js';

export class TimeController {
  private _currentTime = 0;
  public get currentTime() {
    return this._currentTime;
  }
  public set currentTime(value) {
    this._currentTime = value;
  }

  private _duration = 0;
  public get duration() {
    return this._duration;
  }
  public set duration(value) {
    this._duration = value;
  }

  get getHumanCurrentTime() {
    return Utilities.formatSecondsToHumanTime(this.currentTime);
  }

  get getHumanDuration() {
    return Utilities.formatSecondsToHumanTime(this.duration);
  }

  get progressPercentage() {
    return (this.currentTime / this.duration) * 100;
  }

  getCurrentTimeFromPercentage(currentTimePercentage: number) {
    return Utilities.transformAbsoluteFromPercentage(currentTimePercentage, this.duration);
  }

  get canRewind() {
    return this.currentTime > 0;
  }

  rewind(seconds: number) {
    if (!this.canRewind) return;
    if (this.currentTime - seconds < 0) {
      this.currentTime = 0;
      return;
    }
    this.currentTime -= seconds;
  }

  get canForward() {
    return this.duration > this.currentTime;
  }

  forward(seconds: number) {
    if (!this.canForward) return;
    if (this.currentTime + seconds > this.duration) {
      this.currentTime = this.duration;
      return;
    }
    this.currentTime = this.currentTime + seconds;
  }
}
