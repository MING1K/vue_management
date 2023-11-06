<template>
  <div ref="myChart" class="line-chart" />
</template>

<script>
import * as echarts from 'echarts'
export default {
  props: {
    chartData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  mounted() {
    // 初始化实例
    let myChart = echarts.init(this.$refs.myChart)
    // 配置数据
    myChart.setOption({
      xAxis: {
        // 隐藏x
        show: false,
        // 均分
        type: 'category'
      },
      yAxis: {
        // 隐藏y
        show: false
      },
      series: [
        {
          type: 'bar',
          data: this.chartData
        }
      ],
      // 布局
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      },
      tooltip: {}
    })
    // 自适应大小
    window.addEventListener('resize', () => {
      if (myChart) myChart.resize()
    })
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.line-chart {
  width: 100%;
  height: 100%;
}
</style>
