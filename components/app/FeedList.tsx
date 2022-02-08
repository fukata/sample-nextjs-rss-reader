import {Feed} from "@prisma/client";
import UpdateFeedItem from "@/components/app/UpdateFeedItem";
import {ColorResult, TwitterPicker} from "react-color";
import {MouseEvent, CSSProperties, useState} from "react";
import LoadingIcon from "@/components/icon/LoadingIcon";

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
  // 各フィードの更新中ステータス id:boolean
  const [feedLoadingStatuses, setFeedLoadingStatuses] = useState<{ [key: string]: boolean }>({});
  const onUpdateFeed = async (feedId: string) => {
    try {
      setFeedLoadingStatuses({ ...feedLoadingStatuses, [feedId]: true });
      await onClickAggregateFeed(feedId);
    } finally {
      setFeedLoadingStatuses({ ...feedLoadingStatuses, [feedId]: false });
    }
  }

  // TODO: Feedの ColorPicker をコンポーネント化できないか
  const [displayColorPicker, setDisplayColorPicker] = useState<{
    display: boolean;
    posX: number;
    posY: number;
    feedId: string | null;
  }>({
    display: false,
    posX: 0,
    posY: 0,
    feedId: null,
  });

  const handleFeedColorClick = (ev: MouseEvent<HTMLButtonElement>, feedId: string) => {
    setDisplayColorPicker({
      display: true,
      posX: ev.currentTarget.offsetLeft - ev.currentTarget.offsetWidth / 2,
      posY: ev.currentTarget.offsetTop + ev.currentTarget.offsetHeight + 10,
      feedId: feedId,
    });
  };
  const handleFeedColorClose = () => {
    setDisplayColorPicker({ display: false, posX: 0, posY: 0, feedId: null });
  };
  const handleFeedColorChange = (color: ColorResult) => {
    onChangeFeedColorCode(displayColorPicker.feedId!, color.hex);
    handleFeedColorClose();
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
    <div className="mb-2">
      <UpdateFeedItem feeds={feeds} onClick={onUpdateFeed} />
      <ul className="mt-2">
        { feeds.map(feed => (
          <li
            key={feed.id}
            className="mb-1"
          >
            <button
              className="border-2 w-5 h-5 inline-block"
              style={{backgroundColor: feed.colorCode}}
              onClick={(ev) => {handleFeedColorClick(ev, feed.id)}}
            />
            <span className="px-1 w-40 inline-block truncate">
              { feedLoadingStatuses[feed.id] ? (
                <>
                  <LoadingIcon />&nbsp;
                </>
              ): null }
              {feed.title}
            </span>
          </li>
        )) }
      </ul>
      { displayColorPicker.display ? <div style={popover}>
        <div style={cover} onClick={handleFeedColorClose} />
        <TwitterPicker onChangeComplete={handleFeedColorChange} />
      </div> : null }
    </div>
  );
}