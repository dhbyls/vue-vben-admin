<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { onMounted, reactive, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { ChevronDown } from '@vben/icons';

import {
  Button,
  Dropdown,
  Image,
  Menu,
  MenuItem,
  message,
  Popconfirm,
  Switch,
} from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  delPrintTemplateApi,
  getExampleTableApi,
  getTenantListDataApi,
  savePrintTemplateApi,
} from '#/api';

import FormModalDemo from './form.vue';

interface RowType {
  id: string;
  tenant_name: string;
  imageUrl: string;
  thumb: string;
  add_time: string;
  add_user: string;
  jsonstr: string;
  tenant_id: string;
  uid: string;
  default: boolean;
  last_upt_user: string;
  last_upt_time: string;
}

const tenantlist = reactive({
  data: [],
});

onMounted(() => {
  const rowData1 = getTenantListDataApi();
  rowData1.then((res: any) => {
    tenantlist.data = res;
  });
});

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      // defaultValue: '1',
      fieldName: 'tenant_name',
      label: '单位',
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: false,
  // 是否在字段值改变时提交表单
  submitOnChange: false,
  // 按下回车时是否提交表单
  submitOnEnter: true,
};

const gridOptions: VxeTableGridOptions<RowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    {
      align: 'left',
      type: 'checkbox',
      width: 50,
    },
    // { editRender: { name: 'input' }, field: 'tenant_name', title: '单位' },
    { field: 'tenant_name', title: '单位' },
    {
      field: 'thumb',
      slots: { default: 'image-url' },
      title: '模板预览图',
      width: 100,
    },
    {
      field: 'default',
      slots: { default: 'open' },
      title: '默认打印',
      width: 100,
    },
    { field: 'add_time', title: '创建时间', formatter: 'formatDateTime' },
    { field: 'add_user', title: '创建人' },
    { field: 'last_upt_user', title: '最后更新人' },
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
        return await getExampleTableApi({
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
  // onOpenChange: () => {
  //   console.log('openFormModal33333');
  // },
});

const delRowEvent = (row: RowType) => {
  delPrintTemplateApi({ id: row.id }).then((res: any) => {
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

function openFormModal() {
  formModalApi.setData({
    // 表单值
    values: { field1: 'abc' },
  });
  formModalApi.open();
}

const addTemplate = (row: any) => {
  formModalApi.setData({
    // 表单值
    values: { tenant_id: row.tenant_id, id: row.id },
    // a: 3,
    xiala: tenantlist.data,
  });
  formModalApi.open();
};

const switch_loadding = ref(false);
const handleSave = (formData: any) => {
  switch_loadding.value = true;
  savePrintTemplateApi(formData).then((res: any) => {
    switch_loadding.value = false;
    if (res.code === 0) {
      message.success({
        content: res.msg,
      });
      gridApi.query();
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
      <template #image-url="{ row }">
        <template v-if="row.thumb">
          <Image :src="row.thumb" height="30" width="30" />
        </template>
      </template>
      <template #open="{ row }">
        <Switch
          v-model:checked="row.default"
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
        <Button type="link" @click="addTemplate(row)">编辑</Button>
        <!-- <Button type="link" @click="openFormModal()">设计模板</Button> -->
        <Dropdown>
          <a class="ant-dropdown-link" @click.prevent>
            更多
            <ChevronDown class="inline-block size-6 cursor-pointer" />
          </a>
          <template #overlay>
            <Menu>
              <MenuItem>
                <a href="javascript:;" @click="openFormModal()">拷贝模板</a>
              </MenuItem>
              <MenuItem>
                <a href="javascript:;" @click="openFormModal()">设计模板</a>
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </template>
      <template #toolbar-tools>
        <Button
          class="mr-2"
          type="primary"
          @click="addTemplate({ tenant_id: '', id: '' })"
        >
          新增打印模板
        </Button>
      </template>
    </Grid>
    <FormModal @submit="handleSave" />
  </Page>
</template>
