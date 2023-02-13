import { ReactiveController, ReactiveControllerHost } from 'lit';

export class AudioSpeedController implements ReactiveController {
  constructor(private host: ReactiveControllerHost, private audioElement: HTMLAudioElement) {
    (this.host = host).addController(this);
    this.audioElement = audioElement;
  }

  get currentPlaybackRate() {
    return this.audioElement.playbackRate;
  }

  set currentPlaybackRate(value: number) {
    this.audioElement.playbackRate = value;
    this.host.requestUpdate();
  }

  get playbackRateOptions() {
    return [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  }

  handleSpeedChange(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.currentPlaybackRate = Number(value);
    this.host.requestUpdate();
  }

  hostConnected() {
    // Do nothing
  }

  hostDisconnected() {
    // Do nothing
  }
}
