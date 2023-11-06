<template>
  <div ref="myChart" class="line-chart" />
</template>

<script>
import * as echarts from 'echarts'
export default {
  props: {
    // 数据
    chartData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      myChart: null
    }
  },
  computed: {
    // 数据
    chartSeriesData() {
      return this.chartData?.chartSeriesData || []
    },
    // 类目
    categoryData() {
      return this.chartData?.categoryData || []
    },
    // 标题
    title() {
      return this.chartData?.title || ''
    },
    tipName() {
      return this.chartData?.tipName || ''
    },
    option() {
      return {
        title: {
          text: this.title
        },
        // 提示
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        // 布局
        grid: {
          // left: '3%',
          // right: '4%',
          left: 20,
          right: 20,
          bottom: '3%',
          containLabel: true
        },
        // x轴
        xAxis: [
          {
            type: 'category',
            data: this.categoryData,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        // y轴
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: this.tipName,
            type: 'bar',
            barWidth: '40%',
            data: this.chartSeriesData
          }
        ]
      }
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(newVal) {
        this.init()
      }
    }
  },
  mounted() {
    // 初始化实例
    this.myChart = echarts.init(this.$refs.myChart)
    this.init()
    // 自适应大小
    window.addEventListener('resize', () => {
      if (this.myChart) this.myChart.resize()
    })
  },
  methods: {
    init() {
      // 配置数据
      this.myChart.setOption(this.option)
    }
  }
}
</script>

<style lang="scss" scoped>
.line-chart {
  width: 100%;
  height: 100%;
}
</style>
