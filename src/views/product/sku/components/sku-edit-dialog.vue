<template>
  <el-dialog visible :title="title" :before-close="handleClose" :close-on-click-modal="false" width="70%">
    <div class="dialog-main gl-scrollbar">
      <el-form ref="form" :model="form" :rules="formRules" label-width="150px">
        <div v-for="(item, row) in formList" :key="row">
          <div class="form-row">
            <el-form-item v-if="item.type === 'input'" :label="item.label" :prop="item.prop">
              <el-input v-model="form[item.prop]" :placeholder="'请输入' + item.label" :disabled="item.disable" />
            </el-form-item>
            <el-form-item v-else-if="item.type === 'number'" :label="item.label" :prop="item.prop">
              <el-input
                v-model="form[item.prop]"
                type="number"
                :placeholder="'请输入' + item.label"
                :disabled="item.disable"
              />
            </el-form-item>
            <el-form-item v-else-if="item.type === 'textarea'" :label="item.label" :prop="item.prop">
              <el-input
                v-model="form[item.prop]"
                type="textarea"
                :placeholder="'请输入' + item.label"
                :disabled="item.disable"
              />
            </el-form-item>
            <!-- 销售属性 -->
            <el-form-item v-else-if="item.type === 'inline-select2'" :label="item.label" :prop="item.prop">
              <el-form ref="skuSaleAttrValueList" :inline="true" label-width="120px">
                <div class="form-row form-row-warp">
                  <div v-for="(skuSale, inlineRow) in skuSaleAttrValueList" :key="inlineRow">
                    <el-form-item :label="skuSale.saleAttrName">
                      <el-select
                        v-model="skuSaleForm[inlineRow]"
                        :placeholder="'请选择' + skuSale.saleAttrName"
                        clearable
                        filterable
                      >
                        <el-option
                          v-for="choice in skuSale.spuSaleAttrValueList"
                          :key="choice.id"
                          :label="choice.saleAttrValueName"
                          :value="choice.id"
                        />
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
              </el-form>
            </el-form-item>
            <!-- 平台属性 -->
            <el-form-item v-else-if="item.type === 'inline-select1'" :label="item.label" :prop="item.prop">
              <el-form ref="skuAttrValueList" :inline="true" label-width="120px">
                <div class="form-row form-row-warp">
                  <div v-for="(skuAttr, inlineRow) in skuAttrValueList" :key="inlineRow">
                    <el-form-item :label="skuAttr.attrName">
                      <!-- 将数据根据inlineRow收集到skuAttrForm数组中，也可以使用v-model="skuAttr.?"将其存储到skuAttr中 -->
                      <el-select
                        v-model="skuAttrForm[inlineRow]"
                        :placeholder="'请选择' + skuAttr.attrName"
                        clearable
                        filterable
                      >
                        <el-option
                          v-for="choice in skuAttr.attrValueList"
                          :key="choice.id"
                          :label="choice.valueName"
                          :value="choice.id"
                        />
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
              </el-form>
            </el-form-item>

            <el-form-item v-else :label="item.label" :prop="item.prop">
              <strong>{{ form[item.prop] }}</strong>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <!-- 图片列表 -->
      <div class="attr-table-row">
        <label for="attrTable" class="attr-table-label">图片列表</label>
        <div ref="attrTable" class="attr-table">
          <select-table
            ref="attrDetailTable"
            :show-selection="true"
            :table-data="skuImageList"
            :cols="cols"
            :show-no="true"
            @SelectionChange="SelectionChange"
          >
            <template slot="imgUrl" slot-scope="scope">
              <img class="table-image" :src="scope.row.imgUrl" :alt="scope.row.imgName">
            </template>
            <template slot="operate" slot-scope="scope">
              <el-button
                v-if="scope.row.isDefault === 0"
                type="primary"
                size="mini"
                @click="changeToDefault(scope)"
              >设为默认</el-button>
              <el-tag v-else type="success">默认</el-tag>
            </template>
          </select-table>
        </div>
      </div>
      <div class="attr-row row-center">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="handleClose">取消</el-button>
      </div>
    </div>
  </el-dialog>
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
      default: 'add' // 添加
    }
  },
  data() {
    return {
      tip: 'SKU信息', // title
      cols: [
        { prop: 'imgUrl', label: '图片', slot: true },
        { prop: 'imgName', label: '名称', tooltip: true },
        { prop: 'operate', label: '操作', width: 280, slot: true }
      ],
      // 表单
      form: {
        category3Id: undefined, // spu信息获取
        createTime: undefined, // 不需要
        id: undefined, // 不需要
        isSale: undefined, // 不需要
        price: null, // 发送请求时必须为数字
        weight: '',
        skuDefaultImg: undefined,
        skuDesc: '',
        skuName: '',
        spuName: undefined, // 显示用，发送请求时删除
        spuId: undefined, // spu id spu信息获取
        tmId: undefined, // 品牌Id spu信息获取
        skuImageList: [], // 图片
        skuSaleAttrValueList: [], // 销售属性
        skuAttrValueList: [] // 平台属性
      },
      // 表单项
      formList: [
        { prop: 'spuName', label: 'SPU名称', type: '' },
        { prop: 'skuName', label: 'SKU名称', type: 'input' },
        { prop: 'price', label: '价格(元)', type: 'number' },
        { prop: 'weight', label: '重量(千克)', type: 'number' },
        { prop: 'skuDesc', label: '规格描述', type: 'textarea' },
        { prop: 'palntformAttr', label: '平台属性', type: 'inline-select1' },
        { prop: 'saleAttr', label: '销售属性', type: 'inline-select2' }
      ],
      // 校验规则
      formRules: {
        skuName: [
          { required: true, message: '请输入SKU名称', trigger: 'blur' },
          {
            min: 1,
            max: 40,
            message: '长度在 1 到 40 个字符',
            trigger: 'blur'
          }
        ],
        price: [{ required: true, message: '请输入价格(元)', trigger: 'blur' }],
        weight: [
          { required: true, message: '请输入重量(千克)', trigger: 'blur' }
        ],
        skuDesc: [
          { required: true, message: '请输入规格描述', trigger: 'blur' }
        ]
      },
      // 图片列表
      skuImageForm: [],
      skuImageList: [],
      // 销售属性
      skuSaleForm: [],
      skuSaleAttrValueList: [],
      // 平台属性
      skuAttrForm: [],
      skuAttrValueList: [],
      // 选中默认图片的id
      defaultImgId: null
    }
  },
  computed: {
    title() {
      let { tip } = this
      return this.handleType === 'add' ? `新增${tip}` : `编辑${tip}`
    },
    savecontent() {
      return this.handleType === 'add' ? '新增' : '提交'
    },
    tabledata() {
      return this.form.spuSaleAttrList || []
    },
    // 下拉框数据
    loadData() {
      return {}
    }
  },
  watch: {},
  mounted() {
    this.init()
  },
  methods: {
    handleClose(res) {
      this.$emit('closedialog', res)
      // this.$confirm('确认关闭？')
      //   .then(() => {
      //     this.$emit('closedialog')
      //   })
      //   .catch(() => {})
    },
    // 选中图片列表行
    SelectionChange(selection) {
      this.skuImageForm = utils.clone(selection)
    },
    // 设置图片默认
    changeToDefault({ row, $index }) {
      this.skuImageList.forEach((item) => {
        item.isDefault = 0
      })
      row.isDefault = 1
      this.form.skuDefaultImg = row.imgUrl // 默认图片
      this.defaultImgId = row.id
    },
    handleSave() {
      console.log(this.form)
      let data = utils.clone(this.form)
      // 图片
      data.skuImageList = this.skuImageForm.map((item) => {
        (item.isDefault === item.id) !== this.defaultImgId ? '0' : '1'
        return {
          id: undefined,
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          skuId: undefined,
          spuImgId: item.id
        }
      })
      // 平台属性
      data.skuAttrValueList = this.skuAttrForm
        .map((id, index) => {
          if (!id) return null
          let skuAttr = this.skuAttrValueList[index]
          let skuAttrItem = skuAttr.attrValueList.find(
            (item) => item.id === id
          )
          return {
            attrId: skuAttr.id,
            attrName: skuAttr.attrName,
            id: undefined,
            skuId: undefined,
            valueId: skuAttrItem.id,
            valueName: skuAttrItem.valueName
          }
        })
        .filter((item) => item)
      // 销售属性
      data.skuSaleAttrValueList = this.skuSaleForm
        .map((id, index) => {
          if (!id) return null
          let skuSale = this.skuSaleAttrValueList[index]
          let skuSaleItem = skuSale.spuSaleAttrValueList.find(
            (item) => item.id === id
          )
          return {
            id: undefined,
            saleAttrId: skuSale.id,
            saleAttrName: skuSale.saleAttrName,
            saleAttrValueId: skuSaleItem.id,
            saleAttrValueName: skuSaleItem.saleAttrValueName,
            skuId: undefined,
            spuId: skuSale.spuId
          }
        })
        .filter((item) => item)
      console.log(data)
      this.$API.sku.addSkuInfo(data).then((res) => {
        this.$message.success('新增SKU信息成功！')
        this.handleClose('add')
      })
      // this.$refs.form.validate(async(valid) => {
      //   if (valid) {
      //     let data = utils.clone(this.form)
      //     data.spuImageList = data.spuImageList.map(item => {
      //       return {
      //         imgName: item.name,
      //         imgUrl: item.url,
      //         id: item?.id || undefined,
      //         spuId: data?.id || undefined
      //       }
      //     })
      //     data.spuSaleAttrList.forEach(item => {
      //       delete item.inputVisible
      //     })
      //     if (this.handleType === 'edit') {
      //       // data.spuSaleAttrList = data.spuSaleAttrList.filter((item) => !item.id)
      //       console.log(data)
      //       this.$API.spu.updateSpuInfo(data).then((res) => {
      //         this.$message.success('编辑SPU信息成功！')
      //         this.handleClose('edit')
      //       })
      //     } else if (this.handleType === 'add') {
      //       this.$API.spu.addSpuInfo(data).then((res) => {
      //         console.log(res)
      //         this.$message.success('增加SPU信息成功！')
      //         this.handleClose('add')
      //       })
      //     }
      //   } else {
      //     this.$message.error('有必填项未填，请检查后再提交！')
      //     return
      //   }
      // })
      // // // 删除掉flag属性
    },
    async init() {
      if (this.handleType === 'edit') {
        this.form = { ...this.editParams }
      } else {
        let { category1Id, category2Id, category3Id } = { ...this.autoParams }
        let { id, spuName, tmId } = { ...this.editParams }
        Object.assign(this.form, {
          spuName, // 显示用
          tmId, // 品牌Id
          spuId: id, // spuId
          category3Id // category3Id
        })
        let result1 = this.$API.sku.getSpuImageListById(id)
        let result2 = this.$API.sku.getSpuSaleAttrListById(id)
        let result3 = this.$API.sku.getAttrInfoList({
          category1Id,
          category2Id,
          category3Id
        })
        await Promise.allSettled([result1, result2, result3]).then(
          ([res1, res2, res3]) => {
            console.log(res1, res2, res3)
            this.skuImageList = (res1?.value?.data || []).map((item) => {
              // 图片列表
              if (!item?.isDefault) item.isDefault = 0
              return item
            })
            this.skuSaleAttrValueList = res2?.value?.data || [] // 销售属性
            this.skuSaleAttrValueList.forEach(() => {
              let val = ''
              this.skuSaleForm.push(val)
            })
            this.skuAttrValueList = res3?.value?.data || [] // 平台属性
            this.skuAttrValueList.forEach(() => {
              let val = ''
              this.skuAttrForm.push(val)
            })
          }
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-main {
  height: 100%;
  width: 99%;
  max-height: 70vh;

  .attr-row {
    height: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 8px 10px;

    >*+* {
      margin-left: 10px;
    }
  }

  .attr-table-row {
    height: 500px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    position: relative;

    .attr-table-label {
      width: 150px;
      text-align: right;
      font-size: 14px;
      color: #606266;
      padding: 0 12px 0 0;
    }

    .attr-table {
      overflow: auto;
      flex: 1;

      .table-image {
        height: 100px;
        width: 100px;
      }
    }
  }

  .row-center {
    justify-content: center;
  }
}

.form-row-warp {
  display: flex;
  flex-wrap: wrap; // 自动换行

  >*+* {
    padding-bottom: 10px;
  }
}
</style>
