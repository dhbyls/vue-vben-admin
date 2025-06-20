<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { onMounted, reactive, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button, message, Popconfirm, Switch } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { delTask, getTaskList, getTenantListDataApi, SavePdTask } from '#/api';

import FormModalDemo from './form.vue';

interface RowType {
  id: string;
  pdtask_name: string;
  tenant_id: string;
  pd_tenant_id: string;
  tenant_name: string;
  is_open: boolean;
  add_uid: string;
  add_user: string;
  fzr_uid: string;
  fzr_name: string;
  add_time: string;
  add_date: string;
  start_date: string;
  end_date: string;
  isplatform: boolean;
  remark: string;
}
// const tenantlist = reactive({
//   data: [],
// });

const formOptions = reactive<VbenFormProps>({
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'ApiSelect',
      componentProps: {
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
      label: '选择单位',
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 是否在字段值改变时提交表单
  submitOnChange: true,
  // 按下回车时是否提交表单
  submitOnEnter: true,
});

onMounted(() => {
  // const rowData1 = getTenantListDataApi();
});

const gridOptions: VxeTableGridOptions<RowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { field: 'pdtask_name', title: '盘单名称' },
    { field: 'tenant_name', title: '盘点单位' },
    {
      field: 'is_open',
      slots: { default: 'is_open' },
      title: '默认打印',
      width: 100,
    },
    { field: 'fzr_name', title: '盘点负责人' },
    { field: 'start_date', title: '开始时间' },
    { field: 'end_date', title: '结束时间' },
    { field: 'add_user', title: '创建人' },
    { field: 'add_time', title: '创建时间', formatter: 'formatDateTime' },
    { field: 'remark', title: '备注' },
    // {
    //   field: 'last_upt_time',
    //   title: '最后更新时间',
    //   formatter: 'formatDateTime',
    // },
    { slots: { default: 'action' }, title: '操作', fixed: 'right', width: 200 },
  ],
  editConfig: {
    mode: 'row',
    trigger: 'click',
  },
  toolbarConfig: {
    custom: true,
    export: false,
    refresh: true,
    resizable: true,
    search: true,
    zoom: true,
  },
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        // message.success(`Query params: ${JSON.stringify(formValues)}`);
        return await getTaskList({
          page: page.currentPage,
          pageSize: page.pageSize,

          ...formValues,
        });
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: FormModalDemo,
});

const delRowEvent = (row: RowType) => {
  delTask({ id: row.id }).then((res: any) => {
    if (res.code === 0) {
      message.success({
        content: res.msg,
      });
      gridApi.query();
      return false;
    }
    message.warn({
      content: res.msg,
    });
  });
};
const editTemplate = (row: any) => {
  formModalApi.setData({
    // 表单值
    values: { ...row },
    // a: 3,
    title: '编辑打印模板',
  });
  formModalApi.open();
};

const addTemplate = () => {
  formModalApi.setData({
    title: '新增盘点任务单',
    values: {
      id: '',
      // field2: 333,
      // field1: 222,
      // tenant_id: '87627E8EFF83A13D08A8AE873EB98DW3',
    },
    // xiala: tenantlist.data,
  });
  formModalApi.open();
};

const switch_loadding = ref(false);
const handleSave = (formData: any) => {
  switch_loadding.value = true;
  // const { id, tenant_id, pdtask_name, fzr_uid } = formData;

  // return;
  // 保存
  SavePdTask(formData).then((res: any) => {
    switch_loadding.value = false;

    gridApi.query();
    if (res.code === 0) {
      message.success({
        content: res.msg,
      });
      formModalApi.close();
      return false;
    }
    message.warn({
      content: res.msg,
    });
  });
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #is_open="{ row }">
        <Switch
          v-model:checked="row.is_open"
          :loading="switch_loadding"
          @change="handleSave(row)"
        />
      </template>
      <template #action="{ row }">
        <Popconfirm
          cancel-text="取消"
          ok-text="确认"
          title="确认删除吗？删除后将无法回复！"
          @confirm="delRowEvent(row)"
        >
          <Button danger type="link">删除</Button>
        </Popconfirm>
        <Button type="link" @click="editTemplate(row)">编辑</Button>
      </template>
      <template #toolbar-tools>
        <Button class="mr-2" type="primary" @click="addTemplate">
          新增盘点任务单
        </Button>
      </template>
    </Grid>
    <FormModal @submit="handleSave" />
  </Page>
</template>
