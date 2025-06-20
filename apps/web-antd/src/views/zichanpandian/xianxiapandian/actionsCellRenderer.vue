<script setup>
import { defineProps } from 'vue';

import { Button, Popconfirm } from 'ant-design-vue';

import { BatchDel } from '#/api';

const { params } = defineProps(['params', 'content']);

const bind_code =
  params.node.data.bind_code !== '' && params.node.data.bind_code !== null;
const onRemoveClick = () => {
  const selectedRows = params.node.data;
  BatchDel({
    selectedRows: [selectedRows],
    tenant_id: params.context?.tenant_id,
  }).then((res) => {
    if (res.code === 0) {
      message.success({
        content: res.msg,
      });
      params.api.applyTransaction({ remove: selectedRows });
    } else {
      message.error({
        content: res.msg,
      });
    }
  });
  params.api.applyTransaction({ remove: [selectedRows] });
};
</script>

<template>
  <div v-if="!bind_code" class="buttonCell">
    <Popconfirm
      cancel-text="取消"
      ok-text="确认"
      title="确认删除吗？"
      @confirm="onRemoveClick"
    >
      <Button danger type="link">删除</Button>
    </Popconfirm>
  </div>
  <Button danger v-else disabled type="link">删除</Button>
</template>

<style></style>
