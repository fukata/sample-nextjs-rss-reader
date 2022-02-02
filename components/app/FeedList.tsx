import {Feed} from "@prisma/client";
import UpdateFeedItem from "@/components/app/UpdateFeedItem";

export default function FeedList(
  {
    feeds,
    onClickAggregateFeed,
  } : {
    feeds: Feed[],
    onClickAggregateFeed: (feedId: string) => void,
  }
) {
  return (
    <div>
      <h2 className="text-xl">Your feeds</h2>
      <UpdateFeedItem feeds={feeds} onClick={onClickAggregateFeed} />
      <ul>
        { feeds.map(feed => (
          <li key={feed.id}>
            {feed.title}
          </li>
        )) }
      </ul>
    </div>
  );
}