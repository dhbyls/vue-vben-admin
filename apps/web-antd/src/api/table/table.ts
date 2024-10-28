import type { List } from '#/type';

import { requestClient } from '#/api/request';

/** ag grid测试 */
export async function getPandianDataApi() {
  return requestClient.get<List[]>('/pandian/index');
}
