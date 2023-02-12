import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('pdcstrrss-audio')
export class PdcstrrssAudio extends LitElement {
  @property({ type: String }) source = '';
  @property({ type: String }) label = '';
  @property({ type: Boolean }) autoplay = false;
  @property({ type: Boolean }) loop = false;
  @property({ type: Boolean }) muted = false;
  @property({ type: Number }) volume = 1;

  @state()
  playState: 'playing' | 'paused' = 'paused';

  get currentTime() {
    return this.audioElement.currentTime;
  }

  set currentTime(value: number) {
    this.audioElement.currentTime = value;
    this.requestUpdate();
  }

  get duration() {
    const { currentTime, duration } = this.audioElement;
    const sanitizedDuration = isNaN(duration) ? currentTime : duration;
    return sanitizedDuration;
  }

  get progressPercentage() {
    return (this.currentTime / this.duration) * 100;
  }

  audioElement: HTMLAudioElement;

  constructor() {
    super();
    this.audioElement = new Audio();
  }

  override connectedCallback() {
    super.connectedCallback();
    this.audioElement.src = this.source;
    this.audioElement.addEventListener('timeupdate', () => {
      this.requestUpdate();
    });
    this.audioElement.addEventListener('loadedmetadata', () => {
      this.requestUpdate();
    });
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

  formatSecondsToHumanTime(seconds: number) {
    if (isNaN(seconds)) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = Math.floor(seconds % 60);
    const formattedSeconds = secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft;
    return `${minutes}:${formattedSeconds}`;
  }

  getCurrentTimeFromPercentage(percentage: number) {
    return (percentage / 100) * this.duration;
  }

  handleRangeChange(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.currentTime = this.getCurrentTimeFromPercentage(Number(value));
    this.requestUpdate();
  }

  canRewind() {
    return this.currentTime === 0;
  }

  rewind(seconds: number) {
    if (this.canRewind()) return;
    if (this.currentTime - seconds < 0) {
      this.currentTime = 0;
    }
    this.currentTime -= seconds;
  }

  canForward() {
    return this.duration === this.currentTime;
  }

  forward(seconds: number) {
    if (this.canForward()) return;
    if (this.currentTime + seconds > this.duration) {
      this.currentTime = this.duration;
    }
    this.currentTime += seconds;
  }

  override render() {
    return html` <div class="root">
      <button @click=${this.togglePlayState}>${this.playState === 'playing' ? 'Pause' : 'Play'}</button>
      <div>
        <span>${this.formatSecondsToHumanTime(this.currentTime)}</span>
        <span>/</span>
        <span>${this.formatSecondsToHumanTime(this.duration)}</span>
      </div>

      <button ?disabled=${this.canRewind()} @click=${() => this.rewind(15)}>-15s</button>

      <input
        aria-label="Progress for ${this.label}"
        type="range"
        min="0"
        max="100"
        .value="${this.progressPercentage.toString()}"
        step="1"
        @change=${this.handleRangeChange}
      />

      <button ?disabled=${this.canForward()} @click=${() => this.forward(15)}>+15s</button>
    </div>`;
  }

  static override styles = css`
    .root {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
  `;
}
