<template>
  <div class="cards-view">
    <card-detail-view :base-info="salesInfo">
      <template slot="echart">
        <div class="sales-info card-view-echart">
          <span>
            周同比{{ ' ' + (salesInfo.weekPercent) }}
            <div :class="salesInfo.weekUp === true ? 'el-icon-caret-top' : 'el-icon-caret-bottom'" :style="{color: salesInfo.weekUp === true ? 'red' : '#17d437'}" />
          </span>
          <span>
            日同比{{ ' ' + (salesInfo.dayPercent) }}
            <div :class="salesInfo.dayUp === true ? 'el-icon-caret-top' : 'el-icon-caret-bottom'" :style="{color: salesInfo.dayUp === true ? 'red' : '#17d437'}" />
          </span>
        </div>
      </template>
      <template slot="footer">
        <div class="sales-info-footer card-view-footer">
          <span>日销售额{{ ' ' + (salesInfo.daySalesSum) }}</span>
        </div>
      </template>
    </card-detail-view>
    <card-detail-view :base-info="viewsInfo">
      <template slot="echart">
        <line-chart class="views-info card-view-echart" :chart-data="viewsInfo.lineData" />
      </template>
      <template slot="footer">
        <div class="views-info-footer card-view-footer">
          <span>日访问量{{ ' ' + (viewsInfo.dayViewsSum) }}</span>
        </div>
      </template></card-detail-view>
    <card-detail-view :base-info="paysInfo">
      <template slot="echart">
        <bar-chart class="pays-info card-view-echart" :chart-data="paysInfo.barData" />
      </template>
      <template slot="footer">
        <div class="pays-info-footer card-view-footer">
          <span>转化率{{ ' ' + (paysInfo.transPercent) }}</span>
        </div>
      </template></card-detail-view>
    <card-detail-view :base-info="activityInfo">
      <template slot="echart">
        <progress-chart class="activity-info card-view-echart" :chart-data="activityInfo.barData" />
      </template>
      <template slot="footer">
        <div class="activity-info-footer card-view-footer">
          <span>
            周同比{{ ' ' + (activityInfo.weekPercent) }}
            <div :class="activityInfo.weekUp === true ? 'el-icon-caret-top' : 'el-icon-caret-bottom'" :style="{color: activityInfo.weekUp === true ? 'red' : '#17d437'}" />
          </span>
          <span>
            日同比{{ ' ' + (activityInfo.dayPercent) }}
            <div :class="activityInfo.dayUp === true ? 'el-icon-caret-top' : 'el-icon-caret-bottom'" :style="{color: activityInfo.dayUp === true ? 'red' : '#17d437'}" />
          </span>
        </div>
      </template>
    </card-detail-view>
  </div>
</template>

<script>
import cardDetailView from './card-detail-view.vue'
import lineChart from '@/components/Echarts/line-chart.vue'
import barChart from '@/components/Echarts/bar-chart.vue'
import progressChart from '@/components/Echarts/progress-chart.vue'
export default {
  components: { cardDetailView, lineChart, barChart, progressChart },
  data() {
    return {
      salesInfo: {
        title: '总销售额',
        content: '￥ 126560',
        weekPercent: '12.1%', // 周同比
        dayPercent: '5%', // 日同比
        weekUp: true, // 周同比是否增长
        dayUp: false, // 日同比是否增长
        daySalesSum: '￥ 126560' // 日销售额
      },
      viewsInfo: {
        title: '访问量',
        content: '88460',
        dayViewsSum: '1235', // 日访问量
        lineData: [10, 36, 15, 22, 8, 30, 58, 15, 28, 16, 20, 40]
      },
      paysInfo: {
        title: '支付笔数',
        content: '88460',
        transPercent: '65%', // 转化率
        barData: [10, 36, 15, 22, 8, 30, 58, 15, 28, 16, 20, 40]
      },
      activityInfo: {
        title: '运营活动效果',
        content: '78%',
        weekPercent: '12.1%', // 周同比
        dayPercent: '5%', // 日同比
        weekUp: true, // 周同比是否增长
        dayUp: false, // 日同比是否增长
        barData: [78]
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
    }
  }
}
</script>

<style lang="scss" scoped>
.cards-view {
  height: auto;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .sales-info {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
    span {
      margin-right: 15px;
    }

  }
  .card-view-echart {
    height: 100%;
    width: 100%;
  }
  .card-view-footer {
    span {
      margin-right: 15px;
    }
  }
}
</style>
