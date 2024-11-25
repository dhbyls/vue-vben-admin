<script lang="ts" setup>
import type { List } from '#/type';

import { computed, onMounted, reactive, ref, shallowRef } from 'vue';

import { usePreferences } from '@vben/preferences';

import { LicenseManager } from 'ag-grid-charts-enterprise';
import { AgGridVue } from 'ag-grid-vue3';
import {
  Checkbox,
  Drawer,
  Image,
  ImagePreviewGroup,
  message,
  Select,
  Textarea,
} from 'ant-design-vue';

import { getImgTextApi, getPandianDataApi, uptPandianDataApi } from '#/api';

import locale from '../../../../public/locale.json';

import 'ag-grid-charts-enterprise/styles/ag-grid.min.css';
import 'ag-grid-charts-enterprise/styles/ag-theme-balham.min.css';

const AgGridLicenseKey =
  '[v3][Release][0102]_MTcyODA1NzY1NzgzNA==0539f79f0539aaea0368f38257ce134a';
LicenseManager.setLicenseKey(AgGridLicenseKey);

// 主题
const { isDark } = usePreferences();
/** AgGrid 深色主题/浅色主题 */
const agGridTheme = computed(() =>
  isDark.value ? 'ag-theme-balham-dark' : 'ag-theme-balham',
);

// 租户id
const tenant_id = ref<string>('');

// 图片
const open = ref<boolean>(false);
const imgs = reactive({ data: [] });
const img_text = ref('');
// 提取文字
const tiquwenzi = (val: String) => {
  img_text.value = '';
  getImgTextApi({ img: val }).then((res) => {
    if (res.code === 0) {
      const data = res.data;
      img_text.value = data ? data.join('\n') : '';
      // console.log(img_text.value)
    } else {
      message.error({
        content: res.message,
      });
    }
  });
};

const columnDefs = ref([
  {
    headerName: '序号',
    valueGetter: `node.rowIndex + 1`,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    cellDataType: 'number',
  },
  {
    headerName: '编码',
    field: 'assets_code',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
  },
  {
    headerName: '名称',
    field: 'name',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
  },
  {
    headerName: '规格型号',
    field: 'model',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
  },
  {
    headerName: '品牌',
    field: 'brand',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
  },
  {
    headerName: '数量',
    field: 'num',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    cellDataType: 'number',
    // cellStyle: { backgroundColor: "#aaffaa" }
  },
  {
    headerName: '使用部门',
    field: 'user_dept',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
  },
  {
    headerName: '使用人',
    field: 'user_name',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
  },
  {
    headerName: '使用状态',
    field: 'stat',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    cellEditor: 'agRichSelectCellEditor',
    cellEditorParams: {
      values: () => {
        return ['在用', '闲置', '待处置', '其他'];
      },
      searchType: 'matchAny',
      allowTyping: true,
      filterList: true,
      highlightMatch: true,
      valueListMaxHeight: 220,
    },
  },
  {
    headerName: '生产日期',
    field: 'production_date',
    flex: 1,
    // filter: 'agMultiColumnFilter',
    floatingFilter: true,
    cellDataType: 'dateString',
  },
  {
    headerName: '存放地点',
    field: 'addr',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
  },
  {
    headerName: '备注',
    field: 'remark',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
  },
  {
    headerName: '创建人',
    field: 'pd_user',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
  },
  {
    headerName: '创建时间',
    field: 'create_time',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
  },
  {
    headerName: '更新人',
    field: 'update_user',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
  },
  {
    headerName: '最后更新时间',
    field: 'update_time',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
  },
  {
    headerName: '打印标签',
    field: 'isprint',
    flex: 1,
    filter: true,
    floatingFilter: true,
  },
  // { field: "button", cellRenderer: CustomButtonComponent },
]);

const rowData = ref<List[]>([]);

const cellSelection = {
  handle: {
    mode: 'fill',
  },
};

const gridApi = shallowRef(); // 全局搜索
// 全局搜索
const search_val = ref('');
const onFilterTextBoxChanged = () => {
  gridApi.value.setGridOption('quickFilterText', search_val.value);
};
const onGridReady = (params: { api: any }) => {
  // 全局搜索
  gridApi.value = params.api;
};
const gridOptions = {
  // 单元格单击事件
  onCellClicked: (params: { api: any; data: any }) => {
    // 获取图片
    imgs.data = [];
    imgs.data = params.data?.imgs.split(',');

    // 清空图片的文字
    // img_text.value = '';
  },
  // 侧边工具栏
  sideBar: {
    toolPanels: [
      {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
      },
      {
        id: 'filters',
        labelDefault: 'Filters',
        labelKey: 'filters',
        iconKey: 'filter',
        toolPanel: 'agFiltersToolPanel',
      },
    ],
    defaultToolPanel: '',
    hiddenByDefault: false,
  },
  // theme: myTheme,
  localeText: locale,
  enableCharts: true, // 启用图表功能
  // cellSelection: true,  // 启用填充手柄,可能没得用
  //  copyHeadersToClipboard: true, // 复制标题到剪贴板
  // copySelectedRows: true, // 复制整行

  // enableRangeSelection:true,

  // 分页
  // pagination:true,
  // paginationPageSize:2,

  undoRedoCellEditing: true, // 启用撤销重做
  undoRedoCellEditingLimit: 20, // 设置撤销重做的步数限制

  rowSelection: {
    mode: 'multiRow',
    copySelectedRows: false,
  },
  animateRows: true, // 启用行动画

  defaultColDef: {
    sortable: true,
    resizable: true,
    editable: true,
    flex: 1,
    minWidth: 100,
    // allow every column to be aggregated
    enableValue: true,
    // allow every column to be grouped
    enableRowGroup: true,
    // allow every column to be pivoted
    enablePivot: true,
    filter: true,
    filterParams: {
      // can be 'windows' or 'mac'
      excelMode: 'mac',
    },
  },
};
onMounted(() => {
  // const rowData1 = getPandianDataApi();
  // rowData1.then((res) => {
  //   rowData.value = res;
  // });
});

