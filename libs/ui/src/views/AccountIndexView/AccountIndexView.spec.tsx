import { render } from '@testing-library/react';

import AccountIndexView from './AccountIndexView';

describe('AccountIndexView', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AccountIndexView />);
    expect(baseElement).toBeTruthy();
  });
});
