import {NextApiRequest, NextApiResponse} from "next";
import {requireAuthApi} from "@/lib/api/requireAuthApi";
import {Session} from "next-auth";
import type { Feed } from "@prisma/client";
import prisma from "@/lib/prisma";
import {fetchFeed} from "@/lib/api/feedFetcher";
import {pickColor} from "@/lib/colors";
import {bulkRegisterFeedItems} from "./aggregate";

type ResponseData = {
  feed: Feed;
}

export async function FeedsCreateApi(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseData<ResponseData>>,
  session: Session
) {
  const currentUser = session.user!;

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
      userId: currentUser.id as string,
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

  let fetchedFeed;
  try {
    console.log(`Not exists feed. feedUrl=${feedUrl}`);
    fetchedFeed = await fetchFeed(feedUrl);
    console.log(`fetchedFeed=%o`, fetchedFeed);
  } catch (e) {
    return res.status(400).json({
      status: 'error',
      error: `Feedを取得出来ませんでした。URLを確認してください。`,
    });
  }

  const feed = await prisma.feed.create({
    data: {
      userId: currentUser.id as string,
      title: fetchedFeed.title,
      siteUrl: fetchedFeed.siteUrl,
      feedUrl: fetchedFeed.feedUrl,
      colorCode: pickColor(),
    }
  });
  await bulkRegisterFeedItems(currentUser.id as string, feed, fetchedFeed);
  return res.status(200).json({
    status: 'ok',
    data: {
      feed: feed
    }
  });
}

export default requireAuthApi(FeedsCreateApi);