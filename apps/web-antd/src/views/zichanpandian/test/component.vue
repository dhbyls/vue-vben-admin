<script lang="ts" setup>
// <!-- <template #table="tableData">，也可以直接写一个tableData ，利用解构函数-->
//         <!-- {{ slotProps.tableData }} -->

// import MyCompoent from '../../Components/MyCompoent.vue';
// import { MdiKeyboardEsc } from '@vben/';

// import { reactive, ref } from 'vue';
// import { Button, Input, InputSearch, Drawer } from 'ant-design-vue';

// const open = ref<boolean>(false);
// const showDrawer = () => {
//   open.value = true;
// };

// // 监听子组件触发的事件
// const send = (param: any, param2: any) => {
//   console.log(param, param2);
// };gi

// // 使用Ref，使用自组件内部的方法或属性等
// const myCompoents = ref(); // 获取自组件的ref
// const handClick = () => {
//   // 操作组建
//   console.log(myCompoents.value);
//   myCompoents.value.title = 5555555;
//   myCompoents.value?.hello();
// };

// const tableList = ref([
//   { id: 1, name: 111 },
//   { id: 2, name: 222 },
//   { id: 3, name: 333 },
// ]);
</script>
<template>
  <view />
  <!-- <view>
    <div>ces</div>
    <MyCompoent />
    <MyCompoent
      title="鸟，我"
      @sendMsg="send"
      ref="myCompoents"
      :tableData="tableList"
    >
      <template #custom> 这是自定义插槽 </template>

      <template #table="slotProps">
        <view
          style="display: inline-block; border: 1px solid red"
          v-for="(item, ind) in slotProps.tableData"
          :key="ind"
        >
          <text class="pr-4">{{ item.id }}</text>
          <text>{{ item.name }}</text>
          <MdiKeyboardEsc class="size-5" />
        </view>
      </template>
    </MyCompoent>

    <hr />
    <Button ref="button" @click="handClick">操作子组件</Button>
    <Button @click="showDrawer">Open</Button>
    <Input placeholder="Basic usage" />
    <InputSearch placeholder="input search text" style="width: 200px" />
  </view>

  <Drawer
    v-model:open="open"
    class="custom-class"
    root-class-name="root-class-name"
    :root-style="{ color: 'blue' }"
    style="color: red"
    title="Basic Drawer"
    :mask="false"
    :maskClosable="false"
    :placement="'left'"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </Drawer> -->
</template>
<style lang="less" scoped></style>
