import { IUserSponsorship } from '@pdcstrrss/core';
import { User } from '@pdcstrrss/database';
import clsx from 'clsx';
import styles from './AccountIndexView.module.css';

interface AccountIndexViewProps {
  user: User | null;
  sponsorship?: IUserSponsorship | null;
}

export function AccountIndexView(props: AccountIndexViewProps) {
  return (
    <div className="page-account-container">
      <div className="card">test</div>
      <div className="card">test</div>
    </div>
  );
}

export default AccountIndexView;
