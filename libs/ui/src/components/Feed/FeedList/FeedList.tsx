import { Button, ButtonLinks } from '../../Button';
import type { IFeed } from '@pdcstrrss/core';
import styles from './FeedList.css';
import { useState } from 'react';

export type IFeedListItemOnChangeParams = { feedId: string; event: React.FormEvent<HTMLButtonElement> };

export type IFeedListItemOnChange = (params: IFeedListItemOnChangeParams) => void;

export type IFeedListOnChangeParams = IFeedListItemOnChangeParams;

export type IFeedListOnChange = IFeedListItemOnChange;

export type IFeedListItemProps = IFeed & {
  onChange?: IFeedListItemOnChange;
};

interface IFeedListProps {
  feeds: IFeedListItemProps[];
  onChange?: IFeedListOnChange;
}

export const FeedListLinks = () => [...ButtonLinks(), { rel: 'stylesheet', href: styles }];

export const FeedListItem = ({
  id,
  title,
  url,
  latestEpisodePublished,
  image,
  subscribed,
  onChange,
}: IFeedListItemProps) => {
  return (
    <article key={id} data-feed>
      <header data-feed-header>
        <h2 data-feed-title>{title}</h2>
      </header>

      <figure data-feed-media>{image && <img data-feed-image src={image} alt={title} />}</figure>

      <div data-feed-meta>
        <time data-feed-datetime dateTime={latestEpisodePublished.toString()}>
          {Intl.DateTimeFormat(['sv-SE']).format(new Date(latestEpisodePublished))}
        </time>
      </div>

      <div data-feed-actions>
        <Button type="submit" reset={subscribed} name="feeds" value={id}>
          {subscribed ? 'Unsubscribe' : 'Subscribe'}
        </Button>
      </div>
    </article>
  );
};

export const FeedList = ({ feeds, onChange }: IFeedListProps) => {
  return (
    <div data-feed-list>
      {feeds.map((feed) => (
        <FeedListItem key={feed.url} {...feed} onChange={onChange} />
      ))}
    </div>
  );
};
