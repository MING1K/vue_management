<template>
  <div class="trade-mark">
    <tb-layout>
      <div slot="top" class="top-view">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handleAdd"
        >添加</el-button>
      </div>

      <trade-mark-table
        ref="tradeMarkTable"
        :page="true"
        :get-table-data="getTableData"
        :cols="cols"
        :page-number-string="pageNumberString"
        :page-size-string="pageSizeString"
        :show-no="true"
      >
        <template slot="logoUrl" slot-scope="{ row, $index }">
          <img
            :key="$index"
            :src="row.logoUrl"
            :alt="row.tmName"
            style="width: auto; height: 45px"
          >
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
      </trade-mark-table>
    </tb-layout>
    <trade-mark-edit
      v-if="tradeMarkEdit.visible"
      :edit-params="tradeMarkEdit.editParams"
      :handle-type="tradeMarkEdit.handleType"
      @closedialog="handleCloseDialog"
    />
  </div>
</template>

<script>
import utils from '@/utils/utils'
import tradeMarkTable from './components/trade-mark-table.vue'
import tradeMarkEdit from './components/trade-mark-edit.vue'
export default {
  components: { tradeMarkEdit, tradeMarkTable },
  data() {
    return {
      cols: [
        { prop: 'tmName', label: '品牌名称', tooltip: true },
        { prop: 'logoUrl', label: '品牌Logo', slot: true },
        { prop: 'operate', label: '操作', width: 280, slot: true }
      ],
      pageNumberString: 'page',
      pageSizeString: 'limit',
      tradeMarkEdit: {
        editParams: null,
        handleType: 'add',
        visible: false
      }
    }
  },
  computed: {
    getTableData() {
      return this.$API.product.getTradeMarkList
    }
  },
  methods: {
    initTable(pageNumber) {
      this.$refs.tradeMarkTable.pageChange(pageNumber)
    },
    // 添加品牌
    handleAdd() {
      this.tradeMarkEdit.handleType = 'add'
      this.tradeMarkEdit.visible = true
    },
    // 修改品牌
    handleEdit(row, index) {
      this.tradeMarkEdit.handleType = 'edit'
      this.tradeMarkEdit.editParams = utils.clone(row)
      this.tradeMarkEdit.visible = true
    },
    // 删除品牌
    handleDelete(row, index) {
      this.$confirm(`确定删除 ${row.tmName} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$API.product.deleteTradeMark(row.id).then(res => {
          this.$message.success('删除品牌成功！')
          // 如果为此页最后一项则加载前一页数据
          this.initTable(this.$refs.tradeMarkTable.list.length > 1 ? this.$refs.tradeMarkTable.pageNumber : this.$refs.tradeMarkTable.pageNumber - 1)
        })
      }).catch(() => {
        this.$message.info('已取消操作')
      })
    },
    // 关闭dialog
    handleCloseDialog(res) {
      this.tradeMarkEdit.visible = false
      if (res === 'add') this.initTable(1)
      else if (res === 'edit') this.initTable() // 留在当前页
    }
  }
}
</script>

<style lang="scss" scoped>
.trade-mark {
  width: 100%;
  // height: 100%;
  height: 850px;
}
</style>
