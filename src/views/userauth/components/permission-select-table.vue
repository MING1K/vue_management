<template>
  <div class="select-table">
    <el-table
      ref="table"
      v-loading="loading"
      height="400px"
      row-key="_id"
      :data="list"
      :expand-row-keys="['1']"
      :tree-props="{children: 'children'}"
      v-bind="{ border: true, ...$attrs }"
      :default-sort="{ prop: 'storder', order: 'ascending' }"
      v-on="$listeners"
    >
      <el-table-column
        v-if="showSelection"
        type="selection"
        width="50"
        align="center"
        reserve-selection
      />
      <el-table-column
        v-if="showNo"
        type="index"
        :label="showNoString"
        width="100"
        align="center"
      />
      <el-table-column
        v-for="item in cols"
        :key="item.id"
        :type="item.type"
        :prop="item.prop"
        :fixed="item.fixed"
        :label="item.label"
        :width="item.width"
        :align="item.align || 'center'"
        :sortable="item.sortable"
        :show-overflow-tooltip="item.tooltip != false"
      >
        <template v-if="item.slotHeader" slot="header">
          <slot :name="item.headername" />
        </template>
        <template slot-scope="scope">
          <!-- v-if="item.slotHeader" -->
          <slot v-if="item.slot" :name="item.prop" v-bind="scope" />
          <template v-else>
            {{
              (scope.row[item.prop] === 0 || scope.row[item.prop] === "0"
                ? 0
                : scope.row[item.prop] || item.nullString || "") +
                (item.unit
                  ? scope.row[item.unit]
                    ? `（${scope.row[item.unit]}）`
                    : "" || ""
                  : "")
            }}
          </template>
        </template>
      </el-table-column>
      <slot name="otherSlot" />
    </el-table>

  </div>
</template>
<script>
import utils from '@/utils/utils'
export default {
  props: {
    // 列
    cols: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 表格数据
    tableData: {
      type: Array,
      default: () => {
        return null
      }
    },
    // 表格查询参数
    tableParams: {
      type: Object,
      default: null
    },
    // 获取表格高度方法
    getTableHeight: {
      type: Function,
      default: () => {
        return 800
      }
    },
    // 获取表格数据方法
    getTableData: {
      type: Function,
      default: null
    },
    // 多选框
    showSelection: {
      type: Boolean,
      default: false
    },
    // 序号列
    showNo: {
      type: Boolean,
      default: false
    },
    showNoString: {
      type: String,
      default: '序号'
    }
  },

  data() {
    return {
      height: 0, // 表格高度
      list: [], //
      multipleSelection: [],
      selectionData: {},
      loading: false // 加载
    }
  },

  watch: {
    getTableData: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.pageChange()
        }
      }
    },
    tableData: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.list = newValue
        }
      }
    }
  },
  mounted() {},
  destroyed() {
    window.onresize = null
  },
  methods: {
    // 懒加载
    load(tree, treeNode, resolve) {
      console.log(tree, treeNode)
      resolve(tree.children)
    },
    updateTableHeight() {
      this.$nextTick(() => {
        this.height =
          this.getTableHeight() -
          (this.page ? this.$refs.pagination.$el.offsetHeight : 0)
      })
    },
    pageChange() {
      this.loading = true
      if (this.getTableData) {
        this.getTableData({
          ...this.tableParams
        }).then((res) => {
          this.list = res.data.children
          console.log(res)
          this.loading = false
        })
      }
    },
    handleSelectionChange(selection) {
      this.multipleSelection = selection
      this.$emit('selectionChange', utils.clone(this.multipleSelection))
    },
    handleSelect(selection, row) {},

    handleSelectAll(selection) {},

    clearSelection() {
      this.$refs.table.clearSelection()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
