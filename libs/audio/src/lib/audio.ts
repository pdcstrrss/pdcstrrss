import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { HTMLAudioElementEventMap } from './audio-event-controller.js';
import { AudioPlayStateController } from './audio-play-state-controller.js';
import { AudioSpeedController } from './audio-speed-controller.js';
import { AudioTimeController } from './audio-time-controller.js';
import { AudioVolumeController } from './audio-volume-controller.js';
import { classMap } from 'lit-html/directives/class-map.js';

@customElement('pdcstrrss-audio')
export class PdcstrrssAudio extends LitElement {
  @property({ type: String }) source = '';
  @property({ type: String }) label = '';
  @property({ type: Boolean }) autoplay = false;
  @property({ type: Boolean }) loop = false;
  @property({ type: Boolean }) muted = false;
  @property({ type: Number }) volume = 1;

  @query('#playbackSpeedDialog')
  _playbackSpeedDialog: HTMLDialogElement | undefined;

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

    HTMLAudioElementEventMap.forEach((eventName) => {
      this.#audioElement.addEventListener(eventName, () => {
        this.dispatchEvent(new CustomEvent(eventName, { detail: this.#audioElement, bubbles: true, composed: true }));
      });
    });
  }

  handlePlaybackSpeedDialogToggle() {
    this._playbackSpeedDialog?.showModal();
  }

  handlePlaybackSpeedDialogClose() {
    if (!this._playbackSpeedDialog) return;
    this.#speedController.handleSpeedChange(this._playbackSpeedDialog.returnValue);
  }

  override render() {
    return html`
      <div class="player">
        <slot name="icon-sprite">
          <svg class="icon-sprite" xmlns="http://www.w3.org/2000/svg">
            <symbol id="play" viewBox="0 0 16 16">
              <path
                fill="currentColor"
                d="m11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"
              />
            </symbol>
            <symbol viewBox="0 0 16 16" id="pause">
              <path
                fill="currentColor"
                d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"
              ></path>
            </symbol>
          </svg>
        </slot>

        <button class="play" @click=${() => this.#playStateController.togglePlayState()}>
          ${this.#playStateController.playState === 'playing'
            ? html`<slot name="pause">
                <svg><use xlink:href="#pause" /></svg>
              </slot>`
            : html`<slot name="play">
                <svg><use xlink:href="#play" /></svg>
              </slot>`}
        </button>

        <!-- Time notation -->
        <span class="time-current">${this.#timeController.getHumanCurrentTime}</span>
        <span class="time-divider">/</span>
        <span class="time-duration">${this.#timeController.getHumanDuration}</span>

        <!-- Time notation -->
        <button
          class="time-rewind"
          ?disabled=${!this.#timeController.canRewind}
          @click=${() => this.#timeController.rewind(15)}
        >
          -15s
        </button>
        <input
          class="time-progress"
          aria-label="Progress for ${this.label}"
          type="range"
          min="0"
          max="100"
          .value="${this.#timeController.progressPercentage.toString()}"
          step="1"
          @change=${(e: InputEvent) => this.#timeController.handleTimeRangeChange(e)}
        />
        <button
          class="time-forward"
          ?disabled=${!this.#timeController.canForward}
          @click=${() => this.#timeController.forward(15)}
        >
          +15s
        </button>

        <div class="playback-speed">
          <button @click=${() => this.handlePlaybackSpeedDialogToggle()}>
            ${this.#speedController.currentPlaybackRate}x
          </button>
          <dialog id="playbackSpeedDialog" @close=${this.handlePlaybackSpeedDialogClose}>
            <strong>Playback speed</strong>

            <form method="dialog">
              <button class="dialog-close" value="${this.#speedController.currentPlaybackRate}">x</button>
              ${this.#speedController.playbackRateOptions.map(
                (option) =>
                  html`<button
                    class=${classMap({ selected: option === this.#speedController.currentPlaybackRate })}
                    value="${option}"
                    type="submit"
                  >
                    ${option}
                  </button>`
              )}
            </form>
          </dialog>
        </div>
      </div>
    `;
  }

  static override styles = css`
    :host {
      font-family: sans-serif;
      font-size: 1em;
      line-height: 1.5;
    }

    .player {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      grid-template-rows: auto auto auto;
      grid-template-areas:
        'time-progress time-progress time-progress time-progress time-progress time-progress time-progress time-progress time-progress time-progress time-progress time-progress'
        'time-current time-current time-current time-current time-current time-current time-duration time-duration time-duration time-duration time-duration time-duration'
        '. . . time-rewind time-rewind play play time-forward time-forward . . playback-speed';
      align-items: center;
      justify-items: center;
    }

    .icon-sprite {
      display: none;
    }

    svg {
      width: 1.5em;
      height: 1.5em;
    }

    button {
      font-size: 1em;
      appearance: none;
      border: none;
      background-color: transparent;
      padding: 0;
      display: flex;
      align-items: center;
    }

    /* Play */
    .play {
      grid-area: play;
      font-size: 2em;
    }

    /* Time */
    .time-current {
      justify-self: start;
      grid-area: time-current;
    }

    .time-duration {
      justify-self: end;
      grid-area: time-duration;
    }

    .time-divider {
      display: none;
    }

    .time-progress {
      grid-area: time-progress;
      justify-self: stretch;
    }

    .time-forward {
      grid-area: time-forward;
    }

    .time-rewind {
      grid-area: time-rewind;
    }

    .playback-speed {
      grid-area: playback-speed;
      justify-self: end;
    }

    dialog {
      min-width: 15em;
      padding: 1.5em;
    }

    dialog[open] {
      display: flex;
      flex-direction: column;
      grid-gap: 1em;
    }

    dialog form {
      display: flex;
      flex-direction: column;
      grid-gap: 0.25em;
    }

    dialog form button:not(.dialog-close) {
      padding: 0.5em;
      margin-inline: -0.5em;
    }

    .dialog-close {
      position: absolute;
      top: 0.5em;
      right: 0.5em;
      padding: 1em;
    }
  `;
}
