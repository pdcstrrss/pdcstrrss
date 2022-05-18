import { render } from '@testing-library/react';

import { LoginView } from './LoginView';

describe('LoginView', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LoginView />);
    expect(baseElement).toBeTruthy();
  });
});
