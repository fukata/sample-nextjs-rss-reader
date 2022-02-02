import Layout from "@/components/app/Layout";
import AddFeed from "@/components/app/AddFeed";
import FeedList from "@/components/app/FeedList";
import {Feed} from "@prisma/client";
import {useFeed} from "@/hooks/useFeed";
import {useFeedItem} from "@/hooks/useFeedItem";
import FeedItemList from "@/components/app/FeedItemList";

export default function Index() {
  const {feeds, reloadFeeds} = useFeed();
  const {feedItems, reloadFeedItems, aggregateFeed} = useFeedItem();

  const onSuccessAddFeed = async (feed: Feed) => {
    await reloadFeeds();
  };

  const onClickAggregateFeed = async (feedId: string) => {
    await aggregateFeed(feedId);
    await reloadFeedItems();
  };

  return (
    <Layout>
      <h1>Dashboard</h1>

      <AddFeed onSuccess={onSuccessAddFeed} />

      <FeedList feeds={feeds} onClickAggregateFeed={onClickAggregateFeed} />
      <FeedItemList feedItems={feedItems} />
    </Layout>
  );
}
