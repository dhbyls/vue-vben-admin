import { requestClient } from '#/api/request';
/** 保存打印模板 */
export async function savePrintTemplateApi(params: any) {
  return requestClient.post('/PrintTemplate/save', params);
}
/** 获取打印模板 */
export async function getPrintTemplateApi(params: any) {
  return requestClient.post('/PrintTemplate/get', params);
}
/** 打印数据重新排序 */
export async function getPrintDataSortApi(params: any) {
  return await requestClient.post('/PrintTemplate/sort', params);
}
