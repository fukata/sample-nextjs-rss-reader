import {Feed} from "@prisma/client";
import {useState} from "react";
import LoadingIcon from "@/components/icon/LoadingIcon";

export default function UpdateFeedItem(
  {
    feeds,
    onClick
  } : {
    feeds: Feed[]
    onClick: (feedId: string) => void,
  }
) {
  const [loading, setLoading] = useState(false);

  const aggregate = async () => {
    try {
      setLoading(true);
      for (let i=0; i<feeds.length; i++) {
        await onClick(feeds[i].id);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <button
        className={`w-full py-2 px-4 rounded ${loading ? "bg-gray-200 text-black" : "bg-blue-500 text-white hover:bg-blue-700"}`}
        onClick={aggregate}
        disabled={loading}
      >
        { loading ? (
          <>
            <LoadingIcon />&nbsp;
          </>
        ) : null }
        RSSを再取得
      </button>
    </div>
  );
}