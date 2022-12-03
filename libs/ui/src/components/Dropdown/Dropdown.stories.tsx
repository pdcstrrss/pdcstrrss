/* eslint-disable jsx-a11y/anchor-is-valid */
// Button.stories.ts|tsx

import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Dropdown } from './Dropdown';
import '../../layouts/BaseLayout/_dropdown.css';

export default {
  title: 'Dropdown',
  component: Dropdown,
} as ComponentMeta<typeof Dropdown>;

export const Default: ComponentStory<typeof Dropdown> = () => (
  <Dropdown toggle={({ visibility }) => <button>{visibility ? 'Close' : 'Open'}</button>}>
    <a href="#">Test 1</a>
    <a href="#">Test 2</a>
    <a href="#">Test 3</a>
  </Dropdown>
);
