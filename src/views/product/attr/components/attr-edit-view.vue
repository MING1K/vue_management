<template>
  <div class="dialog-main gl-scrollbar">
    <div class="attr-row">
      <label>属性名</label><el-input
        v-model="attrInfo.attrName"
        placeholder="请输入属性名"
        style="width: 220px"
      />
    </div>
    <div class="attr-row">
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!attrInfo.attrName"
        @click="handleAddAttr"
      >添加属性值</el-button>
      <el-button @click="handleClose">取消</el-button>
    </div>
    <div class="attr-table">
      <select-table
        ref="attrDetailTable"
        :page="true"
        :table-data="tabledata"
        :cols="cols"
        :show-no="true"
      >
        <template slot="valueName" slot-scope="scope">
          <el-input
            v-if="scope.row.flag"
            ref="rowValueName"
            v-model="scope.row.valueName"
            autofocus
            placeholder="请输入属性值名称"
            size="mini"
            @blur="changeToView(scope.row, scope.$index)"
            @keyup.native.enter="$event.target.blur()"
          />
          <!-- 也可以用:ref="$index" -->
          <span
            v-else
            style="display: block"
            @click="changeToEdit(scope.row)"
          >{{ scope.row.valueName }}</span>
        </template>
        <template slot="operate" slot-scope="scope">
          <!-- @onConfirm 老版本 @confirm新版本2.15.6+ -->
          <el-popconfirm :title="`确定删除属性 ${scope.row.valueName} 吗？`" @onConfirm="handleDelete(scope)">
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
        :disabled="!attrInfo.attrName || attrInfo.attrValueList.length < 1"
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
      tip: '售卖属性', // title
      cols: [
        { prop: 'valueName', label: '属性值名称', tooltip: true, slot: true },
        { prop: 'operate', label: '操作', width: 280, slot: true }
      ],
      // 商品属性
      attrInfo: {
        attrName: '', // 属性名
        attrValueList: [], // 属性值
        categoryId: 0,
        categoryLevel: 3
      }
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
      return this.attrInfo.attrValueList || []
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
    // 添加属性值
    handleAddAttr() {
      let obj = {
        valueName: '',
        attrId: this.attrInfo?.id || undefined,
        flag: true // 用于切换查看模式与编辑模式
      }
      this.attrInfo?.attrValueList.push(obj)
      this.$nextTick(() => {
        this.$refs.rowValueName.focus()
      })
    },
    // 删除属性值
    handleDelete({ row, $index }) {
      this.attrInfo.attrValueList.splice($index, 1)
    },
    handleSave() {
      let valid = true
      // 属性值不能为空
      this.attrInfo.attrValueList.forEach((item) => {
        if (item.valueName === '') valid = false
      })
      if (this.attrName === '' || !valid) {
        this.$message.warning('属性名或属性值未填，请检查后重新提交！')
        return
      }
      // 删除掉flag属性
      let data = utils.clone(this.attrInfo)
      data.attrValueList.forEach(item => {
        delete item.flag
      })
      if (this.handleType === 'edit') {
        // data.attrValueList = data.attrValueList.filter((item) => !item.id)
        console.log(data)
        this.$API.product.updateAttrInfo(data).then((res) => {
          this.$message.success('编辑品牌属性成功！')
          this.handleClose('edit')
        })
      } else if (this.handleType === 'add') {
        this.$API.product.addAttrInfo(data).then((res) => {
          console.log(res)
          this.$message.success('增加品牌属性成功！')
          this.handleClose('add')
        })
      }
    },
    async init() {
      if (this.handleType === 'edit') {
        let data = utils.clone(this.editParams)
        let auto = utils.clone(this.autoParams)
        this.attrInfo.id = data.id
        this.attrInfo.attrName = data.attrName
        this.attrInfo.attrValueList = (data?.attrValueList || [])
        // 在修改某一个属性的时候，将相应的属性值元素添加上flag这个标记
        /* this.attrInfo.attrValueList = (data?.attrValueList || []).map(
          (item) => {
            item.flag = false
            return item
          }
        ) */
        this.attrInfo.attrValueList.forEach(item => {
          // 这样书写也可以给属性值添加flag自动，但是会发现视图不会跟着变化(因为flag不是响应式数据
          // 因为Vue无法探测普通的新增 property,这样书写的属性并非响应式属性(数据变化视图跟这边)
          this.$set(item, 'flag', false)
        })
        this.attrInfo.categoryId = auto?.category3Id || 0
        console.log(data, auto)
      } else {
        let auto = utils.clone(this.autoParams)
        this.attrInfo.categoryId = auto?.category3Id || 0
      }
    },
    // 失去焦点|获得焦点事件
    changeToView(row, index) {
      // 当属性值为空时，提示
      if (row.valueName.trim() === '') {
        this.$message.warning('请添加一个正常的属性值！')
        // this.$refs.rowValueName.focus()
        this.attrInfo.attrValueList.splice(index, 1)
        return
      }
      // 属性值不能重复
      let ifRepeat = this.attrInfo.attrValueList.some(item => item.valueName === row.valueName.trim() && row !== item)
      if (ifRepeat) {
        this.$message.warning('属性值不能重复！')
        this.$refs.rowValueName.focus()
        return
      }
      row.flag = !row.flag
    },
    changeToEdit(row) {
      row.flag = true
      this.$nextTick(() => {
        this.$refs.rowValueName.focus()
      })
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
</style>
