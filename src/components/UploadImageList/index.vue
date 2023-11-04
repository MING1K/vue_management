<!--
 * @Author       : ming
 * @Date         : 2023-11-02 15:43:57
 * @LastEditors  : ming
 * @LastEditTime : 2023-11-02 23:36:23
 * @Description  : 上传图片
-->
<template>
  <div class="upload-image-list">
    <el-upload
      :action="`${preUploadUrl}${uploadFileUrl}`"
      :file-list="imageList"
      :show-file-list="true"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :on-remove="handleRemove"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    // 初始传入的image数组
    files: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      imageList: []
    }
  },
  computed: {
    preUploadUrl() {
      return this.$API.upload.preUploadUrl
    },
    uploadFileUrl() {
      return this.$API.upload.uploadFileUrl
    }
  },
  watch: {
    files: {
      immediate: true,
      handler(newVal) {
        console.log('imageList, fileList', this.imageList, newVal)
        if (newVal !== this.imageList) {
          this.imageList = newVal
        }
      }
    }
  },
  methods: {
    // 删除图片
    handleRemove(file, fileList) {
      console.log(file, fileList)
      this.imageList = this.imageList.filter(item => {
        if ((file?.name && file.name === item.name) || file?.uid && file?.uid === item?.uid) {
          return false
        }
        return true
      })
      this.$emit('changeList', this.imageList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 上传成功
    handleAvatarSuccess(res, file, fileList) {
      console.log(res, file, fileList)
      if (res?.data) {
        this.imageList.push({ name: file.name, url: res.data, uid: file.uid })
        console.log('handleAvatarSuccess', this.imageList)
        this.$emit('changeList', this.imageList)
      } else {
        let len = fileList.length
        fileList.splice(len - 1, 1)
        this.$message.error('上传失败，请重试！')
      }
    },
    // 上传前
    beforeAvatarUpload(file) {
      // debugger
      let type = file.type.toLowerCase()
      console.log(type)
      if (!/(?:jpg|gif|png|jpeg|webp)$/i.test(type)) {
        this.$message.error('只允许上传jpg|gif|png|jpeg|webp格式的图片')
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 10MB!')
        return false
      }
      return true
    }
  }
}
</script>
