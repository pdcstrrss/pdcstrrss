import { render } from '@testing-library/react';

import Dropdown from './Dropdown';

describe('Dropdown', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Dropdown toggle={({ visibility }) => <button>{visibility ? 'Close' : 'Open'}</button>} />);
    expect(baseElement).toBeTruthy();
  });
});
