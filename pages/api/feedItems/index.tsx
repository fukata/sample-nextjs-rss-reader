import {NextApiRequest, NextApiResponse} from "next";
import {requireAuthApi} from "@/lib/api/requireAuthApi";
import {Session} from "next-auth";
import type { FeedItem } from "@prisma/client";
import prisma from "@/lib/prisma";

type ResponseData = {
  feedItems: FeedItem[];
  pagination?: PaginationData;
}

// 50 ページ以降は処理しない
const AVAILABLE_PAGE_LIMIT = 50;

export async function FeedItemsIndexApi(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseData<ResponseData>>,
  session: Session
) {
  const currentUser = session.user;
  const limit = 50;
  const page = typeof req.query.page === 'string' ? parseInt(req.query.page || '1', 10) : 1;
  const skip = page > 0 ? (page - 1) * limit : 0;

  if (page > AVAILABLE_PAGE_LIMIT) {
    return res.status(200).json({
      status: 'ok',
      data: {
        feedItems: [],
      }
    });
  }

  const feedItems = await prisma.feedItem.findMany({
    where: {
      userId: currentUser.id,
    },
    orderBy: [
      { publishedAt: 'desc' },
      { createdAt: 'desc' },
    ],
    include: {
      feed: true
    },
    skip: skip,
    take: limit,
  });
  return res.status(200).json({
    status: 'ok',
    data: {
      feedItems: feedItems,
      pagination: {
        currentPage: page,
        nextPage: page === AVAILABLE_PAGE_LIMIT ? null : page + 1,
      }
    }
  });
}

export default requireAuthApi(FeedItemsIndexApi);