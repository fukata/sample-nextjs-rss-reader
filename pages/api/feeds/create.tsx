import {NextApiRequest, NextApiResponse} from "next";
import {requireAuthApi} from "@/lib/api/requireAuthApi";
import {Session} from "next-auth";
import type { Feed } from "@prisma/client";
import prisma from "@/lib/prisma";
import {fetchFeed} from "@/lib/api/feedFetcher";

type ResponseData = {
  feed: Feed;
}

export async function FeedsCreateApi(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseData<ResponseData>>,
  session: Session
) {
  const currentUser = session.user;

  console.log(`body=%o`, req.body);
  const feedUrl = req.body.feedUrl;
  if (!feedUrl || feedUrl.length < 13) {
    return res.status(400).json({
      status: 'error',
      error: `URLが正しくありません。`,
    });
  }

  const existFeed = await prisma.feed.findFirst({
    where: {
      userId: currentUser.id,
      feedUrl: feedUrl,
    }
  });
  if (existFeed) {
    console.log(`Already exists feed. feedUrl=${feedUrl}`);
    return res.status(200).json({
      status: 'ok',
      data: {
        feed: existFeed,
      }
    });
  }

  let fetchResult;
  try {
    console.log(`Not exists feed. feedUrl=${feedUrl}`);
    fetchResult = await fetchFeed(feedUrl);
    console.log(`fetchResult=%o`, fetchResult);
  } catch (e) {
    return res.status(400).json({
      status: 'error',
      error: `Feedを取得出来ませんでした。URLを確認してください。`,
    });
  }

  const feed = await prisma.feed.create({
    data: {
      userId: currentUser.id,
      title: fetchResult.title,
      siteUrl: fetchResult.siteUrl,
      feedUrl: fetchResult.feedUrl,
    }
  });
  return res.status(200).json({
    status: 'ok',
    data: {
      feed: feed
    }
  });
}

export default requireAuthApi(FeedsCreateApi);