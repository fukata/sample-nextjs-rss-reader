import {NextApiRequest, NextApiResponse} from "next";
import {requireAuthApi} from "@/lib/api/requireAuthApi";
import {Session} from "next-auth";
import type { FeedItem } from "@prisma/client";
import prisma from "@/lib/prisma";

type ResponseData = {
  feedItems: FeedItem[];
}

export async function FeedItemsIndexApi(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseData<ResponseData>>,
  session: Session
) {
  const currentUser = session.user;
  const feedItems = await prisma.feedItem.findMany({
    where: {
      userId: currentUser.id,
    },
    orderBy: [
      { createdAt: 'desc' }
    ]
  });
  return res.status(200).json({
    status: 'ok',
    data: {
      feedItems: feedItems
    }
  });
}

export default requireAuthApi(FeedItemsIndexApi);