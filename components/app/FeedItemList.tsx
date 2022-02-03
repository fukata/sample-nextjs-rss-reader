import {FeedItem} from "@prisma/client";
import format from "date-fns/format";
import {textColorCodeFromBgColor} from "@/lib/colors";

export default function FeedItemList(
  { feedItems } : { feedItems: FeedItem[] }
) {
  return (
    <div>
      <div className="grid grid-cols-1 divide-y">
        { feedItems.map(item => (
          <div key={item.id} className="p-1">
            <span className="mr-2">{format(new Date(item.publishedAt), "yyyy-MM-dd")}:</span>
            <span
              className="mr-2 px-1 inline-block w-24 truncate"
              style={{backgroundColor: item.feed.colorCode, color: textColorCodeFromBgColor(item.feed.colorCode)}}
            >
              {item.feed.title}
            </span>
            <a href={item.url} target="_blank">
              {item.title}
            </a>
          </div>
        )) }
      </div>
    </div>
  );
}