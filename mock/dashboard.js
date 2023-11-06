const dashboardData = require('./data.json')
module.exports = [
  {
    url: '/vue-admin-template/dashboard/data',
    type: 'get',
    response: config => {
      const items = dashboardData.items
      return {
        code: 20000,
        data: dashboardData
      }
    }
  }
]
