<template>
  <div class="search-line-chart">
    <div class="title">
      <span>{{ infoData.title }}<div class="icon el-icon-info" /></span>
    </div>
    <div class="info">
      <span class="main-info">{{ infoData.info }}</span>
      <span class="main-percent">{{ infoData.percent }}</span>
      <span class="main-icon"><div :class="infoData.isUpPercent === true ? 'el-icon-caret-top' : 'el-icon-caret-bottom'" :style="{color: infoData.isUpPercent === true ? 'red' : '#17d437'}" /></span>
    </div>
    <line-chart class="chart" :chart-data="infoData.chartData" />
  </div>
</template>

<script>
import lineChart from '@/components/Echarts/line-chart.vue'

export default {
  components: { lineChart },
  props: {
    infoData: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
.search-line-chart {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .title {
    height: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #d9d9d9;
    font-size: 14px;
    >*+* {
      margin-left: 15px;
    }
    .icon {
      margin-left: 30px;
    }
  }
  .info {
    height: 30px;
    display: flex;
    justify-content: flex-start;
    align-items: baseline;
    font-size: 20px;
    padding: 5px;
    >*+* {
      margin-left: 15px;
      font-size: 14px;
    }
    .main-info {
      width: 80px;
    }
    .main-percent {
      width: 30px;
    }
  }
}
</style>
