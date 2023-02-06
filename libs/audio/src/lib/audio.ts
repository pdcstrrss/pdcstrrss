import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('pdcstrrss-audio')
export class PdcstrrssAudio extends LitElement {
  @property({ type: String }) src = '';
  @property({ type: Boolean }) autoplay = false;
  @property({ type: Boolean }) loop = false;
  @property({ type: Boolean }) muted = false;
  @property({ type: Number }) volume = 1;

  override render() {
    return html`
      <audio
        src="${this.src}"
        ?autoplay="${this.autoplay}"
        ?loop="${this.loop}"
        ?muted="${this.muted}"
        .volume="${this.volume}"
      ></audio>
    `;
  }
}
