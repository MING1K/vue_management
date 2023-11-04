<template>
  <div class="tb-layout backstage-layout">
    <div class="box-container">
      <slot />
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.tb-layout {
  height: 98%;
  display: flex;
  flex-direction: column;
  padding: 10px 10px;
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
</style>
