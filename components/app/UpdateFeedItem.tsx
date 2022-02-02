import {Feed} from "@prisma/client";

export default function UpdateFeedItem(
  {
    feeds,
    onClick
  } : {
    feeds: Feed[]
    onClick: (feedId: string) => void,
  }
) {
  const aggregate = async () => {
    for (let i=0; i<feeds.length; i++) {
      await onClick(feeds[i].id);
    }
  };
  return (
    <div>
      <button
        className="font-bold py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-700"
        onClick={aggregate}
      >
        Update FeedItem
      </button>
    </div>
  );
}