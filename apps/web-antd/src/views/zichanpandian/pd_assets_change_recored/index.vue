<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { onMounted } from 'vue';

import { Page } from '@vben/common-ui';

import dayjs from 'dayjs';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { GetAassetsChangeRecored, getTenantListDataApi } from '#/api';

interface RowType {
  category: string;
  color: string;
  id: string;
  price: string;
  productName: string;
  releaseDate: string;
}

// const options = reactive({ data: [] as any[] });

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  fieldMappingTime: [['date', ['start', 'end']]],
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
      fieldName: 'tenant_id',
      // 界面显示的label
      label: '选择单位',
    },
    {
      component: 'Input',
      fieldName: 'number',
      label: '资产编号',
    },
    {
      component: 'Input',
      defaultValue: '',
      fieldName: 'assets_name',
      label: '资产名称',
    },
    {
      component: 'RangePicker',
      defaultValue: [dayjs().subtract(7, 'days'), dayjs()],
      fieldName: 'upt_date',
      label: '更新日期',
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 是否在字段值改变时提交表单
  submitOnChange: true,
  // 按下回车时是否提交表单
  submitOnEnter: true,
};

onMounted(async () => {});

const gridOptions: VxeTableGridOptions<RowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { field: 'assets_number', title: '资产编号', width: 200 },
    { field: 'assets_name', title: '资产名称' },
    { field: 'upt_field', title: '更新字段' },
    { field: 'old_value', title: '旧值' },
    { field: 'new_value', title: '新值' },
    { field: 'upt_user', title: '更新人' },
    { field: 'upt_time', title: '更新时间' },
  ],
  exportConfig: {},
  size: 'mini',
  // resizableConfig: { isDblclickAutoWidthvxe: true },
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        // message.success(`Query params: ${JSON.stringify(formValues)}`);
        return await GetAassetsChangeRecored({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
      },
    },
  },
  toolbarConfig: {
    custom: true,
    export: true,
    refresh: true,
    resizable: true,
    search: true,
    zoom: true,
  },
};

const [Grid] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});
</script>

<template>
  <Page auto-content-height>
    <Grid />
  </Page>
</template>
