<template>
  <div class="trade-mark">
    <tb-layout>
      <div slot="top" class="header-row-view top-view">
        <div class="left-btns">
          <select-category
            :disabled="attrEditView.visible"
            :select-category="selectCategory"
            @handleChangeCategory="handleChangeCategory"
          />
        </div>
        <div class="input-search">
          <el-button
            v-show="!attrEditView.visible && selectCategory.category3Id"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
          >添加属性</el-button>
        </div>
      </div>
      <category-select-table
        v-if="!attrEditView.visible"
        ref="attrTable"
        :page="true"
        :get-table-data="getTableData"
        :table-params="searchParams"
        :cols="cols"
        :page-number-string="pageNumberString"
        :page-size-string="pageSizeString"
        :show-no="true"
      >
        <template slot="attrValueList" slot-scope="scope">
          <el-tag
            v-for="(attr, index) in scope.row.attrValueList"
            :key="index"
            type="success"
            style="margin-left: 15px"
          >
            {{ attr.valueName }}
          </el-tag>
        </template>
        <template slot="operate" slot-scope="{ row, $index }">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-edit"
            @click="handleEdit(row, $index)"
          >修改</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(row, $index)"
          >删除</el-button>
        </template>
      </category-select-table>
      <attr-edit-view
        v-if="attrEditView.visible"
        :edit-params="attrEditView.editParams"
        :auto-params="attrEditView.autoParams"
        :handle-type="attrEditView.handleType"
        @closedialog="handleCloseView"
      />
    </tb-layout>
  </div>
</template>

<script>
import utils from '@/utils/utils'
import attrEditView from './components/attr-edit-view.vue'
export default {
  components: { attrEditView },
  data() {
    return {
      cols: [
        { prop: 'attrName', label: '属性名称', width: 220, tooltip: true },
        {
          prop: 'attrValueList',
          label: '属性值列表',
          align: 'left',
          slot: true
        },
        { prop: 'operate', label: '操作', width: 280, slot: true }
      ],
      pageNumberString: 'page',
      pageSizeString: 'limit',
      selectCategory: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      },
      attrEditView: {
        visible: false, // 是否编辑属性页面
        autoParams: null, // categoryId
        editParams: null, // 要编辑的数据
        handleType: 'add'
      }
    }
  },
  computed: {
    getTableData() {
      return this.$API.product.getAttrInfoList
    },
    searchParams() {
      return {
        category1Id: this.selectCategory.category1Id,
        category2Id: this.selectCategory.category2Id,
        category3Id: this.selectCategory.category3Id
      }
    }
  },
  methods: {
    initTable(pageNumber) {
      this.$nextTick(() => {
        this.$refs.attrTable.pageChange(pageNumber)
      })
    },
    // 分类改变
    handleChangeCategory(data) {
      this.selectCategory = { ...data }
    },
    // 添加属性
    handleAdd() {
      this.attrEditView.handleType = 'add'
      this.attrEditView.autoParams = utils.clone(this.selectCategory)
      this.attrEditView.visible = true
    },
    // 修改属性
    handleEdit(row, index) {
      this.attrEditView.handleType = 'edit'
      this.attrEditView.autoParams = utils.clone(this.selectCategory)
      this.attrEditView.editParams = utils.clone(row)
      this.attrEditView.visible = true
    },
    // 删除属性
    handleDelete(row, index) {
      this.$confirm(`确定删除 ${row.attrName} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$API.product.removeAttrInfo(row.id).then((res) => {
            this.$message.success('删除品牌成功！')
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
    // 关闭编辑页面
    handleCloseView(res) {
      this.attrEditView.visible = false
      if (res === 'add') this.initTable(1)
      else if (res === 'edit') this.initTable() // 留在当前页
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

