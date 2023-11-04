<template>
  <div class="form-box">
    <div class="box-header">
      <span class="header">{{ header }}</span>
      <slot name="header" />
    </div>
    <div class="box-body gl-scrollbar">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    header: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
@import "../../styles/variables.scss";
.form-box {
  // border: 1px solid lightgray;
  //   border-left: 0px;
  box-shadow: 0 0 5px 3px lightgrey;
  border-radius: 3px;
  padding: 10px;
  padding-bottom: 0px;
  margin: 15px 10px;
  display: flex;
  flex-direction: column;
  transition: 500ms;
  &:hover {
    box-shadow: 0 0 10px 5px lightgrey;
  }
  .box-header {
    position: relative;
    padding: 5px 0px;
    span {
      position: relative;
      margin-left: 7px;
      &::before {
        content: "";
        background: $primary;
        position: absolute;
        height: 100%;
        line-height: 1;
        width: 3px;
        border-radius: 3px;
        left: -7px;
        top: 0;
      }
    }
    .header-func {
      display: flex;
      position: absolute;
      top: 1px;
      left: 100px;
      > * + * {
        margin-left: 10px;
      }
      .el-button {
        padding: 7px 9px;
        font-size: 14px;
      }
    }
  }
  .box-body {
    padding: 10px;
    flex: 1;
    overflow: auto;
    > * {
      height: 100%;
    }
  }
}
</style>

