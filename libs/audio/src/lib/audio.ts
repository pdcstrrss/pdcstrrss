import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('pdcstrrss-audio')
export class PdcstrrssAudio extends LitElement {
  @property({ type: String }) src = '';
  @property({ type: Boolean }) autoplay = false;
  @property({ type: Boolean }) loop = false;
  @property({ type: Boolean }) muted = false;
  @property({ type: Number }) volume = 1;

  @state()
  playState: 'playing' | 'paused' = 'paused';

  audioElement: HTMLAudioElement;

  constructor() {
    super();
    this.audioElement = new Audio();
  }

  override connectedCallback() {
    super.connectedCallback();
    this.audioElement.src = this.src;
  }

  togglePlayState() {
    if (this.audioElement.paused) {
      this.audioElement.play();
      this.playState = 'playing';
    } else {
      this.audioElement.pause();
      this.playState = 'paused';
    }
  }

  override render() {
    return html` <button @click=${this.togglePlayState}>${this.playState === 'playing' ? 'Pause' : 'Play'}</button> `;
  }

  static override styles = css``;
}
