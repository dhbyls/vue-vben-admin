<script lang="ts" setup>
import { h, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { getTenantListDataApi, userlist } from '#/api';

defineOptions({
  name: 'FormModelDemo',
});

const emit = defineEmits(['submit']);

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: [
    {
      component: 'Input',
      componentProps: {
        // placeholder: '请输入',
        type: 'hidden',
      },
      fieldName: 'id',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'pdtask_name',
      label: '盘点任务名称',
      rules: 'required',
    },
    {
      component: 'ApiSelect',
      componentProps: {
        style: 'width: 100%',
        allowClear: true,
        filterOption: true,
        // 菜单接口转options格式
        afterFetch: (data: any[]) => {
          return data.map((item: any) => ({
            label: item.label,
            value: item.value,
          }));
        },
        // 菜单接口
        api: getTenantListDataApi,
        // autoSelect: 'first',
      },
      // 字段名
      fieldName: 'pd_tenant_id',
      // 界面显示的label
      label: '选择盘点单位',
      rules: 'required',
    },
    {
      component: 'ApiSelect',
      componentProps: {
        style: 'width: 100%',
        allowClear: true,
        filterOption: true,
        // 菜单接口转options格式
        afterFetch: (data: any[]) => {
          return data.map((item: any) => ({
            label: item.label,
            value: item.value,
          }));
        },
        // 菜单接口
        api: userlist,
        // autoSelect: 'first',
      },
      // 字段名
      fieldName: 'fzr_uid',
      // 界面显示的label
      label: '盘点负责人',
      rules: 'required',
    },
    {
      component: 'Divider',
      fieldName: '_divider',
      formItemClass: 'col-span-1',
      hideLabel: true,
      renderComponentContent: () => {
        return {
          default: () => h('div', '选填'),
        };
      },
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'remark',
      label: '备注',
    },
  ],
  showDefaultActions: false,
});

function onSubmit(values: Record<string, any>) {
  // message.info(JSON.stringify(values)); // 只会执行一次
  emit('submit', values);
}

const model_title = ref('');

const [Modal, modalApi] = useVbenModal({
  title: model_title,
  fullscreenButton: true,
  overlayBlur: 6,
  draggable: true,
  closeOnClickModal: false,
  closeOnPressEscape: false,
  class: 'modal-form',
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    await formApi.validateAndSubmitForm();
    // modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { values, title } = modalApi.getData<Record<string, any>>();
      model_title.value = title;
      if (values) {
        formApi.setValues(values);
      }
    }
  },
});
</script>
<template>
  <Modal>
    <Form />
  </Modal>
</template>
<style>
.modal-form {
  width: 40%;
  min-width: 500px;
  max-width: 1000px;
}
</style>
