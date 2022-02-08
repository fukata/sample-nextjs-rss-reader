import Parser from "rss-parser";

export type FechedFeedItem = {
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

export async function fetchFeed(feedUrl: string): Promise<FetchedFeedData> {
  const feed = await parser.parseURL(feedUrl);

  return {
    title: feed.title ?? '',
    siteUrl: feed.link ?? '',
    feedUrl: feedUrl,
    items: feed.items.map(item => {
      return {
        title: item.title?.slice(0, 150) ?? '',
        url: item.link ?? '',
        publishedAt: item.pubDate,
      };
    }),
  };
}