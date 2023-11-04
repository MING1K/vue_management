/*
 * @Author       : ming
 * @Date         : 2023-10-28 23:54:02
 * @LastEditors  : ming
 * @LastEditTime : 2023-11-02 15:32:06
 * @Description  : product api
 */
import request from '@/utils/request'

/**
 * @description: 获取品牌列表
 * @param {*} data
 * @return {*}
 */
export function getTradeMarkList(data) {
  return request({
    url: `/admin/product/baseTrademark/${data.page}/${data.limit}`,
    method: 'get'
  })
}

/**
 * @description: 新增品牌
 * @param {*} data
 * @return {*}
 */
export function addTradeMark(data) {
  return request({
    url: '/admin/product/baseTrademark/save',
    method: 'post',
    data: data
  })
}

/**
 * @description: 更新品牌
 * @param {*} data
 * @return {*}
 */
export function updateTradeMark(data) {
  return request({
    url: '/admin/product/baseTrademark/update',
    method: 'put',
    data: data
  })
}

/**
 * @description: 删除品牌
 * @param {*} id
 * @return {*}
 */
export function deleteTradeMark(id) {
  return request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'delete'
  })
}

/**
 * @description: 获取一级分类接口
 * @return {*}
 */
export function getFirstCategory() {
  return request({
    url: `/admin/product/getCategory1`,
    method: 'get'
  })
}

/**
 * @description: 获取二级分类接口
 * @param {*} id
 * @return {*}
 */
export function getSecondCategory(id) {
  return request({
    url: `/admin/product/getCategory2/${id}`,
    method: 'get'
  })
}

/**
 * @description: 获取三级分类接口
 * @param {*} id
 * @return {*}
 */
export function getThirdCategory(id) {
  return request({
    url: `/admin/product/getCategory3/${id}`,
    method: 'get'
  })
}

/**
 * @description: 获取商品属性数据
 * @param {*} data
 * @return {*}
 */
export function getAttrInfoList(data) {
  let { category1Id, category2Id, category3Id } = { ...data }
  return request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get'
  })
}

/**
 * @description: 添加商品属性数据
 * @param {*} data
 * @return {*}
 */
export function addAttrInfo(data) {
  return request({
    url: '/admin/product/saveAttrInfo',
    method: 'post',
    data
  })
}
// {
//   "attrName": "string",
//   "attrValueList": [
//     {
//       "attrId": 0,
//       "id": 0,
//       "valueName": "string"
//     }
//   ],
//   "categoryId": 0,
//   "categoryLevel": 0,
//   "id": 0
// }
/**
 * @description: 更新商品属性数据
 * @param {*} data
 * @return {*}
 */
export function updateAttrInfo(data) {
  return request({
    url: '/admin/product/saveAttrInfo',
    method: 'post',
    data
  })
}

/**
 * @description: 删除属性的属性值
 * @param {*} attrId
 * @return {*}
 */
export function removeAttrInfo(attrId) {
  return request({
    url: `/admin/product/deleteAttr/${attrId}`,
    method: 'delete'
  })
}
