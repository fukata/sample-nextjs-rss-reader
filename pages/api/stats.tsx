import {NextApiRequest, NextApiResponse} from "next";

type ResponseData = {
  status: string;
  time: Date;
}

export default function StatsApi(req: NextApiRequest, res: NextApiResponse<ApiResponseData<ResponseData>>) {
  res.status(200).json({
    status: 'ok',
    data: {
      status: 'ok',
      time: new Date(),
    }
  });
}