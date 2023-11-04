<template>
  <el-drawer
    :title="title"
    visible
    :direction="direction"
    :before-close="handleClose"
    size="40%"
  >
    <div class="drawer-view dialog-main gl-scrollbar">
      <template v-for="sku in skuInfoList">
        <el-row v-if="sku.type === 'input'" :key="sku.id">
          <el-col :span="5"><div class="sku-span">{{ sku.label }}</div></el-col>
          <el-col :span="16"><div class="sku-span" :title="skuInfo[sku.prop]">{{ skuInfo[sku.prop] }}{{ sku.other ? (' ' + sku.other) : '' }}</div></el-col>
        </el-row>
      </template>
      <el-row>
        <el-col :span="5"><div class="sku-span">平台属性</div></el-col>
        <el-col :span="16"><div class="sku-span tags">
          <el-tag v-for="skuAttr in skuInfo.skuAttrValueList" :key="skuAttr.id">{{ skuAttr.attrName }}-{{ skuAttr.valueName }}</el-tag>
        </div></el-col>
      </el-row>
      <el-row>
        <el-col :span="5"><div class="sku-span">销售属性</div></el-col>
        <el-col :span="16"><div class="sku-span tags">
          <el-tag v-for="skuSale in skuInfo.skuSaleAttrValueList" :key="skuSale.id">{{ skuSale.saleAttrName }}-{{ skuSale.saleAttrValueName }}</el-tag>
        </div></el-col>
      </el-row>
      <el-row>
        <el-col :span="5"><div class="sku-span">商品图片</div></el-col>
        <el-col :span="16">
          <div class="sku-span">
            <el-carousel height="400px">
              <el-carousel-item v-for="img in skuInfo.skuImageList" :key="img.id">
                <img :src="img.imgUrl" :alt="img.imgName">
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-drawer>
</template>

<script>
import utils from '@/utils/utils'
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
      tip: 'sku信息', // title
      direction: 'rtl', // 抽屉方向
      skuName: '',
      // spuId: '',
      // category3Id: '',
      skuInfoList: [
        { prop: 'skuName', label: 'SKU名称', type: 'input' },
        { prop: 'skuDesc', label: '描述', type: 'input' },
        { prop: 'price', label: '价格', type: 'input', other: '元' },
        { prop: 'weight', label: '重量', type: 'input', other: '千克' },
        { prop: 'skuDefaultImg', label: '图片', type: 'input' }
        // { prop: 'operate', label: '操作', type: 'input' }
      ],
      // sku信息
      skuInfo: {}
    }
  },
  computed: {
    title() {
      let { tip, skuName } = this
      return this.handleType === 'view' ? `${skuName}的${tip}` : `编辑${tip}`
    }
  },
  watch: {},
  mounted() {
    this.init()
  },
  methods: {
    handleClose(res) {
      this.$emit('closedrawer', res)
    },
    async init() {
      this.skuName = this.editParams.skuName
      this.skuInfo = utils.clone(this.editParams)
    }
  }
}
</script>
  <style lang="scss" scoped>
.dialog-main {
  height: 100%;
  width: 99%;
  overflow: auto;
}
.drawer-view {
  padding: 10px 10px;
  .el-row {
    margin: 15px;
    line-height: 40px;
    .el-col-5 {
      font-size: 16px;
      font-weight: bold;
      text-align: right;
      .sku-span {
        margin: 0 10px;
      }
    }
    .el-col-16 {
      word-break: break-all;
      word-wrap:break-word;
      white-space: pre-wrap;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3; /* 这里是超出几行省略 */
      overflow: hidden;
      .sku-span {
        margin: 8px 15px;
      }
      .tags {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        span {
          margin: 4px 8px;
        }
      }
    }
  }
}
</style>
<style>
.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}
.el-carousel__button {
  width: 10px;
  height: 10px;
  border-radius: 5px;
}
</style>
