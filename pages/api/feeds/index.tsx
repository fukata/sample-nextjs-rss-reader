import {NextApiRequest, NextApiResponse} from "next";
import {requireAuthApi} from "@/lib/api/requireAuthApi";
import {Session} from "next-auth";
import type { Feed } from "@prisma/client";
import prisma from "@/lib/prisma";

type ResponseData = {
  feeds: Feed[];
}

export async function FeedsIndex(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseData<ResponseData>>,
  session: Session
) {
  const currentUser = session.user;
  const feeds = await prisma.feed.findMany({
    where: {
      userId: currentUser.id,
    }
  });
  return res.status(200).json({
    status: 'ok',
    data: {
      feeds: feeds
    }
  });
}

export default requireAuthApi(FeedsIndexApi);