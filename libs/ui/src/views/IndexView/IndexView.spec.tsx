import { render } from '@testing-library/react';

import { IndexView } from './IndexView';

describe('IndexView', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<IndexView />);
    expect(baseElement).toBeTruthy();
  });
});
