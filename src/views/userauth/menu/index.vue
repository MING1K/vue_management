<template>
  <div class="trade-mark">
    <tb-layout>
      <div slot="top" class="header-row-view top-view">
        <div class="left-btns">
          <el-button
            v-show="hasAddPermission"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
          >添加</el-button>
        </div>
      </div>
      <permission-select-table
        ref="selectTable"
        row-key="id"
        :get-table-data="getTableData"
        :table-params="searchParams"
        :cols="cols"
        :show-expand="true"
      >
        <template slot="operate" slot-scope="{ row, $index }">
          <el-button
            v-if="row.level < 4 && hasAddPermission"
            type="success"
            size="mini"
            icon="el-icon-circle-plus"
            title="添加子菜单"
            @click="handleAddChildMenu(row, $index)"
          />
          <el-button
            v-show="hasEditPermission"
            type="warning"
            size="mini"
            icon="el-icon-edit"
            title="修改"
            @click="handleEdit(row, $index)"
          />
          <el-button
            v-show="hasDeletePermission"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            title="删除"
            @click="handleDelete(row, $index)"
          />
        </template>
      </permission-select-table>
    </tb-layout>
    <permission-edit-dialog
      v-if="permissionEditDialog.visible"
      :edit-params="permissionEditDialog.editParams"
      :auto-params="permissionEditDialog.autoParams"
      :handle-type="permissionEditDialog.handleType"
      @closedialog="handleCloseEdit"
    />
  </div>
</template>

<script>
import utils from '@/utils/utils'
import permissionSelectTable from '../components/permission-select-table.vue'
import permissionEditDialog from './components/permission-edit-dialog.vue'
import { hasPermission } from '@/api/auth'

export default {
  components: { permissionSelectTable, permissionEditDialog },
  data() {
    return {
      cols: [
        { prop: 'name', label: '名称', align: 'left', tooltip: true },
        { prop: 'code', label: '权限值', tooltip: true },
        { prop: 'toCode', label: '跳转权限值', tooltip: true },
        { prop: 'gmtCreate', label: '创建时间', width: 180, tooltip: true },
        { prop: 'gmtModified', label: '更新时间', width: 180, tooltip: true },
        { prop: 'operate', label: '操作', width: 280, slot: true }
      ],
      pageNumberString: 'page',
      pageSizeString: 'limit',
      // 搜索框
      searchRoleName: '',
      // 编辑菜单
      permissionEditDialog: {
        visible: false,
        editParams: null,
        autoParams: null,
        handleType: 'add'
      },
      // 要批量删除的菜单
      ids: []
    }
  },
  computed: {
    getTableData() {
      return this.$API.permission.getPermissionList
    },
    searchParams() {
      return {
        roleName: this.searchRoleName === '' ? undefined : this.searchRoleName
      }
    },
    // 新增按钮
    hasAddPermission() {
      return hasPermission('btn.Permission.add')
    },
    // 编辑按钮
    hasEditPermission() {
      return hasPermission('btn.Permission.update')
    },
    // 删除按钮
    hasDeletePermission() {
      return hasPermission('btn.Permission.remove')
    }
  },
  methods: {
    initTable(pageNumber) {
      this.$nextTick(() => {
        this.$refs.selectTable.pageChange(pageNumber)
      })
    },
    // 获取选中菜单
    selectionChange(selection) {
      this.ids = selection.map(item => {
        return item.id
      })
    },
    // 清除所有选中菜单
    clearSelections() {
      this.$refs.selectTable.clearSelection()
      this.ids = []
    },
    // 添加菜单
    handleAdd() {
      this.permissionEditDialog.handleType = 'add'
      this.permissionEditDialog.visible = true
    },
    // 添加子菜单
    handleAddChildMenu(row, index) {
      this.permissionEditDialog.handleType = 'add'
      this.permissionEditDialog.autoParams = utils.clone(row)
      this.permissionEditDialog.visible = true
    },
    // 修改菜单
    handleEdit(row, index) {
      this.permissionEditDialog.handleType = 'edit'
      this.permissionEditDialog.editParams = utils.clone(row)
      this.permissionEditDialog.visible = true
    },
    // 删除菜单
    handleDelete(row, index) {
      this.$confirm(`确定删除菜单 ${row.roleName} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$API.permission.removePermission(row.id).then((res) => {
            this.$message.success('删除菜单成功！')
            // 如果为此页最后一项则加载前一页数据
            this.initTable(
              this.$refs.selectTable.list.length > 1
                ? this.$refs.selectTable.pageNumber
                : this.$refs.selectTable.pageNumber - 1
            )
          })
        })
        .catch(() => {
          this.$message.info('已取消操作')
        })
    },
    // 关闭编辑页面
    handleCloseEdit(res) {
      this.permissionEditDialog.visible = false
      this.permissionEditDialog.autoParams = null
      this.permissionEditDialog.editParams = null
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

