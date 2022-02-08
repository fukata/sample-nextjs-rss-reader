import {NextApiRequest, NextApiResponse} from "next";
import {requireAuthApi} from "@/lib/api/requireAuthApi";
import {Session} from "next-auth";
import type { FetchedFeedData, FechedFeedItem } from "@/lib/api/feedFetcher";
import { fetchFeed } from "@/lib/api/feedFetcher";

export async function FeedsFetchApi(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseData<FetchedFeedData>>,
  _: Session
) {
  const feedUrl = req.query.feedUrl as string;
  if (!feedUrl || feedUrl.length < 13) {
    return res.status(400).json({
      status: 'error',
      error: `URLが正しくありません。`,
    });
  }

  try {
    const feed = await fetchFeed(feedUrl);
    return res.status(200).json({
      status: 'ok',
      data: feed,
    });
  } catch (e) {
    return res.status(400).json({
      status: 'error',
      error: `Feedを取得出来ませんでした。URLを確認してください。`,
    });
  }
}

export default requireAuthApi(FeedsFetchApi);