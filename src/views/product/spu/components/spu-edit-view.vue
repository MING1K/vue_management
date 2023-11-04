<template>
  <div class="dialog-main gl-scrollbar">
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      label-width="150px"
    >
      <div v-for="(item, row) in formList" :key="row">
        <div class="form-row">
          <el-form-item
            v-if="item.type === 'input'"
            :label="item.label"
            :prop="item.prop"
          >
            <el-input
              v-model="form[item.prop]"
              :placeholder="'请输入' + item.label"
              :disabled="item.disable"
            />
          </el-form-item>
          <el-form-item
            v-else-if="item.type === 'textarea'"
            :label="item.label"
            :prop="item.prop"
          >
            <el-input
              v-model="form[item.prop]"
              type="textarea"
              :placeholder="'请输入' + item.label"
              :disabled="item.disable"
            />
          </el-form-item>
          <el-form-item
            v-else-if="item.prop === 'tmId'"
            :label="item.label"
            :prop="item.prop"
          >
            <!-- 通过搜索获取品牌（新增时可用） -->
            <!-- <el-select
              v-model="form[item.prop]"
              :placeholder="'请选择' + item.label"
              :disabled="item.disable"
              clearable
              filterable
              remote
              :remote-method="remoteMethod"
              :loading="tmLoading"
            >
              <el-option
                v-for="choice in tmData"
                :key="choice.id"
                :label="choice.tmName"
                :value="choice.id"
              />
            </el-select> -->
            <el-select
              v-model="form[item.prop]"
              :placeholder="'请选择' + item.label"
              :disabled="item.disable"
              clearable
              filterable
            >
              <el-option
                v-for="choice in tmData"
                :key="choice.id"
                :label="choice.tmName"
                :value="choice.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-else-if="item.type === 'image'"
            :label="item.label"
            :prop="item.prop"
          >
            <upload-image-list
              :files="form[item.prop]"
              @changeList="changeList"
            />
          </el-form-item>
        </div>
      </div>
    </el-form>

    <div class="attr-row">
      <label for="attr" style="width: 130px; text-align: right; font-size: 14px; color: #606266;">销售属性</label>
      <el-select
        id="attr"
        v-model="saleAttr"
        :placeholder="`还有${spuSaleAttrSelect.length}销售属性未选择`"
        clearable
        filterable
      >
        <el-option
          v-for="choice in spuSaleAttrSelect"
          :key="choice.id"
          :label="choice.name"
          :value="choice.id"
        />
      </el-select>
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="saleAttr === '' || spuSaleAttrSelect.length < 1"
        @click="handleAddAttr"
      >添加销售属性</el-button>
    </div>
    <div class="attr-table">
      <select-table
        ref="attrDetailTable"
        :page="true"
        :table-data="tabledata"
        :cols="cols"
        :show-no="true"
        class="select-table-left"
      >
        <template slot="spuSaleAttrValueList" slot-scope="{row, $index}">
          <el-tag
            v-for="(tag, index) in row.spuSaleAttrValueList"
            :key="index"
            closable
            :disable-transitions="false"
            @close="handleDeleteValue(row.spuSaleAttrValueList, index)"
          >{{ tag.saleAttrValueName }}</el-tag>
          <el-input
            v-if="row.inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            class="input-new-tag"
            size="small"
            @blur="handleInputConfirm(row, $index)"
            @keyup.enter.native="$event.target.blur()"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">添加</el-button>
        </template>
        <template slot="operate" slot-scope="scope">
          <!-- @onConfirm 老版本 @confirm新版本2.15.6+ -->
          <el-popconfirm :title="`确定删除销售属性 ${scope.row.saleAttrName} 吗？`" @onConfirm="handleDelete(scope)">
            <el-button
              slot="reference"
              type="danger"
              size="mini"
              icon="el-icon-delete"
            />
          </el-popconfirm>
        </template>
      </select-table>
    </div>
    <div class="attr-row row-center">
      <el-button
        type="primary"
        @click="handleSave"
      >保存</el-button>
      <el-button @click="handleClose">取消</el-button>
    </div>
  </div>
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
      tip: 'SPU信息', // title
      cols: [
        { prop: 'saleAttrName', label: '属性名', width: 200, tooltip: true },
        { prop: 'spuSaleAttrValueList', label: '属性值名称列表', align: 'left', slot: true },
        { prop: 'operate', label: '操作', width: 280, slot: true }
      ],
      // 表单 // 商品属性
      form: {
        spuName: '', // 名称
        description: '', // 描述
        spuSaleAttrList: [], // 属性值
        spuImageList: [], // 照片list
        category3Id: 0,
        tmId: undefined,
        id: undefined
      },
      // 表单项
      formList: [
        { prop: 'spuName', label: 'SPU名称', type: 'input' },
        { prop: 'tmId', label: '品牌', type: 'select' },
        { prop: 'description', label: 'SPU描述', type: 'textarea' },
        { prop: 'spuImageList', label: 'SPU图片', type: 'image' }
      ],
      // 校验规则
      formRules: {
        spuName: [
          { required: true, message: '请输入SPU名称', trigger: 'blur' },
          { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'change' }
        ],
        tmId: [{ required: true, message: '请选择品牌', trigger: 'blur' }],
        description: [{ required: true, message: '请输入SPU描述', trigger: 'blur' }],
        spuImageList: [{ required: true, message: '请选择图片', trigger: 'blur' }]
      },
      // 下拉框数据
      tmData: [], // 搜索的品牌数据
      tmLoading: false, // 品牌下拉框加载
      saleAttr: '', // 销售属性
      spuSaleAttr: [], // 销售属性下拉数据
      inputValue: '' // 动态编辑标签
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
    spuSaleAttrSelect() {
      let hasAttr = (this.form?.spuSaleAttrList || []).map(item => {
        return item.saleAttrName
      })
      console.log(hasAttr, this.spuSaleAttr)
      return this.spuSaleAttr.filter(item => (hasAttr.indexOf(item.name) === -1))
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
    // 添加售卖属性
    handleAddAttr() {
      console.log(this.saleAttr)
      let saleAttrItem = this.spuSaleAttr.find(item => item.id === this.saleAttr)
      let obj = {
        baseSaleAttrId: this.saleAttr,
        saleAttrName: saleAttrItem?.name || undefined,
        spuId: this.form.id,
        spuSaleAttrValueList: [],
        inputVisible: false // 添加售卖属性值，显示输入框
      }
      this.form.spuSaleAttrList.push(obj)
      this.saleAttr = ''
    },
    // 删除属性值
    handleDelete({ row, $index }) {
      this.form.spuSaleAttrList.splice($index, 1)
    },
    // 获取下拉列表（新增时可用）
    // remoteMethod(query) {
    //   if (query !== '') {
    //     this.tmLoading = true
    //     this.$API.spu.queryTrademarkByKeyword(query).then(res => {
    //       this.tmData = res?.data || []
    //       this.tmLoading = false
    //     }).catch(() => {
    //       this.tmData = []
    //       this.tmLoading = false
    //     })
    //   } else {
    //     this.tmData = []
    //   }
    // },
    // 获取图片地址
    changeList(imgList) {
      this.form.spuImageList = imgList
    },
    // 删除售卖属性值
    handleDeleteValue(list, index) {
      list.splice(index, 1)
    },
    // 为售卖属性添加值（显示输入框）
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.focus()
      })
    },
    // 为售卖属性添加值（保存）
    handleInputConfirm(row, index) {
      let inputValue = this.inputValue.trim()
      if (!inputValue) {
        this.$message.warning('请添加一个正常的属性值！')
        this.$refs.saveTagInput.focus()
        return
      }
      let ifRepeat = row.spuSaleAttrValueList.some(item => item.saleAttrValueName === inputValue)
      if (ifRepeat) {
        this.$message.warning('属性值不能重复！')
        this.$refs.saveTagInput.focus()
        return
      }
      let obj = {
        baseSaleAttrId: row.baseSaleAttrId,
        isChecked: undefined,
        saleAttrName: row.saleAttrName,
        saleAttrValueName: inputValue,
        spuId: row.spuId
      }
      row.spuSaleAttrValueList.push(obj)
      this.inputValue = ''
      row.inputVisible = false
    },
    handleSave() {
      console.log(this.form)
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          let data = utils.clone(this.form)
          data.spuImageList = data.spuImageList.map(item => {
            return {
              imgName: item.name,
              imgUrl: item.url,
              id: item?.id || undefined,
              spuId: data?.id || undefined
            }
          })
          data.spuSaleAttrList.forEach(item => {
            delete item.inputVisible
          })
          if (this.handleType === 'edit') {
            // data.spuSaleAttrList = data.spuSaleAttrList.filter((item) => !item.id)
            console.log(data)
            this.$API.spu.updateSpuInfo(data).then((res) => {
              this.$message.success('编辑SPU信息成功！')
              this.handleClose('edit')
            })
          } else if (this.handleType === 'add') {
            this.$API.spu.addSpuInfo(data).then((res) => {
              console.log(res)
              this.$message.success('增加SPU信息成功！')
              this.handleClose('add')
            })
          }
        } else {
          this.$message.error('有必填项未填，请检查后再提交！')
          return
        }
      })
    },
    async init() {
      // 售卖属性
      this.$API.spu.getSpuSaleAttrList().then(res => {
        this.spuSaleAttr = res?.data || []
      })
      // 品牌
      this.$API.spu.getTradeMarkLists().then(res => {
        this.tmData = res?.data || []
      })
      if (this.handleType === 'edit') {
        // spu信息
        try {
          let data = utils.clone(this.editParams)
          let { id, spuName, tmId, category3Id, description } = { ...data }
          Object.assign(this.form, { id, spuName, tmId, category3Id, description })
          // 图片
          this.$API.spu.getSpuImageListById(id).then(res => {
            this.form.spuImageList = (res?.data || []).map(item => {
              return {
                ...item,
                name: item.imgName,
                url: item.imgUrl
              }
            })
          })
          this.form.spuSaleAttrList = (data?.spuSaleAttrList || []).map(item => {
            item.inputVisible = false
            return item
          })
        } catch (error) {
          this.$message.error('获取数据失败，请重试')
        }
      } else {
        let auto = utils.clone(this.autoParams)
        this.form.category3Id = auto?.category3Id || 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-main {
  height: 100%;
  width: 99%;
  display: flex;
  flex-direction: column;
  .attr-row {
    height: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 8px 10px;
    > * + * {
      margin-left: 10px;
    }
  }
  .attr-table {
    // height: calc(100% - 500px);
    flex: 1;
    position: relative;
  }
  .row-center {
    justify-content: center;
  }
}
.select-table-left {
  margin-left: 150px;
}
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
