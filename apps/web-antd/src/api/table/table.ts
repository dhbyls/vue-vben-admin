import type { List } from '#/type';

import { requestClient } from '#/api/request';

/** ag grid测试 */
export async function getPandianDataApi() {
  return requestClient.get<List[]>('/pandian/index');
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
