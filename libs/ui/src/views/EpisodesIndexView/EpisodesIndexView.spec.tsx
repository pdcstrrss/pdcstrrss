import { render } from '@testing-library/react';
import { AppHeaderUser } from '../../components/App/AppHeader/AppHeader';

import { EpisodesIndexView } from './EpisodesIndexView';

const mockedUser: AppHeaderUser = {
  displayName: 'Test User',
  image: 'https://example.com/image.png',
};

describe('EpisodesIndexView', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EpisodesIndexView user={mockedUser} />);
    expect(baseElement).toBeTruthy();
  });
});
