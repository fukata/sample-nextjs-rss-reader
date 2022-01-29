import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/react";
import {Session} from "next-auth";

/**
 * ユーザー認証が必要なAPIでラップする関数
 *
 * 使い方：
 *
 * pages/api/me.tsx
 * ```
 * export function MeApi(req: NextApiRequest, res: NextApiResponse<ApiResponseData<ResponseData>>, session: Session) {
 *   const currentUser = session.user;
 *   return res.status(200).json({
 *     status: 'ok',
 *     data: {
 *       id: currentUser!.id ?? '',
 *       name: currentUser!.name ?? '',
 *     }
 *   });
 * }
 *
 * export default requireAuthApi(MeApi);
 * ```
 *
 * @param handler
 */
export function requireAuthApi(handler: (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseData<any>>,
  session: Session
) => void) {
  return async function (req: NextApiRequest, res: NextApiResponse<ApiResponseData<any>>) {
    const session = await getSession({req});
    if (session) {
      handler(req, res, session);
    } else {
      res.status(401).json({
        status: 'error',
        error: 'Authentication failed',
      });
    }
  };
}