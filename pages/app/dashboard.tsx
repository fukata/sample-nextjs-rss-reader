import Layout from "@/components/app/Layout";
import AddFeed from "@/components/app/AddFeed";
import FeedList from "@/components/app/FeedList";
import {Feed} from "@prisma/client";
import {useFeed} from "@/hooks/useFeed";
import {useFeedItem} from "@/hooks/useFeedItem";
import FeedItemList from "@/components/app/FeedItemList";

export default function Index() {
  const {feeds, reloadFeeds, updateColorCode} = useFeed();
  const {feedItems, reloadFeedItems, aggregateFeed, updateFeedColorCode} = useFeedItem();

  const onSuccessAddFeed = async (feed: Feed) => {
    await reloadFeeds();
    await reloadFeedItems();
  };

  const onClickAggregateFeed = async (feedId: string) => {
    await aggregateFeed(feedId);
    await reloadFeedItems();
  };
  const onChangeFeedColorCode = async (feedId: string, colorCode: string) => {
    await updateColorCode(feedId, colorCode);
    await updateFeedColorCode(feedId, colorCode);
  };

  return (
    <Layout>
      <div className="flex">
        <div className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto border-r">
          <div className="flex flex-col justify-between">
            <aside>
              <AddFeed onSuccess={onSuccessAddFeed} />
              <FeedList feeds={feeds} onClickAggregateFeed={onClickAggregateFeed} onChangeFeedColorCode={onChangeFeedColorCode} />
            </aside>
          </div>
        </div>
        <div className="w-full h-full p-2 overflow-y-auto">
          <FeedItemList feedItems={feedItems} />
        </div>
      </div>
    </Layout>
  );
}
