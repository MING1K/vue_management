<template>
  <div class="dashboard-container gl-scrollbar">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <cards-view />
    <sales-view />
    <search-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import cardsView from './components/cards-view.vue'
import salesView from './components/sales-view.vue'
import searchView from './components/search-view.vue'
export default {
  name: 'Dashboard',
  components: { cardsView, salesView, searchView },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 5px;
    height: 100%;
    width: 100%;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
