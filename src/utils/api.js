import network from './network';

// 任务列表
export function queryTaskList(params) {
  return network({
    url: `/queryTaskList`,
    method: "get",
    params
  })
}

// 添加任务
export function addTask(data) {
  return network({
    url: `/addTask`,
    method: "post",
    data
  })
}

// 编辑任务
export function editTask(data) {
  return network({
    url: `/editTask`,
    method: "post",
    data
  })
}

// 操作任务状态
export function updateTaskStatus(data) {
  return network({
    url: `/updateTaskStatus`,
    method: "post",
    data
  })
}

// 删除任务
export function deleteTask(data) {
  return network({
    url: `/deleteTask`,
    method: "post",
    data
  })
}