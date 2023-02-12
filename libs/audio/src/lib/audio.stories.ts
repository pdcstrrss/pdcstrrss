import { Meta, Story } from '@storybook/web-components';
import { html } from 'lit';
// import { ifDefined } from 'lit/directives/if-defined.js';

import { PdcstrrssAudio } from './audio';
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

const Template: Story<PdcstrrssAudio> = ({ src }) => html`<pdcstrrss-audio src="${src}"></pdcstrrss-audio>`;

export const Default: Story<PdcstrrssAudio> = Template.bind({});
Default.args = {
  src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
};
