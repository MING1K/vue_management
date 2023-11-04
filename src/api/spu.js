/*
 * @Author       : ming
 * @Date         : 2023-11-01 23:36:56
 * @LastEditors  : ming
 * @LastEditTime : 2023-11-02 16:45:07
 * @Description  : SPU接口
 */
import request from '@/utils/request'

/**
 * @description: 获取spu列表
 * @param {*} data
 * @return {*}
 */
export function getSpuList(data) {
  let { page, limit, category3Id } = { ...data }
  return request({
    url: `/admin/product/${page}/${limit}`,
    method: 'get',
    params: { category3Id }
  })
}

/**
 * @description: 通过spuId获取spu信息
 * @param {*} spuId
 * @return {*}
 */
export function getSpuInfoById(spuId) {
  return request({
    url: `/admin/product/getSpuById/${spuId}`,
    method: 'get'
  })
}

/**
 * @description: 通过spuId获取图片信息
 * @param {*} spuId
 * @return {*}
 */
export function getSpuImageListById(spuId) {
  return request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: 'get'
  })
}

/**
 * @description: 获取SPU销售属性（一共三个）
 * @return {*}
 */
export function getSpuSaleAttrList() {
  return request({
    url: `/admin/product/baseSaleAttrList`,
    method: 'get'
  })
}

/**
 * @description: 获取品牌信息
 * @return {*}
 */
export function getTradeMarkLists() {
  return request({
    url: `/admin/product/baseTrademark/getTrademarkList`,
    method: 'get'
  })
}

/**
 * @description: 根据关键词查询品牌
 * @param {*} keyword
 * @return {*}
 */
export function queryTrademarkByKeyword(keyword) {
  return request({
    url: `/admin/product/baseTrademark/findBaseTrademarkByKeyword/${keyword}`,
    method: 'get'
  })
}

/**
 * @description: 添加spu信息
 * @param {*} data
 * @return {*}
 */
export function addSpuInfo(data) {
  return request({
    url: `/admin/product/saveSpuInfo`,
    method: 'post',
    data
  })
}

/**
 * @description: 编辑spu信息
 * @param {*} data
 * @return {*}
 */
export function updateSpuInfo(data) {
  return request({
    url: `/admin/product/updateSpuInfo`,
    method: 'post',
    data
  })
}

/**
 * @description: 删除spu
 * @param {*} spuId
 * @return {*}
 */
export function deleteSpuInfo(spuId) {
  return request({
    url: `/admin/product/deleteSpu/${spuId}`,
    method: 'delete'
  })
}
