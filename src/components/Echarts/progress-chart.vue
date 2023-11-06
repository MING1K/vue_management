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
        // 最大值——最小值
        min: 0,
        max: 100
      },
      yAxis: {
        // 隐藏y
        show: false,
        // 均分
        type: 'category'
      },
      series: [
        {
          type: 'bar',
          data: this.chartData,
          // 柱状图宽度
          barWidth: 20,
          color: 'blue',
          // 柱条背景
          showBackground: true,
          backgroundStyle: {
            color: '#eee'
          },
          // 文本
          label: {
            show: true,
            // 改变文本内容显示|
            formatter: '|',
            // 文本标签位置
            position: 'right',
            // 文本字体大小
            fontSize: 20
          }
        }
      ],
      // 布局
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
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
