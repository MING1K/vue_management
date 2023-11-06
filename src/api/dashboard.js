// import request from '@/utils/request'
import request from '@/utils/request-mock'

export function getDashBoardList() {
  return request({
    url: '/vue-admin-template/dashboard/data',
    method: 'get'
  })
}
