import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

import { IndexView } from './IndexView.js';

describe('IndexView', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<IndexView />);
    expect(baseElement).toBeTruthy();
  });
});
