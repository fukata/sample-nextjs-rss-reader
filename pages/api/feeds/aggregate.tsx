import {NextApiRequest, NextApiResponse} from "next";
import {requireAuthApi} from "@/lib/api/requireAuthApi";
import {Session} from "next-auth";
import {FetchedFeedData, fetchFeed} from "@/lib/api/feedFetcher";
import prisma from "@/lib/prisma";
import {Feed, FeedItem} from "@prisma/client";

type ResponseData = {
  feedItems: FeedItem[];
}

export async function bulkRegisterFeedItems(currentUserId: string, feed: Feed, fetchedFeedData: FetchedFeedData) {
  const newFeedItems: FeedItem[] = [];

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

    const createdFeedItem = await prisma.feedItem.create({
      data: {
        userId: currentUserId,
        feedId: feed.id,
        title: item.title,
        url: item.url,
        publishedAt: item.publishedAt ? new Date(item.publishedAt) : new Date(),
      }
    });

    // feedを補完するために再取得する
    const feedItem = await prisma.feedItem.findUnique({
      where: {
        id: createdFeedItem.id,
      },
      include: {
        feed: true,
      }
    })
    newFeedItems.push(feedItem);
  }

  return newFeedItems;
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
    const newFeedItems = await bulkRegisterFeedItems(currentUser.id, feed, fechedFeed);

    // 最終確認日時を更新
    await prisma.feed.update({
      where: {
        id: feed.id,
      },
      data: {
        checkedAt: new Date(),
      }
    });

    return res.status(200).json({
      status: 'ok',
      data: {
        feedItems: newFeedItems,
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