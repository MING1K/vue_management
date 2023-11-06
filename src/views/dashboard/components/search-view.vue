<template>
  <div class="search-view">
    <el-card class="box-card">
      <div slot="header" class="box-header">
        <div class="title">线上热门搜索</div>
        <div class="right-drop">
          <el-dropdown>
            <span class="el-icon-more" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
              <el-dropdown-item>螺蛳粉</el-dropdown-item>
              <el-dropdown-item disabled>双皮奶</el-dropdown-item>
              <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="box-content box-container">
        <div class="content-chart">
          <search-line-chart-view class="chart-view" :info-data="searchUpData" />
          <search-line-chart-view class="chart-view" :info-data="searchDownData" />
        </div>
        <div class="content-table">
          <select-table
            ref="searchTable"
            :page="true"
            :show-no="true"
            show-no-string="排名"
            :table-data="searchTableData"
            :cols="searchCols"
          />
        </div>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="box-header">
        <div class="title">销售额类别占比</div>
        <div class="right-drop">
          <el-radio-group v-model="salesOnline" size="mini">
            <el-radio-button type="primary" label="all">全部渠道</el-radio-button>
            <el-radio-button type="primary" label="online">线上</el-radio-button>
            <el-radio-button type="primary" label="outline">线下</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="box-container">
        <pie-chart :chart-data="salesCategoryData" />
      </div>
    </el-card>
  </div>
</template>

<script>
import searchLineChartView from './search-line-chart-view.vue'
import pieChart from '@/components/Echarts/pie-chart.vue'
export default {
  components: { searchLineChartView, pieChart },
  data() {
    return {
      // 搜索用户数
      searchUpData: {
        title: '搜索用户数',
        info: '12321',
        percent: '17.1',
        isUpPercent: false,
        chartData: [10, 55, 30, 66, 77, 58, 20, 36, 19, 18, 66, 81]
      },
      // 人均搜索次数
      searchDownData: {
        title: '人均搜索次数',
        info: '2.7',
        percent: '26.2',
        isUpPercent: true,
        chartData: [56, 58, 20, 28, 36, 88, 54, 33, 36, 39, 50, 71]
      },
      // 搜索关键词
      searchTableData: [
        { keyWord: '第六届进博会规模创历史新高', searchNum: 4901853, weekChange: '120%' },
        { keyWord: '东北风雪天有多猛?市民手牵手被吹翻', searchNum: 4995434, weekChange: '180%' },
        { keyWord: '中美将举行军控磋商', searchNum: 4846917, weekChange: '50%' },
        { keyWord: '政策“真金白银”加力稳就业', searchNum: 4753143, weekChange: '33%' },
        { keyWord: '鸵鸟在街头狂奔', searchNum: 4641360, weekChange: '46%' },
        { keyWord: '清华教授：35岁考虑养老已经晚了', searchNum: 4517334, weekChange: '28%' },
        { keyWord: '29岁女教练因一张娃娃脸火出圈', searchNum: 4472821, weekChange: '12%' },
        { keyWord: '斗鱼方面证实CEO陈少杰失联已近3周', searchNum: 4372818, weekChange: '8%' },
        { keyWord: '清淡饮食等于吃素？', searchNum: 4274016, weekChange: '5%' },
        { keyWord: '张钧甯谈断崖式分手', searchNum: 4142913, weekChange: '50%' }
      ],
      searchCols: [
        { prop: 'keyWord', label: '搜索关键词', tooltip: true },
        { prop: 'searchNum', label: '用户数', tooltip: true, sortable: true },
        { prop: 'weekChange', label: '周涨幅', tooltip: true, sortable: true }
      ],
      // 销售额占比按钮
      salesOnline: 'all', // online outline 全部渠道 线上 线下
      // 销售额类别占比 饼图
      salesCategoryData: {
        title: '销售额类别占比',
        tipName: '销售额',
        // 数据
        chartSeriesData: []
      },
      // all online outline 全部渠道 线上 线下
      allChartData: [
        { value: 300, name: '家用电器' },
        { value: 400, name: '食用酒水' },
        { value: 500, name: '个护健康' },
        { value: 100, name: '服饰箱包' },
        { value: 200, name: '母婴产品' },
        { value: 100, name: '其他' }
      ],
      onlineChartData: [
        { value: 244, name: '家用电器' },
        { value: 321, name: '食用酒水' },
        { value: 301, name: '个护健康' },
        { value: 41, name: '服饰箱包' },
        { value: 111, name: '母婴产品' },
        { value: 69, name: '其他' }
      ],
      outlineChartData: [
        { value: 68, name: '家用电器' },
        { value: 15, name: '食用酒水' },
        { value: 41, name: '个护健康' },
        { value: 56, name: '服饰箱包' },
        { value: 70, name: '母婴产品' },
        { value: 25, name: '其他' }
      ]
    }
  },
  watch: {
    salesOnline: {
      immediate: true,
      handler(newVal) {
        if (newVal === 'all') {
          this.salesCategoryData.chartSeriesData = this.allChartData
        } else if (newVal === 'online') {
          this.salesCategoryData.chartSeriesData = this.onlineChartData
        } else if (newVal === 'outline') {
          this.salesCategoryData.chartSeriesData = this.outlineChartData
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search-view {
  height: auto;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .box-card {
    flex: 1;
    margin: 8px 10px;
    ::v-deep .el-card__body {
      height: 400px;
      width: 100%;
    }
    .box-container {
      width: 100%;
      height: 100%;
    }
    .box-header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    .box-content {
      display: flex;
      flex-direction: column;
      overflow: auto;
      .content-chart {
        height: 150px;
        display: flex;
        flex-direction: row;
        .chart-view {
          flex: 1;
          height: 100%;
        }
      }
      .content-table {
        height: calc(100% - 150px);
        margin: 8px 10px;
      }
    }
  }
}
</style>
