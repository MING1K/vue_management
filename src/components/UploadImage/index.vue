<!--
 * @Author       : ming
 * @Date         : 2023-10-29 22:26:26
 * @LastEditors  : ming
 * @LastEditTime : 2023-11-02 15:42:27
 * @Description  : 上传图片
-->
<template>
  <el-upload
    class="avatar-uploader"
    :action="`${preUploadUrl}${uploadFileUrl}`"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
  </el-upload>
</template>
<script>
export default {
  props: {
    imageUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
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
  methods: {
    // 上传成功
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(res.data)
      this.$emit('changeUrl', res.data)
    },
    // 上传前
    beforeAvatarUpload(file) {
      let type = file.type.toLowerCase()
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
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
