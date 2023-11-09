<template>
  <el-dialog
    append-to-body
    visible
    :title="title"
    :before-close="handleClose"
    :close-on-click-modal="false"
    width="70%"
  >
    <el-scrollbar max-height="70vh">
      <div class="dialog-main">
        <select-table
          ref="skuListTable"
          :page="true"
          :get-table-data="getSkuListBySpuId"
          :table-params="searchParams"
          :cols="cols"
          :show-no="true"
        >
          <template slot="skuDefaultImg" slot-scope="scope">
            <img class="table-image" :src="scope.row.skuDefaultImg" :alt="scope.row.skuName">
          </template>
        </select-table>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: {
    // 编辑参数
    editParams: {
      type: Object,
      default: null
    },
    autoParams: {
      type: Object,
      default: null
    },
    handleType: {
      type: String,
      default: 'view' // 添加
    }
  },
  data() {
    return {
      tip: 'sku列表', // title
      spuName: '',
      spuId: '',
      category3Id: '',
      cols: [
        { prop: 'skuName', label: 'SKU名称', tooltip: true },
        { prop: 'skuDesc', label: '描述', tooltip: true },
        { prop: 'price', label: '价格', tooltip: true },
        { prop: 'weight', label: '重量', tooltip: true },
        { prop: 'skuDefaultImg', label: '图片', slot: true }
        // { prop: 'operate', label: '操作', width: 80, slot: true }
      ]
    }
  },
  computed: {
    title() {
      let { tip, spuName } = this
      return this.handleType === 'view' ? `查看${spuName}的${tip}` : `编辑${tip}`
    },
    savecontent() {
      return this.handleType === 'view' ? '新增' : '提交'
    },
    // 接口
    getSkuListBySpuId() {
      return this.$API.sku.getSkuListBySpuId
    },
    searchParams() {
      return {
        spuId: this.spuId,
        category3Id: this.category3Id
      }
    }
  },
  watch: {},
  mounted() {
    this.init()
  },
  methods: {
    handleClose(res) {
      this.$emit('closedialog', res)
    },
    async init() {
      let { id, spuName, category3Id } = this.editParams
      this.spuId = id
      this.spuName = spuName
      this.category3Id = category3Id // 组件复用所需，无意义
    }
  }
}
</script>
  <style lang="scss" scoped>
.dialog-main {
  height: 100%;
  width: 99%;
  overflow: auto;
  height: 500px;
}
.table-image {
  height: 100px;
  width: 100px;
}
</style>

