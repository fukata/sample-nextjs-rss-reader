import {useEffect, useState} from "react";

export const useFeedItem = () => {
  const [feedItems, setFeedItems] = useState([]);
  useEffect(() => {
    reloadFeedItems();
  }, [])

  const reloadFeedItems = async () => {
    const resp = await (await fetch(`/api/feedItems`)).json();
    setFeedItems(resp.data?.feedItems ?? []);
  };

  const aggregateFeed = async (feedId: string) => {
    const resp = await (await fetch(`/api/feeds/aggregate`, {
      method: 'POST',
      body: JSON.stringify({ feedId: feedId }),
      headers: { 'Content-Type': 'application/json' },
    })).json();
    return resp.data?.aggregatedNum ?? 0;
  };

  return {
    feedItems,
    reloadFeedItems,
    aggregateFeed,
  }
};