import { ReactiveController, ReactiveControllerHost } from 'lit';
import { TimeController } from './time-controller.js';

export class AudioTimeController extends TimeController implements ReactiveController {
  constructor(private host: ReactiveControllerHost, private audioElement: HTMLAudioElement) {
    super();
    (this.host = host).addController(this);
    this.audioElement = audioElement;
  }

  override get currentTime() {
    return this.audioElement.currentTime;
  }

  override set currentTime(value: number) {
    this.audioElement.currentTime = value;
    this.host.requestUpdate();
  }

  override get duration() {
    const { currentTime, duration } = this.audioElement;
    const sanitizedDuration = isNaN(duration) ? currentTime : duration;
    return sanitizedDuration;
  }

  handleTimeRangeChange(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.currentTime = this.getCurrentTimeFromPercentage(Number(value));
    this.host.requestUpdate();
  }

  hostConnected() {
    this.audioElement.addEventListener('timeupdate', () => this.host.requestUpdate());
  }

  hostDisconnected() {
    // Do nothing
  }
}
