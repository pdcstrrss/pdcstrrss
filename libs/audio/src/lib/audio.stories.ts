import { Meta, StoryFn } from '@storybook/web-components';
import { html } from 'lit';
// import { ifDefined } from 'lit/directives/if-defined.js';

import type { PdcstrrssAudio } from './audio';
import './audio';

export default {
  title: 'Organism/Audio',
  // Need to set the tag to make addon-docs works properly with CustomElementsManifest
  component: 'pdcstrrss-audio',
  // argTypes: {
  //   onClick: { action: 'onClick' },
  // },
  // parameters: {
  //   actions: {
  //     handles: ['click', 'pdcstrrss-audio:click'],
  //   },
  // },
} as Meta;

const Template: StoryFn<PdcstrrssAudio> = ({ source }) => html`<pdcstrrss-audio source="${source}"></pdcstrrss-audio>`;

export const Default: StoryFn<PdcstrrssAudio> = Template.bind({});
Default.args = {
  source: 'https://assets.mixkit.co/sfx/preview/mixkit-game-show-suspense-waiting-667.mp3',
};
