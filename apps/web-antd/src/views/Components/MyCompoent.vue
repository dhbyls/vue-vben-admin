<script lang="ts" setup>
// // import { defineProps } from 'vue';
// // import { Button } from 'ant-design-vue';

// // 定义属性
// const propos = defineProps({
//   title: {
//     type: String,
//     default: 'abc',
//   },
//   tableData: {
//     type: Array,
//     default: [],
//   },
// });

// // 定义事件
// const emmit = defineEmits(['sendMsg']);
// const handClick = () => {
//   // 触发事件
//   emmit('sendMsg', '你好', '你好2');
// };

// // 暴露
// defineExpose({
//   title: propos.title,
//   hello: () => {
//     console.log(propos.title);
//   },
// });
</script>
<template>
  <view />
  <!-- <div>{{ title }}</div>
  <Button ref="myCompoents" type="primary" @click="handClick"
    >Primary Button</Button
  >
  <div>
    <slot name="custom">这是默默人的插槽</slot>
    <slot name="table" id="1111" :tableData="tableData"></slot>
  </div> -->
</template>
<style lang="less" scoped></style>
