import { ReactiveController, ReactiveControllerHost } from 'lit';

export class AudioPlayStateController implements ReactiveController {
  constructor(private host: ReactiveControllerHost, private audioElement: HTMLAudioElement) {
    (this.host = host).addController(this);
    this.audioElement = audioElement;
  }

  get playState() {
    return this.audioElement.paused ? 'paused' : 'playing';
  }

  togglePlayState() {
    if (this.playState === 'paused') {
      this.audioElement.play();
    } else {
      this.audioElement.pause();
    }
    this.host.requestUpdate();
  }

  hostConnected() {
    // Do nothing
  }

  hostDisconnected() {
    // Do nothing
  }
}
