import {NextApiRequest, NextApiResponse} from "next";
import {requireAuthApi} from "@/lib/api/requireAuthApi";
import {Session} from "next-auth";

type ResponseData = {
  id: string;
  name: string;
}

export function MeApi(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseData<ResponseData>>,
  session: Session
) {
  const currentUser = session.user!;
  return res.status(200).json({
    status: 'ok',
    data: {
      id: currentUser.id ?? '',
      name: currentUser.name ?? '',
    }
  });
}

export default requireAuthApi(MeApi);