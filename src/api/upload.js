/*
 * @Author       : ming
 * @Date         : 2023-10-29 22:51:19
 * @LastEditors  : ming
 * @LastEditTime : 2023-10-30 15:07:56
 * @Description  : 上传文件接口
 */
import request from '@/utils/request'

/**
 * @description: 上传文件
 * @param {*} data
 * @return {*}
 */
export function uploadFile(data) {
  return request({
    url: '/admin/product/fileUpload',
    method: 'post',
    data
  })
}

/**
 * @description: 删除文件
 * @param {*} data
 * @return {*}
 */
export function deleteFile(data) {
  return request({
    url: '/admin/product/fileUpload',
    method: 'delete',
    data
  })
}

/**
 * @description: 请求baseUrl
 * @return {*}
 */
export const preUploadUrl = process.env.VUE_APP_BASE_API

export const uploadFileUrl = '/admin/product/fileUpload'

// export const deleteFileUrl = '/admin/product/fileUpload'
