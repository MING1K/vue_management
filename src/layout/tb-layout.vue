<template>
  <div class="tb-layout backstage-layout">
    <div class="top padding-box flex-container">
      <div class="box-container">
        <slot name="top" />
      </div>
    </div>
    <div class="bottom padding-box flex-container">
      <div class="box-container gl-scrollbar">
        <slot />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.tb-layout {
  height: 98%;
  display: flex;
  flex-direction: column;
  .bottom {
    padding-top: 0px;
    padding-right: 10px;
    flex: 1;
    overflow: auto;
  }
  .padding-box {
    padding: 5px 10px;
  }
  .flex-container {
    padding: 10px;
    background: transparent;
    box-sizing: border-box;
    .box-container {
      height: 100%;
      padding: 15px;
      background: #fff;
      // background: transparent;
      box-sizing: border-box;
      border-radius: 5px;
      border: 1px solid #ebeef5;
      &:hover {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>
