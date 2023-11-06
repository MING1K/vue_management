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
        type: 'category'
      },
      yAxis: {
        // 隐藏y
        show: false
      },
      series: [
        {
          type: 'line',
          data: this.chartData,
          // 线是否平滑
          smooth: true,
          // 拐点样式
          itemStyle: {
            opacity: 0
          },
          // 线样式
          lineStyle: {
            color: '#7ba1e9'
          },
          // 填充区域样式
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#d9eafe' // 0% 处的颜色
                },
                {
                  offset: 0.8,
                  color: '#fff' // 100% 处的颜色
                },
                {
                  offset: 1,
                  color: '#fff' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
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
