import {FeedItem} from "@prisma/client";
import Link from "next/link";

export default function FeedItemList(
  { feedItems } : { feedItems: FeedItem[] }
) {
  return (
    <div>
      <h2 className="text-xl">Your feed items</h2>
      <ul>
        { feedItems.map(item => (
          <li key={item.id}>
            <a href={item.url} target="_blank">
              {item.title}
            </a>
          </li>
        )) }
      </ul>
    </div>
  );
}