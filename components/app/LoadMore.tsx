import {useState} from "react";
import LoadingIcon from "@/components/icon/LoadingIcon";

export function LoadMore(
  {
    onLoadMore
  } : {
    onLoadMore: () => Promise<LoadMoreResult>
  }
) {
  // 読み込み中か
  const [loading, setLoading] = useState(false);
  // 読み込み可能なデータを全て読み込んだか
  const [loadCompleted, setLoadCompleted] = useState(false);

  const handleLoadMore = async () => {
    try {
      setLoading(true);
      const result = await onLoadMore();
      if (result.hasMore) {
        setLoadCompleted(false);
      } else {
        setLoadCompleted(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 text-center">
      { loadCompleted ?
        <p>全て読み込みました。</p>
        :
        <button
          className={`py-2 px-4 rounded text-white ${loading ? "bg-gray-200 text-black" : "bg-cyan-500 hover:bg-cyan-700"}`}
          disabled={loading}
          onClick={handleLoadMore}
        >
          {loading ? (
            <span>
              読み込み中&nbsp;<LoadingIcon />
            </span>
          ) : "もっと読む"}
        </button>
      }
    </div>
  );
}