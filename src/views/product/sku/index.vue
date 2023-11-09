<template>
  <div class="sku-view">
    <main-container>
      <sku-select-table
        ref="skuLists"
        :page="true"
        :get-table-data="getSkuListBySpuId"
        :table-params="searchParams"
        :cols="cols"
        :page-number-string="pageNumberString"
        :page-size-string="pageSizeString"
        :show-no="true"
      >
        <template slot="skuDefaultImg" slot-scope="scope">
          <img
            class="table-image"
            :src="scope.row.skuDefaultImg"
            :alt="scope.row.skuName"
          >
        </template>
        <template slot="operate" slot-scope="{ row, $index }">
          <!-- 上架下架 -->
          <el-button
            v-show="hasChangePermission"
            :type="(row.isSale === '1' || row.isSale === 1) ? 'success' : 'info'"
            :icon="
              (row.isSale === '1' || row.isSale === 1)
                ? 'el-icon-bottom'
                : 'el-icon-top'
            "
            size="mini"
            @click="handleChangeSale(row, $index)"
          />
          <!-- 编辑 -->
          <el-button
            v-show="hasEditPermission"
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="handleEdit(row, $index)"
          />
          <!-- 查看信息 -->
          <el-button
            v-show="hasViewPermission"
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="handlleView(row, $index)"
          />
          <!-- 删除 -->
          <el-popconfirm style="margin-left: 20px;" :title="`确定删除 ${row.skuName} 吗？`" @onConfirm="handleDelete(row, $index)">
            <el-button
              v-show="hasDeletePermission"
              slot="reference"
              type="danger"
              size="mini"
              icon="el-icon-delete"
            />
          </el-popconfirm>
        </template>
      </sku-select-table>
    </main-container>
    <sku-view-drawer
      v-if="skuViewDrawer.visible"
      :edit-params="skuViewDrawer.editParams"
      :handle-type="skuViewDrawer.handleType"
      @closedrawer="handleCloseDtawer"
    />
    <sku-edit-view
      v-if="skuEditView.visible"
      :edit-params="skuEditView.editParams"
      :handle-type="skuEditView.handleType"
      @closedialog="handleCloseView"
    />
  </div>
</template>

<script>
import utils from '@/utils/utils'
import skuSelectTable from './components/sku-select-table.vue'
import skuViewDrawer from './components/sku-view-drawer.vue'
import skuEditView from './components/sku-edit-dialog.vue'
import { hasPermission } from '@/api/auth'

export default {
  components: { skuSelectTable, skuViewDrawer, skuEditView },
  props: {},
  data() {
    return {
      cols: [
        { prop: 'skuName', label: 'SKU名称', tooltip: true },
        { prop: 'skuDesc', label: '描述', tooltip: true },
        { prop: 'price', label: '价格(元)', width: 100, tooltip: true },
        { prop: 'weight', label: '重量(千克)', width: 100, tooltip: true },
        { prop: 'skuDefaultImg', label: '图片', width: 200, slot: true },
        { prop: 'operate', label: '操作', width: 300, slot: true }
      ],
      pageNumberString: 'page',
      pageSizeString: 'limit',
      // 抽屉信息
      skuViewDrawer: {
        visible: false,
        editParams: null,
        handleType: 'view'
      },
      // 传递sku信息
      skuEditView: {
        visible: false,
        autoParams: null, // categoryId
        editParams: null, // 要编辑的数据
        handleType: 'add'
      }
    }
  },
  computed: {
    // 接口
    getSkuListBySpuId() {
      return this.$API.sku.getSkuList
    },
    searchParams() {
      return {}
    },
    // 上架下架按钮
    hasChangePermission() {
      return hasPermission('btn.Sku.updown')
    },
    // 编辑按钮
    hasEditPermission() {
      return hasPermission('btn.Sku.update')
    },
    // 查看按钮
    hasViewPermission() {
      return hasPermission('btn.Sku.detail')
    },
    // 删除按钮
    hasDeletePermission() {
      return hasPermission('btn.Sku.remove')
    }
  },
  watch: {},
  mounted() {
    this.init()
  },
  methods: {
    initTable(pageNumber) {
      this.$refs.skuLists.pageChange(pageNumber)
    },
    // 上架下架
    handleChangeSale(row, index) {
      if (row.isSale === 1 || row.isSale === '1') {
        // 下架
        this.$API.sku.setCancelSale(row.id).then(res => {
          this.$message.success('商品下架成功！')
          this.initTable()
        })
      } else {
        // 上架
        this.$API.sku.setOnSale(row.id).then(res => {
          this.$message.success('商品上架成功！')
          this.initTable()
        })
      }
    },
    // 编辑
    handleEdit(row, index) {
      this.$message.info('正在开发中……')
      this.skuEditView.handleType = 'edit'
      this.skuEditView.editParams = utils.clone(row)
      this.skuEditView.visible = true
    },
    // 查看
    async handlleView(row, index) {
      let data = await this.$API.sku.getSkuInfoBySkuId(row.id).then(res => {
        return res?.data || {}
      })
      this.skuViewDrawer.editParams = utils.clone(data)
      this.skuViewDrawer.handleType = 'view'
      this.skuViewDrawer.visible = true
    },
    // 删除
    handleDelete(row, index) {
      this.$API.sku.deleteSkuBySkuId(row.id).then(res => {
        this.$message.success('删除SKU成功！')
        this.initTable()
      })
    },
    // 关闭抽屉
    handleCloseDtawer(res) {
      this.skuViewDrawer.visible = false
    },
    // 关闭修改页面
    handleCloseView(res) {
      this.skuEditView.visible = false
      this.initTable() // 留在当前页
    },
    async init() {}
  }
}
</script>

<style lang="scss" scoped>
.sku-view {
  width: 100%;
  height: 100%;
}
.table-image {
  width: 100px;
  height: 100px;
}
</style>
