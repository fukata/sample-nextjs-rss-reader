import {NextApiRequest, NextApiResponse} from "next";
import {requireAuthApi} from "@/lib/api/requireAuthApi";
import {Session} from "next-auth";
import prisma from "@/lib/prisma";

type ResponseData = {
}

export async function FeedsCreateApi(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseData<ResponseData>>,
  session: Session
) {
  const currentUser = session.user!;

  if (req.method !== 'PUT') {
    return res.status(400).json({
      status: 'error',
      error: `HTTP MethodにPUTを指定してください。`,
    });
  }

  console.log(`body=%o`, req.body);
  const feedId = req.body.feedId;
  if (!feedId) {
    return res.status(400).json({
      status: 'error',
      error: `feedIdが正しくありません。`,
    });
  }

  const colorCode = req.body.colorCode;
  if (!colorCode || colorCode.length !== 7) {
    return res.status(400).json({
      status: 'error',
      error: `colorCodeが正しくありません。`,
    });
  }

  const existFeed = await prisma.feed.findFirst({
    where: {
      userId: currentUser.id as string,
      id: feedId,
    }
  });
  if (!existFeed) {
    console.log(`Not exists feed. feedId=${feedId}`);
    return res.status(404).json({
      status: 'error',
      error: `feedが見つかりませんでした。`,
    });
  }

  await prisma.feed.update({
    where: {
      id: feedId,
    },
    data: {
      colorCode: colorCode,
    }
  });
  return res.status(200).json({
    status: 'ok',
  });
}

export default requireAuthApi(FeedsCreateApi);