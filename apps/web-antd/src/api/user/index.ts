import { requestClient } from '#/api/request';
/** 获取租户用户列表 */
export async function userlist(params: any) {
  return requestClient.post('/User/list', params);
}
