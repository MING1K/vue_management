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
          text: this.title,
          subtext: '',
          left: 'center',
          top: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'right',
          orient: 'vertical'
        },
        series: [
          {
            name: this.tipName,
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            // 高亮状态的扇形区域
            emphasis: {
              label: {
                show: true,
                fontSize: 18,
                fontWeight: 'bold'
              }
            },
            data: this.chartSeriesData
          }
        ],
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          containLabel: true
        }
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
      // 鼠标移入获取数据
      this.myChart.on('mouseover', params => {
        const { name, value } = params.data
        this.myChart.setOption({
          title: {
            text: name,
            subtext: value
          }
        })
      })
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
