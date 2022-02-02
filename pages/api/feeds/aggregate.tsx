import {NextApiRequest, NextApiResponse} from "next";
import {requireAuthApi} from "@/lib/api/requireAuthApi";
import {Session} from "next-auth";
import { fetchFeed } from "@/lib/api/feedFetcher";
import prisma from "@/lib/prisma";

type ResponseData = {
  aggregatedNum: number;
}

export async function FeedsAggregateApi(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseData<ResponseData>>,
  session: Session
) {
  const currentUser = session.user;

  if (req.method !== 'POST') {
    return res.status(400).json({
      status: 'error',
      error: `HTTP MethodにPOSTを指定してください。`,
    });
  }

  const feedId = req.body.feedId as string;
  if (!feedId) {
    return res.status(400).json({
      status: 'error',
      error: `feedIdが正しくありません。`,
    });
  }

  const feed = await prisma.feed.findFirst({
    where: {
      id: feedId,
      userId: currentUser.id,
    }
  });
  if (!feed) {
    console.log(`Not exists feed. feedId=${feedId}`);
    return res.status(200).json({
      status: 'error',
      error: `feedIdが正しくありません。`,
    });
  }
  try {
    const fechedFeed = await fetchFeed(feed.feedUrl);
    let aggregatedNum = 0;
    for (let i=0; i<fechedFeed.items.length; i++) {
      const item = fechedFeed.items[i];

      const guid = item.guid.length > 0 ? item.guid : item.url;
      if (!guid) {
        console.log('FeedItem is not have guid. item=%o', item);
        continue;
      }

      const existFeedItem = await prisma.feedItem.findFirst({
        where: {
          userId: currentUser.id,
          feedId: feed.id,
          guid: guid,
        }
      });
      if (existFeedItem) {
        continue;
      }

      await prisma.feedItem.create({
        data: {
          guid: guid,
          userId: currentUser.id,
          feedId: feed.id,
          title: item.title,
          url: item.url,
          publishedAt: item.publishedAt ? new Date(item.publishedAt) : new Date(),
        }
      });
      aggregatedNum++;
    }

    return res.status(200).json({
      status: 'ok',
      data: {
        aggregatedNum: aggregatedNum,
      }
    });
  } catch (e) {
    return res.status(400).json({
      status: 'error',
      error: `Feedを取得出来ませんでした。URLを確認してください。`,
    });
  }
}

export default requireAuthApi(FeedsAggregateApi);