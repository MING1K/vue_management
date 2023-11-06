<template>
  <div class="card-detail-view">
    <el-card>
      <div class="card-header">
        <span class="title">{{ baseInfo.title || '' }}</span>
        <span class="icon el-icon-info"></span>
      </div>
      <div class="card-content">
        <span class="title">{{ baseInfo.content || '' }}</span>
      </div>
      <div class="card-echarts">
        <slot name="echart" />
      </div>
      <div class="card-footer">
        <slot name="footer" />
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    baseInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.card-detail-view {
  // width: 25%;
  height: 100%;
  margin: 8px 10px;
  max-width: 500px;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 300px;
  ::v-deep .el-card {
    height: 100%;
    .el-card__body {
      padding: 15px;
      height: 100%;
    }
  }
  .card-header {
    height: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #d9d9d9;
    font-size: 14px;
  }
  .card-content {
    height: 50px;
    color: #000000;
    font-size: 25px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .card-echarts {
    width: 100%;
    height: 50px;
  }
  .card-footer {
    width: 100%;
    height: 30px;
    font-size: 14px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>
