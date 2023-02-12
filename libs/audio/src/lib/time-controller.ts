import { ReactiveController, ReactiveControllerHost } from 'lit';

export class TimeController implements ReactiveController {
  constructor(private host: ReactiveControllerHost, private audioElement: HTMLAudioElement) {
    (this.host = host).addController(this);
    this.audioElement = audioElement;
  }

  get currentTime() {
    return this.audioElement.currentTime;
  }

  set currentTime(value: number) {
    this.audioElement.currentTime = value;
    this.host.requestUpdate();
  }

  get getHumanCurrentTime() {
    return this.formatSecondsToHumanTime(this.currentTime);
  }

  get duration() {
    const { currentTime, duration } = this.audioElement;
    const sanitizedDuration = isNaN(duration) ? currentTime : duration;
    return sanitizedDuration;
  }

  get getHumanDuration() {
    return this.formatSecondsToHumanTime(this.duration);
  }

  get progressPercentage() {
    return (this.currentTime / this.duration) * 100;
  }

  getCurrentTimeFromPercentage(percentage: number) {
    return (percentage / 100) * this.duration;
  }

  formatSecondsToHumanTime(seconds: number) {
    if (isNaN(seconds)) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = Math.floor(seconds % 60);
    const formattedSeconds = secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft;
    return `${minutes}:${formattedSeconds}`;
  }

  get canRewind() {
    return this.currentTime === 0;
  }

  rewind(seconds: number) {
    if (this.canRewind) return;
    if (this.currentTime - seconds < 0) {
      this.currentTime = 0;
    }
    this.currentTime -= seconds;
  }

  get canForward() {
    return this.duration === this.currentTime;
  }

  forward(seconds: number) {
    if (this.canForward) return;
    if (this.currentTime + seconds > this.duration) {
      this.currentTime = this.duration;
    }
    this.currentTime += seconds;
  }

  hostConnected() {
    this.audioElement.addEventListener('timeupdate', () => this.host.requestUpdate());
  }

  hostDisconnected() {
    // Do nothing
  }
}
