<template>
  <div class="sales-view">
    <el-card class="box-card">
      <div class="box-header">
        <el-tabs v-model="activeName" class="header-tabs">
          <el-tab-pane label="销售额" name="sales" />
          <el-tab-pane label="访问量" name="views" />
        </el-tabs>
        <div class="right-btns">
          <el-button size="mini" @click="setDate('day')">今日</el-button>
          <el-button size="mini" @click="setDate('week')">本周</el-button>
          <el-button size="mini" @click="setDate('month')">本月</el-button>
          <el-button size="mini" @click="setDate('year')">本年</el-button>
          <el-date-picker
            v-model="dateChoose"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="date-picker"
            size="mini"
            value-format="yyyy-MM-dd"
          />
        </div>
      </div>
      <div class="box-container">
        <div class="sale-card">
          <bar-chart-shadow :chart-data="showInfo" />
        </div>
        <div class="sale-list">
          <span>{{ showInfo.listName }}</span>
          <ul>
            <li v-for="(choice, index) in showInfo.orderList" :key="index">
              <div class="left">
                <div class="list-number" :class="index < 3 ? 'list-number-top' : ''">{{ index + 1 }}</div>
                <div>{{ choice.name }}</div>
              </div>
              <span>{{ choice.value.toLocaleString() }}</span>
            </li>
          </ul>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapState } from 'vuex'
import barChartShadow from '@/components/Echarts/bar-chart-shadow.vue'
export default {
  components: { barChartShadow },
  data() {
    return {
      // 切换
      activeName: 'sales',
      dateChoose: [],
      // 销售额数据
      sales: {
        title: '销售额趋势',
        // 提示名称
        tipName: '销售额',
        // 类目
        categoryData: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二'],
        // 数据
        chartSeriesData: [100, 50, 88, 52, 30, 59, 66, 75, 30, 88, 89, 110],
        // 列表名称
        listName: '门店销售额排名',
        orderList: [
          { name: '肯德基', value: 323234 },
          { name: '麦当劳', value: 299132 },
          { name: '汉堡王', value: 283998 },
          { name: '海底捞', value: 266223 },
          { name: '老街烧烤', value: 223445 },
          { name: '蜜雪冰城', value: 219663 },
          { name: '瑞幸咖啡', value: 200997 }
        ]
      },
      // 访问量数据
      views: {
        title: '访问量趋势',
        tipName: '访问量',
        categoryData: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二'],
        chartSeriesData: [80, 110, 66, 78, 35, 44, 58, 99, 45, 120, 58, 99],
        listName: '门店访问量排名',
        orderList: [
          { name: '蜜雪冰城', value: 452555 },
          { name: '老街烧烤', value: 335245 },
          { name: '海底捞', value: 256845 },
          { name: '瑞幸咖啡', value: 135852 },
          { name: '麦当劳', value: 123568 },
          { name: '汉堡王', value: 102525 },
          { name: '肯德基', value: 15285 }
        ]
      }
    }
  },
  computed: {
    showInfo() {
      if (this.activeName === 'sales') {
        return this.sales
      } else {
        return this.views
      }
    },
    ...mapState('dashboard', {
      listData: 'data'
    })
  },
  watch: {
    listData: {
      deep: true,
      handler(newVal) {
        this.changeData()
      }
    }
  },
  mounted() {
    if (!this.listData) {
      this.$store.dispatch('dashboard/getData')
    }
  },
  methods: {
    // 获取mock数据
    changeData() {
      this.sales.categoryData = this.listData.orderFullYearAxis
      this.sales.chartSeriesData = this.listData.orderFullYear
      this.views.categoryData = this.listData.userFullYearAxis
      this.views.chartSeriesData = this.listData.userFullYear
      this.sales.orderList = this.listData.orderRank.map(item => {
        item.value = item.money
        return item
      })
      this.views.orderList = this.listData.userRank.map(item => {
        item.value = item.money
        return item
      })
    },
    setDate(type) {
      console.log(dayjs().day(0).$W)
      if (type === 'day') {
        const day = dayjs().format('YYYY-MM-DD')
        this.dateChoose = [day, day]
      } else if (type === 'week') {
        let start, end
        if (dayjs().day(0).$W === 0) {
          start = dayjs().startOf('week').day(-6).format('YYYY-MM-DD')
          end = dayjs().endOf('week').day(0).format('YYYY-MM-DD')
        } else {
          start = dayjs().startOf('week').day(1).format('YYYY-MM-DD')
          end = dayjs().endOf('week').day(7).format('YYYY-MM-DD')
        }
        this.dateChoose = [start, end]
      } else if (type === 'month') {
        const start = dayjs().startOf('month').format('YYYY-MM-DD')
        const end = dayjs().endOf('month').format('YYYY-MM-DD')
        this.dateChoose = [start, end]
      } else if (type === 'year') {
        const start = dayjs().startOf('year').format('YYYY-MM-DD')
        const end = dayjs().endOf('year').format('YYYY-MM-DD')
        this.dateChoose = [start, end]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sales-view {
  height: auto;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .box-card {
    width: 100%;
    margin: 8px 10px;
    ::v-deep .el-card__header {
      border-bottom: none;
      width: 100%;
    }
    .box-header {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      position: relative;
      .header-tabs {
        width: 100%;
      }
      .right-btns {
        position: absolute;
        right: 0;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        >*+* {
          margin-left: 10px;
        }
        .date-picker {
          width: 250px;
        }
      }
    }
    .box-container {
      width: 100%;
      display: flex;
      flex-direction: row;
      height: 280px;
      .sale-card {
        height: 100%;
        margin: 8px 10px;
        flex-grow: 3;
        flex-shrink: 1;
        flex-basis: 600px;
      }
      .sale-list{
        height: 100%;
        margin: 8px 10px;
        flex-grow: 1;
        flex-shrink: 1;
        flex-basis: 200px;
        span {
          line-height: 28px;
          font-size: 1.17em;
          font-weight: bold;
        }
        ul {
          list-style: none;
          width: 100%;
          height: 100%;
          padding: 0;
          li {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            font-weight: normal;
            height: 32px;
            span {
              font-size: 14px;
              font-weight: normal;
            }
            .left {
              display: flex;
              flex-direction: row;
              align-items: center;
            }
            .list-number {
              margin-right: 20px;
              margin-left: 5px;
              width: 16px;
              height: 16px;
              text-align: center;
              &-top {
                background: rgb(212, 39, 39);
                border-radius: 10px;
                color: #fff;
              }
            }
          }
        }
      }
    }
  }
}
</style>
