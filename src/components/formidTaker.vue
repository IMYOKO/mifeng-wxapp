<style lang="less" scoped>
form .catchForm,
form .catchBtn {
  border: none;
  text-align: inherit;
  padding: 0;
  margin: 0;
  line-height: inherit;
  background-color: transparent;
  color: inherit;
  border-radius: 0;
  font-size: inherit;
}

form .catchForm,
form .catchBtn::after {
  border: none;
}
</style>

<template>
  <form class="catchForm" report-submit bindsubmit="catchSubmit">
    <button form-type="submit" class="catchBtn">
      <slot></slot>
    </button>
  </form>
</template>

<script>
import tip from '../utils/tip';
import request from '../utils/request';

export default {
  methods: {
    async catchSubmit(e) {
      let formId = e.detail.formId;
      // console.log('获取formId=' + formId);
      if (formId == 'the formId is a mock one') {
        return;
      }
      let res = await request({
        url: 'wxForm/store',
        method: 'post',
        data: {
          form_id: formId
        }
      });
    }
  },
  onLoad() {}
}
</script>
