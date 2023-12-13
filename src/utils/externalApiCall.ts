import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import ResponseHandler from './response';

export const apiCall = async ({url, method, data}) => {
  const httpService = new HttpService();
  let req = httpService[`${method}`](url, { data: method == "post" ? data : {} });
  const res: AxiosResponse<any> = await lastValueFrom(req);
  const reponseSender = new ResponseHandler();
  if (res.data) {
    return reponseSender.sendSuccessResponse(data, 'success');
  }
  return reponseSender.sendFailedResponse(data, 'failed');
};
