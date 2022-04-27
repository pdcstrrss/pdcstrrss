import { render } from '@testing-library/react';
import { AppHeaderUser } from '../../components/App/AppHeader/AppHeader';

import { AuthenticatedLayout } from './AuthenticatedLayout';

const mockedUser: AppHeaderUser = {
  displayName: 'Test User',
  image: 'https://example.com/image.png',
};

describe('AuthenticatedLayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AuthenticatedLayout user={mockedUser} />);
    expect(baseElement).toBeTruthy();
  });
});
