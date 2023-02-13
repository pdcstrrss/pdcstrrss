import { ReactiveController, ReactiveControllerHost } from 'lit';

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

  hostConnected() {
    this.audioElement.addEventListener('onvolumechange', () => this.host.requestUpdate());
  }

  hostDisconnected() {
    // Do nothing
  }
}
