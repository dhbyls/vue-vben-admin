import type { List } from '#/type';

import { requestClient } from '#/api/request';

/** 获取租户数据 */
export async function getTenantListDataApi() {
  return requestClient.post<List[]>('/tenant/list');
}
/** 获取实际盘点数据 */
export async function getPandianDataApi(params: any) {
  return requestClient.post<List[]>('/pandian/pd_list', params);
}

/** 获取所有财政数据 */
export async function getCzDataApi(params: any) {
  return requestClient.post('/CzAssets/cz_list', params);
}

/** 拆分盘点的资产数量 */
export async function caifenPdDataApi(params: any) {
  return requestClient.post('/pandian/caifenshuliang', params);
}

/** 取消绑定财政数据 */
export async function unBindCzCode(params: any) {
  return requestClient.post('/CzAssets/unbind_cz_code', params);
}

/** 绑定财政数据 */
export async function bindCzCode(params: any) {
  return requestClient.post('/CzAssets/bind_cz_code', params);
}

/** 反向建盘点绑定财政数据 */
export async function xjBindCzCode(params: any) {
  return requestClient.post('/CzAssets/xj_bind_cz_code', params);
}

/** 修改实际盘点数据 */
export async function uptPandianDataApi(params: any) {
  return requestClient.post('/pandian/pd_upt', params);
}

/** 提取图片中的文字 */
export async function getImgTextApi(params: any) {
  return requestClient.post('/pandian/get_img_text', params);
}

export namespace DemoTableApi {
  export interface PageFetchParams {
    [key: string]: any;
    page: number;
    pageSize: number;
  }
}

/**
 * 获取示例表格数据
 */
export async function getExampleTableApi(params: DemoTableApi.PageFetchParams) {
  return requestClient.get('/table/list', { params });
}
