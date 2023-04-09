import { ReactiveController, ReactiveControllerHost } from 'lit';
import { Utilities } from './utilities.js';

export class AudioVolumeController implements ReactiveController {
  constructor(private host: ReactiveControllerHost, private audioElement: HTMLAudioElement) {
    (this.host = host).addController(this);
    this.audioElement = audioElement;
  }

  get currentVolume() {
    return this.audioElement.volume;
  }

  set currentVolume(value: number) {
    this.audioElement.volume = value;
    this.host.requestUpdate();
  }

  handleVolumeRangeChange(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.currentVolume = Utilities.roundToDecimalPlaces(Number(value), 2);
    this.host.requestUpdate();
  }

  hostConnected() {
    this.audioElement.addEventListener('onvolumechange', () => this.host.requestUpdate());
  }

  hostDisconnected() {
    // Do nothing
  }
}