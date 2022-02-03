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
      <ul className="mt-2">
        { feeds.map(feed => (
          <li
            key={feed.id}
            className="mb-1 px-1 text-white truncate"
            style={{backgroundColor: feed.colorCode}}
          >
            {feed.title}
          </li>
        )) }
      </ul>
    </div>
  );
}