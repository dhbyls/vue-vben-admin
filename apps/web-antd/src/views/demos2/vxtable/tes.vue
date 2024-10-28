<script lang="ts" setup>
import type { List } from '#/type';

import { computed, onMounted, ref } from 'vue';

import { usePreferences } from '@vben/preferences';

import { LicenseManager } from 'ag-grid-charts-enterprise';
import { AgGridVue } from 'ag-grid-vue3';

import { getPandianDataApi } from '#/api';

// @ts-ignore
import locale from '../../../../public/locale.json';

import 'ag-grid-charts-enterprise/styles/ag-grid.min.css';
import 'ag-grid-charts-enterprise/styles/ag-theme-quartz.min.css';

// @ts-ignore
LicenseManager.setLicenseKey(
  '[v3][Release][0102]_MTcyODA1NzY1NzgzNA==0539f79f0539aaea0368f38257ce134a',
);

// 主题
const { isDark } = usePreferences();
/** AgGrid 深色主题/浅色主题 */
const agGridTheme = computed(() =>
  isDark.value ? 'ag-theme-quartz-dark' : 'ag-theme-quartz',
);

const columnDefs = ref([
  {
    headerName: '品牌',
    field: 'brand',
    flex: 2,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    cellEditor: 'agRichSelectCellEditor',
    cellEditorParams: {
      values: ['Tesla', 'Ford', 'Toyota', '112'],
      searchType: 'match',
      allowTyping: true,
      filterList: true,
      highlightMatch: true,
      valueListMaxHeight: 220,
    },
  },
  {
    headerName: '型号',
    field: 'model',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
  },
  {
    headerName: '价格',
    field: 'price',
    flex: 1,
    filter: 'agNumberColumnFilter',
    floatingFilter: true,
  },
  {
    headerName: '统计日期',
    field: 'date',
    flex: 1,
    filter: true,
    floatingFilter: true,
  },
  {
    headerName: '电车',
    field: 'electric',
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

const gridOptions = {
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
      excelMode: 'windows',
    },
  },
};

onMounted(() => {
  const rowData1 = getPandianDataApi();
  rowData1.then((res) => {
    rowData.value = res;
  });
});

// setTimeout(() => {
//   rowData.value = newData
// }, 2000);
</script>

<template auto-content-height>
  <div class="h-full">
    <div class="bg-card text-foreground p-5 text-sm leading-6">
      世界上最好的 JavaScript 表格网格，开发人员构建企业应用程序的专业选择！
    </div>
    <div
      class="flex flex-col p-5 lg:flex-row"
      style="height: calc(100% - 64px)"
    >
      <div class="card-box w-full p-5">
        <AgGridVue
          :cell-selection="cellSelection"
          :class="agGridTheme"
          :column-defs="columnDefs"
          :grid-options="gridOptions"
          :row-data="rowData"
          style="width: 100%; height: 100%"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.ag-theme-quartz-dark {
  --ag-foreground-color: '#FFF';
  --ag-background-color: '#1C1E23';
  --ag-browser-color-scheme: 'dark';
  --ag-header-background-color: #2f3033;
  --ag-chrome-background-color: '#2C2D32';
  --ag-oddrow-background-color: '#1F2836';
}
</style>