const onCellValueChanged = async (event: {
  colDef: any;
  data: any;
  newValue: any;
  oldValue: any;
}) => {
  const updatedData = event.data;
  const req_params = {
    id: updatedData.id,
    field: event.colDef.field,
    oldvalue: event.oldValue,
    newValue: event.newValue,
    tenant_id: tenant_id.value,
  };
  uptPandianDataApi(req_params).then((res) => {
    if (res.code === 0) {
      message.success({
        content: res.msg,
      });
    } else {
      message.error({
        content: res.msg,
      });
    }
  });
};

const options = reactive({
  data: [
    {
      label: '重庆渝中区疾病预防控控中心',
      value: '87627E8EFF83A13D08A8AE873EB98DW2',
    },
  ],
});

// 下拉选择加载表格数据
const handleChange = () => {
  // console.log(tenant_id)
  // console.log(`selected ${value}`);
  const rowData1 = getPandianDataApi({ tenant_id: tenant_id.value });
  rowData1.then((res) => {
    rowData.value = res;
  });
};
const handleBlur = () => {
  // console.log('blur');
};
const handleFocus = () => {
  // console.log('focus');
};
const filterOption = (input: string, option: any) => {
  return option.value.toLowerCase().includes(input.toLowerCase());
};
</script>

<template auto-content-height>
  <div class="h-full">
    <div
      class="bg-card text-foreground p-2 text-sm leading-6 text-sky-500 dark:text-sky-400"
    >
      <text class="ml-4 mr-1">选择单位:</text>
      <Select
        v-model:value="tenant_id"
        :filter-option="filterOption"
        :options="options.data"
        placeholder="Select a person"
        show-search
        size="small"
        style="width: 200px"
        @blur="handleBlur"
        @change="handleChange"
        @focus="handleFocus"
      />
      <text class="ml-4 mr-1">筛选:</text>
      <input
        v-model="search_val"
        class="pl-2"
        placeholder="输入关键词全局搜索"
        style="color: red"
        type="text"
        @input="onFilterTextBoxChanged()"
      />
      <Checkbox v-model:checked="open" class="ml-4">开启图片预览</Checkbox>
    </div>
    <div
      class="flex flex-col p-4 lg:flex-row"
      style="height: calc(100% - 50px)"
    >
      <div class="card-box w-full p-2">
        <AgGridVue
          :cell-selection="cellSelection"
          :class="agGridTheme"
          :column-defs="columnDefs"
          :column-hover-highlight="false"
          :grid-options="gridOptions"
          :row-data="rowData"
          :suppress-row-hover-highlight="false"
          cache-block-size="{50}"
          infinite-initial-row-count="{200}"
          max-blocks-in-cache="{10}"
          row-buffer="{0}"
          style="width: 100%; height: 100%"
          @cell-value-changed="onCellValueChanged"
          @grid-ready="onGridReady"
        />
      </div>
    </div>

    <!-- 照片浏览 -->
    <Drawer
      v-model:open="open"
      :body-style="{ padding: '10px' }"
      :mask="false"
      :mask-closable="true"
      placement="left"
      title="盘点照片"
      width="200"
    >
      <ImagePreviewGroup>
        <view v-for="(val, ind) in imgs.data" :key="ind" class="relative mr-2">
          <view class="z-20">
            <Image :src="val" width="80px" />
          </view>
          <view
            class="absolute bottom-0 left-0 right-0 z-50 h-6 cursor-pointer bg-slate-400 text-center leading-6"
            @click="tiquwenzi(val)"
          >
            提取文字
          </view>
        </view>
        <view class="absolute bottom-0 left-0 right-0">
          <Textarea
            v-model:value="img_text"
            auto-size
            class="text-xs"
            placeholder="图片中的文字在这里显示"
          />
        </view>
      </ImagePreviewGroup>
    </Drawer>
  </div>
</template>

<style scoped>
.ag-theme-balham-dark {
  --ag-background-color: '#1C1E23';
  --ag-browser-color-scheme: 'dark';
  --ag-header-background-color: #2f3033;
  --ag-chrome-background-color: '#2C2D32';
  --ag-oddrow-background-color: '#1F2836';
  --ag-odd-row-background-color: '#0A1830';
}

.cell-green {
  background-color: #a6d785; /* 绿色背景 */
}

.cell-red {
  background-color: #f08080; /* 红色背景 */
}
</style>
