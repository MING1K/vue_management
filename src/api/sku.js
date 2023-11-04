/*
 * @Author       : ming
 * @Date         : 2023-11-03 23:11:14
 * @LastEditors  : ming
 * @LastEditTime : 2023-11-04 23:03:17
 * @Description  : sku接口
 */
import request from '@/utils/request'

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
 * @description: 通过spuId获取spu售卖属性
 * @param {*} spuId
 * @return {*}
 */
export function getSpuSaleAttrListById(spuId) {
  return request({
    url: `/admin/product/spuSaleAttrList/${spuId}`,
    method: 'get'
  })
}

/**
 * @description: 获取商品平台属性
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
 * @description: 通过spuId获取sku
 * @param {*} spuId
 * @return {*}
 */
export function getSkuListBySpuId({ spuId }) {
  return request({
    url: `/admin/product/findBySpuId/${spuId}`,
    method: 'get'
  })
}

/**
 * @description: 新增sku
 * @param {*} data
 * @return {*}
 */
export function addSkuInfo(data) {
  return request({
    url: '/admin/product/saveSkuInfo',
    method: 'post',
    data
  })
}

/**
 * @description: 获取sku列表
 * @param {*} spuId
 * @return {*}
 */
export function getSkuList({ page, limit }) {
  return request({
    url: `/admin/product/list/${page}/${limit}`,
    method: 'get'
  })
}

/**
 * @description: 商品上架
 * @param {*} skuId
 * @return {*}
 */
export function setOnSale(skuId) {
  return request({
    url: `/admin/product/onSale/${skuId}`,
    method: 'get'
  })
}
/**
 * @description: 商品下架
 * @param {*} skuId
 * @return {*}
 */
export function setCancelSale(skuId) {
  return request({
    url: `/admin/product/cancelSale/${skuId}`,
    method: 'get'
  })
}

/**
 * @description: 通过skuId获取sku详情
 * @param {*} skuId
 * @return {*}
 */
export function getSkuInfoBySkuId(skuId) {
  return request({
    url: `/admin/product/getSkuById/${skuId}`,
    method: 'get'
  })
}

/**
 * @description: 通过skuId删除sku
 * @param {*} skuId
 * @return {*}
 */
export function deleteSkuBySkuId(skuId) {
  return request({
    url: `/admin/product/deleteSku/${skuId}`,
    method: 'delete'
  })
}
