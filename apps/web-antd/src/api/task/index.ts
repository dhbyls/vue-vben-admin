import { requestClient } from '#/api/request';
/** 获取盘点任务单列表 */
export async function getTaskList(params: any) {
  return requestClient.post('/PdTask/get', params);
}
/** 保存盘点任务单 */
export async function SavePdTask(params: any) {
  return requestClient.post('/PdTask/save', params);
}

/** 删除盘点任务单 */
export async function delTask(params: any) {
  return requestClient.post('/PdTask/del', params);
}
