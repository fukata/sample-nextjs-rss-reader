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

  const updateFeedColorCode = async (feedId: string, colorCode: string) => {
    console.log('updateFeedColorCode');
    feedItems.filter(f => f.feedId === feedId).forEach(f => {
      f.feed.colorCode = colorCode;
    })
    setFeedItems([...feedItems]);
  };

  return {
    feedItems,
    reloadFeedItems,
    aggregateFeed,
    updateFeedColorCode,
  }
};