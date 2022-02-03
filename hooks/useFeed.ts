import {useEffect, useState} from "react";

export const useFeed = () => {
  const [feeds, setFeeds] = useState([]);
  useEffect(() => {
    reloadFeeds();
  }, [])

  const reloadFeeds = async () => {
    const resp = await (await fetch(`/api/feeds`)).json();
    setFeeds(resp.data?.feeds ?? []);
  };

  const updateColorCode = async (feedId: string, colorCode: string) => {
    const feed = feeds.find(f => f.id === feedId);
    if (feed) {
      feed.colorCode = colorCode;
      setFeeds(feeds);

      await fetch(`/api/feeds/updateColorCode`, {
        method: 'PUT',
        body: JSON.stringify({feedId: feedId, colorCode: colorCode}),
        headers: { 'Content-Type': 'application/json' },
      })
    }
  };

  return {
    feeds,
    reloadFeeds,
    updateColorCode,
  }
};