import {NextApiRequest, NextApiResponse} from "next";
import {requireAuthApi} from "@/lib/api/requireAuthApi";
import {Session} from "next-auth";
import {FetchedFeedData, fetchFeed} from "@/lib/api/feedFetcher";
import prisma from "@/lib/prisma";
import {Feed} from "@prisma/client";

type ResponseData = {
  aggregatedNum: number;
}

export async function bulkRegisterFeedItems(currentUserId: string, feed: Feed, fetchedFeedData: FetchedFeedData) {
  let aggregatedNum = 0;
  for (let i=0; i<fetchedFeedData.items.length; i++) {
    const item = fetchedFeedData.items[i];

    const url = item.url;
    if (!url) {
      console.log('FeedItem is not have url. item=%o', item);
      continue;
    }

    const existFeedItem = await prisma.feedItem.findFirst({
      where: {
        userId: currentUserId,
        feedId: feed.id,
        url: url,
      }
    });
    if (existFeedItem) {
      console.log('Already exists feedItem. feed=%o, feedItem=%o', feed.title, existFeedItem.title);
      continue;
    }

    await prisma.feedItem.create({
      data: {
        userId: currentUserId,
        feedId: feed.id,
        title: item.title,
        url: item.url,
        publishedAt: item.publishedAt ? new Date(item.publishedAt) : new Date(),
      }
    });
    aggregatedNum++;
  }

  return aggregatedNum;
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
    let aggregatedNum = await bulkRegisterFeedItems(currentUser.id, feed, fechedFeed);
    return res.status(200).json({
      status: 'ok',
      data: {
        aggregatedNum: aggregatedNum,
      }
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      status: 'error',
      error: `Feedを取得出来ませんでした。URLを確認してください。`,
    });
  }
}

export default requireAuthApi(FeedsAggregateApi);