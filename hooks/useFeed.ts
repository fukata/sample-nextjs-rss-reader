import {useEffect, useState} from "react";
import {Feed} from "@prisma/client";

export const useFeed = () => {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  useEffect(() => {
    reloadFeeds();
  }, [])

  const reloadFeeds = async () => {
    const resp = await (await fetch(`/api/feeds`)).json();
    setFeeds(resp.data?.feeds ?? []);
  };

  const updateColorCode = async (feedId: string, colorCode: string) => {
    console.log('updateColorCode');
    const feed = feeds.find((f: Feed) => f.id === feedId);
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