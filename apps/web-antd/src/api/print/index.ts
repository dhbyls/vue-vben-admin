import { requestClient } from '#/api/request';
/** 保存打印模板 */
export async function savePrintTemplateApi(params: any) {
  return requestClient.post('/PrintTemplate/save', params);
}
/** 删除打印模板 */
export async function delPrintTemplateApi(params: any) {
  return requestClient.post('/PrintTemplate/delete', params);
}

/** 获取打印模板 */
export async function getPrintTemplateApi(params: any) {
  return requestClient.post('/PrintTemplate/get', params);
}
/** 打印数据重新排序 */
export async function getPrintDataSortApi(params: any) {
  return await requestClient.post('/PrintTemplate/sort', params);
}

/** 获取打印provider */
export async function getPrintProviderApi(params: any) {
  return requestClient.post('/PrintTemplate/provider', params);
}

/** 获取打印provider */
export async function getPrintProviderApi2(params: any) {
  return requestClient.post('/PrintTemplate/getPrintTemplate', params);
}

/** 上传文件 */
export async function uploadFile(params: any) {
  return requestClient.post('/upload/image', params);
}
