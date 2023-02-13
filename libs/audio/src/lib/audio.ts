import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { AudioTimeController } from './audio-time-controller.js';
import { AudioVolumeController } from './audio-volume-controller.js';
import { Utilities } from './utilities.js';

@customElement('pdcstrrss-audio')
export class PdcstrrssAudio extends LitElement {
  @property({ type: String }) source = '';
  @property({ type: String }) label = '';
  @property({ type: Boolean }) autoplay = false;
  @property({ type: Boolean }) loop = false;
  @property({ type: Boolean }) muted = false;
  @property({ type: Number }) volume = 1;

  @state()
  private playState: 'playing' | 'paused' = 'paused';

  private audioElement: HTMLAudioElement;

  private timeController: AudioTimeController;

  private volumeController: AudioVolumeController;

  constructor() {
    super();
    this.audioElement = new Audio();
    this.timeController = new AudioTimeController(this, this.audioElement);
    this.volumeController = new AudioVolumeController(this, this.audioElement);
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

  handleTimeRangeChange(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.timeController.currentTime = this.timeController.getCurrentTimeFromPercentage(Number(value));
    this.requestUpdate();
  }

  handleVolumeRangeChange(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.volumeController.currentVolume = Utilities.roundToDecimalPlaces(Number(value), 2);
    this.requestUpdate();
  }

  override render() {
    return html`
      <fieldset>
        <legend>Time</legend>
        <button @click=${this.togglePlayState}>${this.playState === 'playing' ? 'Pause' : 'Play'}</button>
      </fieldset>

      <fieldset>
        <legend>Time</legend>
        <div>
          <span>${this.timeController.getHumanCurrentTime}</span>
          <span>/</span>
          <span>${this.timeController.getHumanDuration}</span>
        </div>
        <button ?disabled=${!this.timeController.canRewind} @click=${() => this.timeController.rewind(15)}>-15s</button>
        <input
          aria-label="Progress for ${this.label}"
          type="range"
          min="0"
          max="100"
          .value="${this.timeController.progressPercentage.toString()}"
          step="1"
          @change=${this.handleTimeRangeChange}
        />
        <button ?disabled=${!this.timeController.canForward} @click=${() => this.timeController.forward(15)}>
          +15s
        </button>
      </fieldset>

      <fieldset>
        <legend>Volume</legend>
        <input
          aria-label="Volume for ${this.label}"
          type="range"
          min="0"
          max="1"
          .value="${this.volumeController.currentVolume.toString()}"
          step=".01"
          @input=${this.handleVolumeRangeChange}
        />
        <div>
          <span>${this.volumeController.currentVolume}</span>
        </div>
      </fieldset>
    `;
  }

  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  `;
}
