<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';

defineOptions({
  name: 'FormModelDemo',
});

const emit = defineEmits(['submit']);

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
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
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [],
        placeholder: '请选择单位',
        showSearch: true,
        optionFilterProp: 'label',
        style: 'width: 300px',
      },
      fieldName: 'tenant_id',
      label: '单位',
      rules: 'required',
    },
  ],
  showDefaultActions: false,
});

function onSubmit(values: Record<string, any>) {
  // message.info(JSON.stringify(values)); // 只会执行一次
  emit('submit', values);
}

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    await formApi.validateAndSubmitForm();
    // modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { values, xiala } = modalApi.getData<Record<string, any>>();

      if (values) {
        formApi.setValues(values);
      }
      formApi.updateSchema([
        {
          componentProps: {
            options: xiala,
          },
          fieldName: 'tenant_id',
        },
        // {
        //   component: 'Select',
        //   componentProps: {
        //     options: xiala,
        //     value:tenant_id
        //     placeholder: '请输入',
        //   },
        //   fieldName: 'tenant_id',
        //   // label: '字段3',
        //   rules: 'required',
        // },
      ]);
    }
  },
  title: '新增打印模板',
  // closeOnClickModal: false,
  draggable: true,
});
</script>
<template>
  <Modal>
    <Form />
  </Modal>
</template>
