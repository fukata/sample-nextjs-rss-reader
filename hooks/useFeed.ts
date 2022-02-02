import {useEffect, useState} from "react";

export const useFeed = () => {
  const [feeds, setFeeds] = useState([]);
  useEffect(() => {
    reloadFeeds();
  }, [])

  const reloadFeeds = async () => {
    const resp = await (await fetch(`/api/feeds`)).json();
    setFeeds(resp.data.feeds);
  };

  return {
    feeds,
    reloadFeeds,
  }
};