import {useEffect, useState} from "react";
import {FeedItem} from "@prisma/client";

export const useFeedItem = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [nextPage, setNextPage] = useState<number | null>(2);

  useEffect(() => {
    reloadFeedItems();
  }, [])

  const reloadFeedItems = async () => {
    const resp = await (await fetch(`/api/feedItems`)).json();
    setFeedItems(resp.data?.feedItems ?? []);
  };

  const prependFeedItems = (newFeedItems: FeedItem[]) => {
    setFeedItems([...newFeedItems, ...feedItems]);
  };

  const aggregateFeed = async (feedId: string) => {
    const resp = await (await fetch(`/api/feeds/aggregate`, {
      method: 'POST',
      body: JSON.stringify({ feedId: feedId }),
      headers: { 'Content-Type': 'application/json' },
    })).json();
    return resp.data?.feedItems ?? [];
  };

  const updateFeedColorCode = async (feedId: string, colorCode: string) => {
    console.log('updateFeedColorCode');
    feedItems.filter(f => f.feedId === feedId).forEach(f => {
      f.feed.colorCode = colorCode;
    })
    setFeedItems([...feedItems]);
  };

  const loadMoreFeedItems = async () : Promise<LoadMoreResult> => {
    const resp = await (await fetch(`/api/feedItems?page=${nextPage}`)).json();
    if (resp.data?.pagination && resp.data?.pagination.nextPage) {
      setNextPage(resp.data?.pagination.nextPage);
    }

    // 重複排除
    const existsFeedItemMap : { id : boolean } = {};
    feedItems.forEach(item => existsFeedItemMap[item.id] = true );
    const newFeedItems = (resp.data?.feedItems ?? []).filter(item => !existsFeedItemMap[item.id]);

    setFeedItems([...feedItems, ...newFeedItems]);

    return {
      hasMore: nextPage != null,
    };
  };

  return {
    feedItems,
    reloadFeedItems,
    prependFeedItems,
    aggregateFeed,
    updateFeedColorCode,
    loadMoreFeedItems,
  }
};