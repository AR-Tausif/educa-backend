import { Response } from "express";

type TAdminResponse<TAllData> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: TAllData;
};

const sendResponse = <TAllData>(
  res: Response,
  data: TAdminResponse<TAllData>
) => {
  res.status(data?.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
  });
};

export default sendResponse;
