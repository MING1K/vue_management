<template>
  <div class="select-table">
    <el-table
      ref="table"
      :key="refreshKey"
      v-loading="loading"
      height="400px"
      :row-key="useKey"
      :data="list"
      v-bind="{ border: true, ...$attrs }"
      :default-sort="{ prop: 'storder', order: 'ascending' }"
      v-on="$listeners"
      @selection-change="handleSelectionChange"
      @select="handleSelect"
      @select-all="handleSelectAll"
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
        label="序号"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          {{ (pageNumber - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
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

    <el-pagination
      v-if="page"
      ref="pagination"
      hide-on-single-page
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="totalNum"
      :pager-count="5"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :current-page="pageNumber"
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="pageChange"
    />
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
    // 使用分页
    page: {
      type: Boolean,
      default: false
    },
    // pageSize: {
    //   type: Number,
    //   default: 20,
    // },
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

    pageNumberString: {
      type: String,
      default: () => 'page'
    },
    pageSizeString: {
      type: String,
      default: () => 'limit'
    },
    showSelection: {
      type: Boolean,
      default: false
    },
    showNo: {
      type: Boolean,
      default: false
    },
    rowKey: {
      type: String,
      default: 'gid'
    },
    refreshKey: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      height: 0, // 表格高度
      pageNumber: 1, // 当前页
      pageSizes: [10, 20, 30, 40, 50, 100], // 每页条数
      pageSize: 50, // 每页条数
      list: [], //
      total: -1, // 总条数
      // refreshKey: false,
      multipleSelection: [],
      selectionData: {},
      loading: false // 加载
    }
  },

  computed: {
    totalNum() {
      return this.total === -1 ? this.allData?.length : this.total
    },
    allData() {
      return this.tableData || []
    },
    useKey() {
      return this.showSelection ? this.rowKey : null
    }
  },

  watch: {
    tableParams: {
      immediate: true,
      handler(newValue) {
        if (this.page) {
          this.pageChange()
        }
      }
    }
  },
  mounted() {},
  destroyed() {
    window.onresize = null
  },
  methods: {
    updateTableHeight() {
      this.$nextTick(() => {
        this.height =
          this.getTableHeight() -
          (this.page ? this.$refs.pagination.$el.offsetHeight : 0)
      })
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize || this.pageSize
      this.pageChange()
    },
    pageChange(pageNumber) {
      if (this.tableParams?.category3Id) {
        this.loading = true
        this.pageNumber = pageNumber || this.pageNumber
        if (this.getTableData) {
          this.getTableData({
            ...{
              [this.pageNumberString]: this.pageNumber,
              [this.pageSizeString]: this.pageSize
            },
            ...this.tableParams
          }).then((res) => {
            this.list = res.data.records
            this.total = res.data.total
            this.loading = false
          })
        } else {
          let start = (this.pageNumber - 1) * this.pageSize
          this.list = []
          for (let index = start; index < start + this.pageSize; index++) {
            this.allData[index] && this.list.push(this.allData[index])
          }
          this.loading = false
        }
      } else {
        this.list = []
        this.total = 0
      }
    },
    handleSelectionChange(selection) {
      this.multipleSelection = selection
      this.$emit('SelectionChange', utils.clone(this.multipleSelection))
    },
    handleSelect(selection, row) {},

    handleSelectAll(selection) {}
  }
}
</script>
<style lang="scss" scoped>
</style>
