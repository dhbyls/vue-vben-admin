import type { List } from '#/type';

import { requestClient } from '#/api/request';

/** 获取实际盘点数据 */
export async function getPandianDataApi(params: any) {
  return requestClient.post<List[]>('/pandian/pd_list', params);
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
