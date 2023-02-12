import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { TimeController } from './time-controller.js';

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

  audioElement: HTMLAudioElement;

  timeController: TimeController;

  constructor() {
    super();
    this.audioElement = new Audio();
    this.timeController = new TimeController(this, this.audioElement);
  }

  override connectedCallback() {
    super.connectedCallback();
    this.audioElement.src = this.source;
    this.audioElement.addEventListener('loadedmetadata', () => this.requestUpdate());
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

  handleRangeChange(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.timeController.currentTime = this.timeController.getCurrentTimeFromPercentage(Number(value));
    this.requestUpdate();
  }

  override render() {
    return html` <div class="root">
      <button @click=${this.togglePlayState}>${this.playState === 'playing' ? 'Pause' : 'Play'}</button>

      <div>
        <span>${this.timeController.getHumanCurrentTime}</span>
        <span>/</span>
        <span>${this.timeController.getHumanDuration}</span>
      </div>

      <button ?disabled=${this.timeController.canRewind} @click=${() => this.timeController.rewind(15)}>-15s</button>

      <input
        aria-label="Progress for ${this.label}"
        type="range"
        min="0"
        max="100"
        .value="${this.timeController.progressPercentage.toString()}"
        step="1"
        @change=${this.handleRangeChange}
      />

      <button ?disabled=${this.timeController.canForward} @click=${() => this.timeController.forward(15)}>+15s</button>
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
