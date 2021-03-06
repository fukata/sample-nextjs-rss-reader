import { Prisma } from "@prisma/client";
import format from "date-fns/format";
import {textColorCodeFromBgColor} from "@/lib/colors";
import {LoadMore} from "@/components/app/LoadMore";

export default function FeedItemList(
  {
    feedItems,
    onLoadMore,
  } : {
    feedItems: Prisma.FeedItemGetPayload<{ include: { feed: true } }>[],
    onLoadMore: () => Promise<LoadMoreResult>,
  }
) {
  return (
    <div>
      <div className="grid grid-cols-1 divide-y">
        { feedItems.map(item => (
          <div key={item.id} className="p-1 h-9 overflow-hidden">
            <span
              className="mr-2 inline-block w-24"
            >
              {format(new Date(item.publishedAt), "yyyy-MM-dd")}:
            </span>
            <span
              className="mr-2 px-1 inline-block w-24 truncate"
              style={{backgroundColor: item.feed.colorCode, color: textColorCodeFromBgColor(item.feed.colorCode)}}
            >
              {item.feed.title}
            </span>
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
            >
              {item.title}
            </a>
          </div>
        )) }
      </div>

      <LoadMore onLoadMore={onLoadMore} />
    </div>
  );
}