import {Feed} from "@prisma/client";
import UpdateFeedItem from "@/components/app/UpdateFeedItem";
import {ColorResult, TwitterPicker} from "react-color";
import {CSSProperties, useState} from "react";

export default function FeedList(
  {
    feeds,
    onClickAggregateFeed,
    onChangeFeedColorCode,
  } : {
    feeds: Feed[],
    onClickAggregateFeed: (feedId: string) => void,
    onChangeFeedColorCode: (feedId: string, colorCode: string) => void,
  }
) {
  const [displayColorPicker, setDisplayColorPicker] = useState<{
    display: boolean;
    posX: number;
    posY: number;
    feed: Feed | null;
  }>({
    display: false,
    posX: 0,
    posY: 0,
    feed: null,
  });

  const handleClick = (feed: Feed) => {
    setDisplayColorPicker({
      display: true,
      posX: event.target.offsetLeft - event.target.offsetWidth / 2,
      posY: event.target.offsetTop + event.target.offsetHeight + 10,
      feed: feed,
    });
  };
  const handleClose = () => {
    setDisplayColorPicker({ display: false, posX: 0, posY: 0, feed: null });
  };
  const handleChange = (color: ColorResult) => {
    onChangeFeedColorCode(displayColorPicker.feed.id, color.hex);
    handleClose();
  };

  const popover: CSSProperties = {
    position: 'absolute',
    zIndex: 2,
    left: `${displayColorPicker.posX}px`,
    top: `${displayColorPicker.posY}px`,
  };
  const cover: CSSProperties = {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  };

  return (
    <div>
      <h2 className="text-xl">Your feeds</h2>
      <UpdateFeedItem feeds={feeds} onClick={onClickAggregateFeed} />
      <ul className="mt-2">
        { feeds.map(feed => (
          <li
            key={feed.id}
            className="mb-1"
          >
            <button
              className="border-2 w-5 h-5 inline-block"
              style={{backgroundColor: feed.colorCode}}
              onClick={() => {handleClick(feed)}}
            />
            <span className="px-1 w-40 inline-block truncate">
              {feed.title}
            </span>
          </li>
        )) }
      </ul>
      { displayColorPicker.display ? <div style={popover}>
        <div style={cover} onClick={handleClose} />
        <TwitterPicker onChangeComplete={handleChange} />
      </div> : null }
    </div>
  );
}