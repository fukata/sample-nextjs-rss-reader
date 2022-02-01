import Parser from "rss-parser";

export type FechedFeedItem = {
  guid: string;
  title: string;
  url: string;
  publishedAt?: string;
}

export type FetchedFeedData = {
  title: string;
  siteUrl: string;
  feedUrl: string;
  items: FechedFeedItem[];
}

const parser = new Parser();

export async function fetchFeed(feedUrl: string): FetchedFeedData {
  const feed = await parser.parseURL(feedUrl);

  return {
    title: feed.title ?? '',
    siteUrl: feed.link ?? '',
    feedUrl: feed.feedUrl ?? '',
    items: feed.items.map(item => {
      return {
        guid: item.guid ?? '',
        title: item.title ?? '',
        url: item.link ?? '',
        publishedAt: item.pubDate,
      };
    }),
  };
}