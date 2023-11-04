<template>
  <div class="trade-mark">
    <tb-layout>
      <div slot="top" class="header-row-view top-view">
        <div class="left-btns">
          <select-category
            :disabled="viewChange !== 'table'"
            :select-category="selectCategory"
            @handleChangeCategory="handleChangeCategory"
          />
        </div>
        <div class="input-search">
          <el-button
            v-show="viewChange === 'table' && selectCategory.category3Id"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
          >添加SPU</el-button>
        </div>
      </div>

      <spu-select-table
        v-if="viewChange === 'table'"
        ref="attrTable"
        :page="true"
        :get-table-data="getTableData"
        :table-params="searchParams"
        :cols="cols"
        :show-no="true"
      >
        <template slot="operate" slot-scope="{ row, $index }">
          <el-button
            type="success"
            size="mini"
            icon="el-icon-plus"
            title="添加sku"
            @click="handleAddSku(row, $index)"
          />
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-edit"
            title="修改spu"
            @click="handleEdit(row, $index)"
          />
          <el-button
            size="mini"
            icon="el-icon-info"
            title="查看当前spu的sku列表"
            @click="handleViewSkuList(row, $index)"
          />
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            title="删除spu"
            @click="handleDelete(row, $index)"
          />
        </template>
      </spu-select-table>
      <spu-edit-view
        v-if="viewChange === 'spu'"
        :edit-params="spuEditView.editParams"
        :auto-params="spuEditView.autoParams"
        :handle-type="spuEditView.handleType"
        @closedialog="handleCloseView"
      />
      <sku-edit-view
        v-if="viewChange === 'sku'"
        :edit-params="skuEditView.editParams"
        :auto-params="skuEditView.autoParams"
        :handle-type="skuEditView.handleType"
        @closedialog="handleCloseView"
      />
    </tb-layout>
    <sku-dialog-view
      v-if="skuDialogView.visible"
      :edit-params="skuDialogView.editParams"
      :handle-type="skuDialogView.handleType"
      @closedialog="closeDialogView"
    />
  </div>
</template>

<script>
import utils from '@/utils/utils'
import spuEditView from './components/spu-edit-view.vue'
import skuEditView from './components/sku-edit-view.vue'
import spuSelectTable from './components/spu-select-table.vue'
import skuDialogView from './components/sku-dialog-view.vue'
export default {
  components: { spuEditView, skuEditView, spuSelectTable, skuDialogView },
  data() {
    return {
      cols: [
        { prop: 'spuName', label: 'SPU名称', width: 220, tooltip: true },
        { prop: 'description', label: 'SPU描述' },
        { prop: 'operate', label: '操作', width: 280, slot: true }
      ],
      selectCategory: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      },
      // 传递spu信息
      spuEditView: {
        autoParams: null, // categoryId
        editParams: null, // 要编辑的数据
        handleType: 'add'
      },
      // 传递sku信息
      skuEditView: {
        autoParams: null, // categoryId
        editParams: null, // 要编辑的数据
        handleType: 'add'
      },
      // 展示的组件
      viewChange: 'table',
      // sku列表信息
      skuDialogView: {
        visible: false,
        editParams: null,
        handleType: 'view'
      }
    }
  },
  computed: {
    getTableData() {
      return this.$API.spu.getSpuList
    },
    searchParams() {
      return { ...this.selectCategory }
    }
  },
  methods: {
    initTable(pageNumber) {
      this.$nextTick(() => {
        this.$refs.attrTable.pageChange(pageNumber)
      })
    },
    // 三级联动组件自定义事件分类改变
    handleChangeCategory(data) {
      this.selectCategory = { ...data }
    },
    // 添加SPU
    handleAdd() {
      this.spuEditView.handleType = 'add'
      this.spuEditView.autoParams = utils.clone(this.selectCategory)
      this.viewChange = 'spu'
    },
    // 修改SPU
    async handleEdit(row, index) {
      this.$API.spu.getSpuInfoById(row.id).then(res => {
        if (res?.data) {
          this.spuEditView.handleType = 'edit'
          this.spuEditView.autoParams = utils.clone(this.selectCategory)
          this.spuEditView.editParams = utils.clone(res.data)
          this.viewChange = 'spu'
        }
      })
    },
    // 删除SPU
    handleDelete(row, index) {
      this.$confirm(`确定删除 ${row.spuName} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$API.spu.deleteSpuInfo(row.id).then((res) => {
            this.$message.success('删除SPU成功！')
            // 如果为此页最后一项则加载前一页数据
            this.initTable(
              this.$refs.attrTable.list.length > 1
                ? this.$refs.attrTable.pageNumber
                : this.$refs.attrTable.pageNumber - 1
            )
          })
        })
        .catch(() => {
          this.$message.info('已取消操作')
        })
    },
    // 添加SKU
    handleAddSku(row, index) {
      this.skuEditView.handleType = 'add'
      this.skuEditView.autoParams = utils.clone(this.selectCategory)
      this.skuEditView.editParams = utils.clone(row)
      this.viewChange = 'sku'
    },
    // 关闭编辑页面
    handleCloseView(res) {
      this.viewChange = 'table'
      if (res === 'add') this.initTable(1)
      else if (res === 'edit') this.initTable() // 留在当前页
    },
    // 查看sku列表信息
    handleViewSkuList(row, index) {
      this.skuDialogView.handleType = 'view'
      this.skuDialogView.editParams = utils.clone(row)
      this.skuDialogView.visible = true
    },
    // 关闭详细信息页面
    closeDialogView(res) {
      this.skuDialogView.visible = false
    }
  }
}
</script>

  <style lang="scss" scoped>
.trade-mark {
  width: 100%;
  height: 100%;
  // height: 850px;
}
</style>

