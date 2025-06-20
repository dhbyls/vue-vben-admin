import type { List } from '#/type';

import { requestClient } from '#/api/request';

export namespace TableApi {
  export interface PageFetchParams {
    [key: string]: any;
    page: number;
    pageSize: number;
  }
}

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

/** 取消绑定财政数据，解绑财政数据 */
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

/**
 * 批量删除
 */
export async function BatchDel(params: any) {
  return requestClient.post('/pandian/delete', params);
}

/** 修改实际盘点数据 */
export async function uptPandianDataApi(params: any) {
  return requestClient.post('/pandian/pd_upt', params);
}

/** 修改实财政数据 */
export async function uptCzDataApi(params: any) {
  return requestClient.post('/czAssets/upt', params);
}

/** 提取图片中的文字 */
export async function getImgTextApi(params: any) {
  return requestClient.post('/pandian/get_img_text', params);
}

/**
 * 获取修改记录
 */
export async function GetAassetsChangeRecored(
  params: TableApi.PageFetchParams,
) {
  return requestClient.get('/pandian/getAssetsUptRecoredList', { params });
}

/**
 * 获取财政资产凭证等照片
 */
export async function GetAassetsImgs(params: any) {
  return requestClient.get('/czAssets/getCzAassetsImgs', { params });
}
