import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { AudioPlayStateController } from './audio-play-state-controller.js';
import { AudioSpeedController } from './audio-speed-controller.js';
import { AudioTimeController } from './audio-time-controller.js';
import { AudioVolumeController } from './audio-volume-controller.js';

@customElement('pdcstrrss-audio')
export class PdcstrrssAudio extends LitElement {
  @property({ type: String }) source = '';
  @property({ type: String }) label = '';
  @property({ type: Boolean }) autoplay = false;
  @property({ type: Boolean }) loop = false;
  @property({ type: Boolean }) muted = false;
  @property({ type: Number }) volume = 1;

  #audioElement: HTMLAudioElement;
  #playStateController: AudioPlayStateController;
  #timeController: AudioTimeController;
  #volumeController: AudioVolumeController;
  #speedController: AudioSpeedController;

  constructor() {
    super();
    this.#audioElement = new Audio();
    this.#playStateController = new AudioPlayStateController(this, this.#audioElement);
    this.#timeController = new AudioTimeController(this, this.#audioElement);
    this.#volumeController = new AudioVolumeController(this, this.#audioElement);
    this.#speedController = new AudioSpeedController(this, this.#audioElement);
  }

  override connectedCallback() {
    super.connectedCallback();
    this.#audioElement.src = this.source;
    this.#audioElement.addEventListener('loadedmetadata', () => this.requestUpdate());
  }

  override render() {
    return html`
      <fieldset>
        <legend>Time</legend>
        <button @click=${() => this.#playStateController.togglePlayState()}>
          ${this.#playStateController.playState === 'playing' ? 'Pause' : 'Play'}
        </button>
      </fieldset>

      <fieldset>
        <legend>Time</legend>
        <div>
          <span>${this.#timeController.getHumanCurrentTime}</span>
          <span>/</span>
          <span>${this.#timeController.getHumanDuration}</span>
        </div>
        <button ?disabled=${!this.#timeController.canRewind} @click=${() => this.#timeController.rewind(15)}>
          -15s
        </button>
        <input
          aria-label="Progress for ${this.label}"
          type="range"
          min="0"
          max="100"
          .value="${this.#timeController.progressPercentage.toString()}"
          step="1"
          @change=${this.#timeController.handleTimeRangeChange}
        />
        <button ?disabled=${!this.#timeController.canForward} @click=${() => this.#timeController.forward(15)}>
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
          .value="${this.#volumeController.currentVolume.toString()}"
          step=".01"
          @input=${this.#volumeController.handleVolumeRangeChange}
        />
        <div>
          <span>${this.#volumeController.currentVolume}</span>
        </div>
      </fieldset>

      <fieldset>
        <legend>Playback speed</legend>
        <select @change=${this.#speedController.handleSpeedChange}>
          ${this.#speedController.playbackRateOptions.map(
            (option) =>
              html`<option ?selected=${option === this.#speedController.currentPlaybackRate}>${option}</option>`
          )}
        </select>
        <table>
          <tbody>
            <tr>
              <td>Playback rate</td>
              <td>${this.#audioElement.playbackRate}</td>
            </tr>
            <tr>
              <td>Speedcontroller</td>
              <td>${this.#speedController.currentPlaybackRate}</td>
            </tr>
          </tbody>
        </table>
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
