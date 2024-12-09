<script lang="ts" setup>
import type { List } from '#/type';

import { computed, onMounted, reactive, ref, shallowRef } from 'vue';

import { FrameReloadRounded } from '@vben/icons';
import { usePreferences } from '@vben/preferences';

import { LicenseManager } from 'ag-grid-charts-enterprise';
import { AgGridVue } from 'ag-grid-vue3';
import {
  Button,
  Checkbox,
  Drawer,
  Image,
  ImagePreviewGroup,
  InputNumber,
  message,
  Modal,
  Select,
  Textarea,
  Tooltip,
} from 'ant-design-vue';

import {
  bindCzCode,
  caifenPdDataApi,
  getCzDataApi,
  getImgTextApi,
  getPandianDataApi,
  getTenantListDataApi,
  unBindCzCode,
  uptCzDataApi,
  uptPandianDataApi,
  xjBindCzCode,
} from '#/api';

import locale from '../../../../public/locale.json';

import 'ag-grid-charts-enterprise/styles/ag-grid.min.css';
import 'ag-grid-charts-enterprise/styles/ag-theme-balham.min.css';

const AgGridLicenseKey =
  '[v3][Release][0102]_MTczMTQzMDQwMzMxOQ==f8bf7989fb5027b1f0432024e4e93db4';
LicenseManager.setLicenseKey(AgGridLicenseKey);

// 主题
const { isDark } = usePreferences();
/** AgGrid 深色主题/浅色主题 */
const agGridTheme = computed(() =>
  isDark.value ? 'ag-theme-balham-dark' : 'ag-theme-balham',
);

// 租户id
const tenant_id = ref<string>('');

const czEditable = ref(false); // 单元格编辑模式
const editable = ref(false); // 单元格编辑模式
const dzable = ref(false); // 对账模式
const unbindable = ref(false); // 解绑功能
const chaifen_num = ref(0); // 拆分数量
const openChaifenModel = ref<boolean>(false); // 拆分Model
const confirmLoading = ref<boolean>(false); // 拆分Model确认按钮加载状态

const dzableChange = (_e: any) => {
  // console.log(e.target.checked);
};

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

// 原始清单
const czColumnDefs = ref([
  {
    headerName: '序号',
    valueGetter: `node.rowIndex + 1`,
    // filter: 'agMultiColumnFilter',
    // floatingFilter: true,
    cellDataType: 'number',
    editable: false,
  },
  {
    headerName: '财政编码',
    field: 'assets_code',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
    cellClass: 'text-format',
  },
  {
    headerName: '名称',
    field: 'name',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '反写关联',
    field: 'fxxj',
    flex: 1,
    filter: true,
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '绑定数量',
    field: 'bind_sum',
    flex: 1,
    cellDataType: 'number',
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '数量/面积',
    field: 'num',
    flex: 1,
    cellDataType: 'number',
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '账面数据',
    field: 'iscz',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '品牌',
    field: 'brand',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '规格型号',
    field: 'model',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '使用部门',
    field: 'sybm',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '使用人',
    field: 'syuser',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '存放地点',
    field: 'addr',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '原始备注',
    field: 'remark',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '自定义备注',
    field: 'custom_remark',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: czEditable,
  },
  {
    headerName: '取得日期',
    field: 'date_of_acquisition',
    flex: 1,
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '记账日期',
    field: 'jzrq',
    flex: 1,
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '资产原值',
    field: 'old_price',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '均价/单价(元)',
    field: 'danjia',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '管理部门',
    field: 'glbm',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '管理人',
    field: 'gluser',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '资产分类',
    field: 'fenlei',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '资产门类',
    field: 'menlei',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '累计折旧/摊销(元)',
    field: 'use_price',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '财务入账状态',
    field: 'cwrzzt',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '记账凭证号',
    field: 'jzpzh',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '取得方式',
    field: 'acquisition_method',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '业务状态',
    field: 'yw_stat',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '卡片类型',
    field: 'kp_class',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '单位会计科目',
    field: 'union_kjkm',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '折旧/摊销年限(月)',
    field: 'zjmonth',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '已提折旧/摊销月数',
    field: 'ytzjmonth',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '清查编号',
    field: 'qcbh',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '坐落位置',
    field: 'zlwz',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '项目代码',
    field: 'xmdm',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '采购组织形式',
    field: 'cgzzxs',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '配置标准分类',
    field: 'pzbzfl',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '资产状态',
    field: 'stat',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '资产用途',
    field: 'zcyt',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '价值类型',
    field: 'jzlx',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '财政拨款(元)',
    field: 'czbk',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '非财政拨款(元)',
    field: 'fczbk',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '折旧/摊销状态',
    field: 'zjtxzt',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '月折旧/摊销额(元)',
    field: 'yzjtxe',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '净值(元)',
    field: 'jingzhi',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '使用责任主体',
    field: 'zrzt',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '是否共享共用',
    field: 'gongxiang',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '生产厂家',
    field: 'sccj',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '产品序列号',
    field: 'cpxlh',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '供应商',
    field: 'gys',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '采购合同编号',
    field: 'cghtbh',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '发票号',
    field: 'fph',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '财务负责人',
    field: 'cwfzr',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '资产编制情况',
    field: 'zcbzqk',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '车辆类型',
    field: 'cllx',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '车辆所有人',
    field: 'clsyr',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '发动机号',
    field: 'fdjh',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '车辆识别代码',
    field: 'clsbdm',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '车辆产地',
    field: 'clcd',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '保修截止日期',
    field: 'bxjzrq',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '注册日期',
    field: 'clzcrq',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '权属性质',
    field: 'qsxz',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '产权形式',
    field: 'cqxz',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '权属面积',
    field: 'qsmj',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
  {
    headerName: '使用权类型',
    field: 'syqlx',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
  },
]);

const columnDefs = ref([
  {
    headerName: '序号',
    valueGetter: `node.rowIndex + 1`,
    // filter: 'agMultiColumnFilter',
    // floatingFilter: true,
    cellDataType: 'number',
    // editable: false,
  },
  {
    headerName: '盘点编码',
    field: 'assets_code',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable,
    cellClass: 'text-format',
  },
  {
    headerName: '绑定编码',
    field: 'bind_code',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable: false,
    cellClass: 'text-format',
  },
  {
    headerName: '名称',
    field: 'name',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable,
  },
  {
    headerName: '规格型号',
    field: 'model',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable,
  },
  {
    headerName: '品牌',
    field: 'brand',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable,
  },
  {
    headerName: '数量',
    field: 'num',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable,
    cellDataType: 'number',
    // cellStyle: { backgroundColor: "#aaffaa" }
  },
  {
    headerName: '使用部门',
    field: 'user_dept',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable,
  },
  {
    headerName: '使用人',
    field: 'user_name',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable,
  },
  {
    headerName: '使用状态',
    field: 'stat',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable,
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
    cellEditor: 'agDateStringCellEditor',
    floatingFilter: true,
    editable,
    cellDataType: 'dateString',
  },
  {
    headerName: '存放地点',
    field: 'addr',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable,
  },
  {
    headerName: '备注',
    field: 'remark',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable,
  },
  {
    headerName: '创建人',
    field: 'pd_user',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable,
  },
  {
    headerName: '创建时间',
    field: 'create_time',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    sort: 'desc',
    editable,
  },
  {
    headerName: '更新人',
    field: 'update_user',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable,
  },
  {
    headerName: '最后更新时间',
    field: 'update_time',
    flex: 1,
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    editable,
  },
  {
    headerName: '打印标签',
    field: 'isprint',
    flex: 1,
    filter: true,
    floatingFilter: true,
    editable,
  },
  {
    headerName: '反写关联',
    field: 'fxxj',
    flex: 1,
    filter: true,
    floatingFilter: true,
    editable,
  },
  // { field: "button", cellRenderer: CustomButtonComponent },
]);

const rowData = ref<List[]>([]); // 盘点数据
const czRowData = reactive({ data: [] }); // 财政数据

const cellSelection = {
  handle: {
    mode: 'fill',
  },
};

// 财政全局搜索
const getCzRowId = ref();
const czGridApi = shallowRef(); // 全局搜索
const cz_search_val = ref('');
const onCzFilterTextBoxChanged = () => {
  czGridApi.value.setGridOption('quickFilterText', cz_search_val.value);
};
const oncZGridReady = (params: { api: any }) => {
  czGridApi.value = params.api;
  getCzRowId.value = (params: any) => {
    return params.data.id;
  };
};

// 盘点全局搜索
const getRowId = ref();
const gridApi = shallowRef(); // 全局搜索
// 全局搜索
const search_val = ref('');
const onFilterTextBoxChanged = () => {
  gridApi.value.setGridOption('quickFilterText', search_val.value);
};
const onGridReady = (params: { api: any }) => {
  // 全局搜索
  gridApi.value = params.api;
  getRowId.value = (params: any) => {
    return params.data.id;
  };
};

// const getPdSelectedRows = () => {
//   console.log(gridApi.value.getSelectedNodes);

//   return gridApi.value.getSelectedRows();
// };

function onCzCellValueChanged(params: any) {
  const updatedData = params.data;
  const req_params = {
    id: updatedData.id,
    field: params.colDef.field,
    oldvalue: params.oldValue,
    newValue: params.newValue,
    tenant_id: tenant_id.value,
  };
  uptCzDataApi(req_params).then((res) => {
    if (res.code === 0) {
      message.success({
        content: res.msg,
      });

      // // 当单元格值发生变化时，重绘该行
      // const changedCell = params.colDef.field;
      // czGridApi.value.redrawRows({
      //   rowNodes: [params.node], // 刷新行节点
      //   columns: [changedCell], // 刷新发生变化的列
      // });
      // // 当单元格值发生变化时，刷新单元格，这里的目的是改变该行的背景色及前景色，重新执行getRowStyle
      // czGridApi.value.refreshCells({
      //   force: true,
      //   suppressFlash: true,
      //   rowNodes: [params.node], // 刷新行节点
      //   columns: [changedCell], // 刷新发生变化的列
      // });
      // // czGridApi.value.stopEditing();
      // // czGridApi.value.getUndoRedoService().clear(); // 清空当前的撤销堆栈，防止onFilterChanged()重置后，导致撤销功能失效
      czGridApi.value.onFilterChanged();
    } else {
      message.error({
        content: res.msg,
      });
    }
  });

  // // 当单元格值变化时，重新应用过滤器
  // czGridApi.value.onFilterChanged();
}

const czGridOptions = {
  excelStyles: [
    {
      id: 'text-format',
      dataType: 'string',
    },
  ],
  // 单元格单击事件
  onCellClicked: (_params: { api: any; data: any }) => {
    // 清空图片的文字
    // img_text.value = '';
  },
  // 单元格双击事件
  onCellDoubleClicked: async (params: any) => {
    if (czEditable.value) {
      return false;
    }

    const pd = gridApi.value.getSelectedRows(); // 获取选中的盘点数据
    if (pd.length === 0) {
      message.error({
        content: '绑定请勾选上方表格的数据',
      });
      return false;
    }
    const clearSelectedRows = () => {
      gridApi.value.deselectAll(); // 清除所有选中的行
    };
    await bindCzCode({
      tenant_id: tenant_id.value,
      pd,
      cz: params.data,
    }).then((res: any) => {
      if (res.code === 0) {
        /** 更新盘点数据状态 */
        pd.forEach((update: any) => {
          const rowNode = gridApi.value.getRowNode(update.id);
          // rowNode.setDataValue('bind_code', params.data.assets_code);
          rowNode.setData({
            ...rowNode.data,
            bind_code: params.data.assets_code,
            bind_cz_assets_id: params.data.id,
          });
        });
        // // 当单元格值发生变化时，重绘该行
        // gridApi.value.redrawRows({
        //   rowNodes: [gridApi.value.getSelectedNodes], // 刷新行节点
        //   columns: ['bind_code'], // 刷新发生变化的列
        // });
        // // 当单元格值发生变化时，刷新单元格，这里的目的是改变该行的背景色及前景色，重新执行getRowStyle
        // gridApi.value.refreshCells({
        //   force: true,
        //   suppressFlash: true,
        //   rowNodes: [gridApi.value.getSelectedNodes], // 刷新行节点
        //   columns: ['bind_code'], // 刷新发生变化的列
        // });

        /** 更新财政数据状态 */
        const czrowNode = czGridApi.value.getRowNode(params.data.id);
        czrowNode.setDataValue('bind_sum', res.data.bind_sum);
        // // 当单元格值发生变化时，重绘该行
        // const changedCell = params.colDef.field;
        // czGridApi.value.redrawRows({
        //   rowNodes: [params.node], // 刷新行节点
        //   columns: [changedCell], // 刷新发生变化的列
        // });
        // // 当单元格值发生变化时，刷新单元格，这里的目的是改变该行的背景色及前景色，重新执行getRowStyle
        // czGridApi.value.refreshCells({
        //   force: true,
        //   suppressFlash: true,
        //   rowNodes: [params.node], // 刷新行节点
        //   columns: [changedCell], // 刷新发生变化的列
        // });
        clearSelectedRows();
        gridApi.value.onFilterChanged();
        message.success({
          content: res.msg,
        });
        return false;
      }
      message.error({
        content: res.msg,
      });
    });

    // czGridApi.value.setGridOption('quickFilterText', cz_search_val.value);
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

const gridOptions = {
  excelStyles: [
    {
      id: 'text-format',
      dataType: 'string',
    },
  ],
  // 单元格单击事件
  onCellClicked: (params: any) => {
    // 获取图片
    imgs.data = [];
    imgs.data = params.data?.imgs.split(',');

    // 清空图片的文字
    // img_text.value = '';
  },
  // 单元格双击事件
  onCellDoubleClicked: (params: any) => {
    const pd = params.data;
    if (editable.value) {
      return false;
    }
    if (!pd.bind_code) {
      return false;
    }

    // 对账模式下，才执行
    if (!dzable.value) {
      // cz_search_val.value = params.value;
      // czGridApi.value.setGridOption('quickFilterText', params.value);
      message.warn({
        content: '“开启对账模式”，双击可解绑',
      });
      return false;
    }

    if (!unbindable.value) {
      message.warn({
        content: '双击解绑，请“开启解绑功能”',
      });
      return false;
    }

    unBindCzCode({ pd, tenant_id: tenant_id.value }).then((res) => {
      if (res.code === 0) {
        /** 更新盘点数据状态 */
        const rowNode = gridApi.value.getRowNode(pd.id);
        rowNode.setDataValue('bind_code', '');

        /** 更新财政数据状态 */
        const czrowNode = czGridApi.value.getRowNode(pd.bind_cz_assets_id);
        czrowNode.setDataValue('bind_sum', res.data.bind_sum);

        // 当单元格值发生变化时，重绘该行
        czGridApi.value.redrawRows({
          rowNodes: [czrowNode], // 刷新行节点
          columns: ['bind_sum'], // 刷新发生变化的列
        });
        // 当单元格值发生变化时，刷新单元格，这里的目的是改变该行的背景色及前景色，重新执行getRowStyle
        czGridApi.value.refreshCells({
          force: true,
          suppressFlash: true,
          rowNodes: [czrowNode], // 刷新行节点
          columns: ['bind_sum'], // 刷新发生变化的列
        });

        message.success({
          content: res.msg,
        });
        return false;
      }
      message.error({
        content: res.msg,
      });
    });
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

  singleClickEdit: false, // 配置单击进入编辑模式
  enterNavigatesVertically: true, // 按下回车键将向下移动到下面的单元格
  undoRedoCellEditing: true, // 启用撤销重做
  undoRedoCellEditingLimit: 50, // 设置撤销重做的步数限制

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

const tenantlist = reactive({
  data: [],
});

const reloadRowData = () => {
  const rowData1 = getPandianDataApi({ tenant_id: tenant_id.value });
  rowData1.then((res) => {
    rowData.value = res;
  });
};

const reloadCzRowData = () => {
  const rowData2 = getCzDataApi({ tenant_id: tenant_id.value });
  rowData2.then((res) => {
    czRowData.data = res;
    // gridApi.value.redrawRows();
  });
};

// 下拉选择加载表格数据
const handleChange = () => {
  const rowData1 = getPandianDataApi({ tenant_id: tenant_id.value });
  rowData1.then((res) => {
    rowData.value = res;
    // gridApi.value.redrawRows();
  });
};
onMounted(() => {
  const rowData1 = getTenantListDataApi();
  rowData1.then((res: any) => {
    tenantlist.data = res;
  });
});

// 单元格变动时
const onCellValueChanged = async (params: any) => {
  const updatedData = params.data;
  const req_params = {
    id: updatedData.id,
    field: params.colDef.field,
    oldvalue: params.oldValue,
    newValue: params.newValue,
    tenant_id: tenant_id.value,
  };
  uptPandianDataApi(req_params).then((res) => {
    if (res.code === 0) {
      message.success({
        content: res.msg,
      });

      // 当单元格值发生变化时，重绘该行
      const changedCell = params.colDef.field;
      gridApi.value.redrawRows({
        rowNodes: [params.node], // 刷新行节点
        columns: [changedCell], // 刷新发生变化的列
      });
      // 当单元格值发生变化时，刷新单元格，这里的目的是改变该行的背景色及前景色，重新执行getRowStyle
      gridApi.value.refreshCells({
        force: true,
        suppressFlash: true,
        rowNodes: [params.node], // 刷新行节点
        columns: [changedCell], // 刷新发生变化的列
      });
      // gridApi.value.stopEditing();
      // gridApi.value.getUndoRedoService().clear(); // 清空当前的撤销堆栈，防止onFilterChanged()重置后，导致撤销功能失效
      gridApi.value.onFilterChanged();
    } else {
      message.error({
        content: res.msg,
      });
    }
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

// const rowStyle = { background: 'black' };
const getRowStyle = (params: any) => {
  if (params.data?.bind_code) {
    return { background: '#ffeae8' };
  }
};

const getcZRowStyle = (params: any) => {
  if (params.data?.bind_sum) {
    return { background: '#ffeae8' };
  }
};

const caifen = () => {
  const pd = gridApi.value.getSelectedRows(); // 获取选中的盘点数据

  if (pd.length === 0) {
    message.warn({
      content: '请选择要拆分的行',
    });
    return false;
  }
  if (pd[0].num === 1) {
    message.warn({
      content: '数量为1，不能再拆分',
    });
    return false;
  }
  if (pd.length > 1) {
    message.warn({
      content: '每次仅限拆分一行数据',
    });
    return false;
  }
  chaifen_num.value = pd[0].num;
  openChaifenModel.value = true;
};

const cfsl_loading = ref<boolean>(false);
const handleChaifen = () => {
  if (chaifen_num.value <= 1) {
    message.warn({
      content: '拆分的数量必须大于1',
    });
    return false;
  }
  const pd = gridApi.value.getSelectedRows(); // 获取选中的盘点数据

  confirmLoading.value = true;
  cfsl_loading.value = true;
  caifenPdDataApi({
    tenant_id: tenant_id.value,
    id: pd[0].id,
    chaifen_num: chaifen_num.value,
  }).then((res) => {
    cfsl_loading.value = false;
    confirmLoading.value = false;
    if (res.code !== 0) {
      message.error({
        content: res.msg,
      });
      return false;
    }
    message.success({
      content: res.msg,
    });
    res.data.forEach((newRow: any) => {
      gridApi.value.applyTransaction({ add: [newRow] });
    });

    const rowNode = gridApi.value.getRowNode(pd[0].id);
    rowNode.setDataValue('num', pd[0].num - chaifen_num.value + 1);

    openChaifenModel.value = false;
  });
};

const fxxj_loading = ref<boolean>(false);
// 反建盘点并自动关联
const handlePdgl = () => {
  const czseleted = czGridApi.value.getSelectedRows(); // 获取选中的账面数据
  if (czseleted.length === 0) {
    message.warn({
      content: '请勾选需处理的账面数据',
    });
    czGridApi.value.deselectAll(); // 清除所有选中的行
    return false;
  }
  if (czseleted.length > 1) {
    message.warn({
      content: '每次只能勾选处理一条数据',
    });
    czGridApi.value.deselectAll(); // 清除所有选中的行
    return false;
  }

  if (czseleted[0].iscz === '否') {
    message.warn({
      content: '您勾选的不是账面数据',
    });
    czGridApi.value.deselectAll(); // 清除所有选中的行
    return false;
  }

  fxxj_loading.value = true;
  xjBindCzCode({
    tenant_id: tenant_id.value,
    czid: czseleted[0].id,
  }).then((res) => {
    fxxj_loading.value = false;
    if (res.code !== 0) {
      message.error({
        content: res.msg,
      });
      return false;
    }
    message.success({
      content: res.msg,
    });
    gridApi.value.applyTransaction({ add: [res.data.pd_row] });

    const czRowNode = czGridApi.value.getRowNode(czseleted[0].id);
    czRowNode.setData({
      ...czRowNode.data,
      bind_sum: res.data.bind_sum,
      fxxj: '是',
    });
    czGridApi.value.deselectAll(); // 清除所有选中的行
    czGridApi.value.onFilterChanged();
  });
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
        :options="tenantlist.data"
        placeholder="Select a person"
        show-search
        size="small"
        style="width: 200px"
        @blur="handleBlur"
        @change="handleChange"
        @focus="handleFocus"
      />
      <Tooltip placement="top">
        <template #title>
          <span> 刷新数据并载入 </span>
        </template>
        <FrameReloadRounded
          v-if="tenant_id"
          class="ml-2 inline-block size-6 cursor-pointer hover:text-orange-600"
          @click="reloadRowData"
        />
      </Tooltip>
      <div v-if="tenant_id" class="inline-block">
        <text class="ml-4 mr-1">盘点筛选 :</text>
        <input
          v-model="search_val"
          class="pl-2"
          placeholder="输入关键词全局搜索"
          style="color: red"
          type="text"
          @input="onFilterTextBoxChanged()"
        />
        <Checkbox v-model:checked="open" class="ml-4">开启图片预览</Checkbox>

        <Tooltip placement="top">
          <template v-if="dzable && unbindable" #title>
            <span> 开启后，将禁用解绑功能 </span>
          </template>
          <Checkbox v-model:checked="editable" class="ml-4">
            开启表格编辑
          </Checkbox>
        </Tooltip>
        <Button
          :loading="cfsl_loading"
          size="small"
          type="primary"
          @click="caifen"
        >
          拆分数量
        </Button>
        <Tooltip placement="top">
          <template #title>
            <span v-if="!dzable">
              启用后，勾选上方表格数据行，然后双击下方表格数据行，建立上下绑定关系
            </span>
            <span v-else>关闭后，大屏更适合编辑单元格</span>
          </template>
          <Checkbox
            v-model:checked="dzable"
            class="ml-4"
            @change="dzableChange"
          >
            <span style="color: red">启用对账模式</span>
          </Checkbox>
        </Tooltip>
        <Tooltip v-if="dzable" placement="top">
          <template #title>
            <p v-if="!editable">双击上方表格绑定的数据，以取消绑定</p>
            <p v-else>如须激活，请先 “关闭表格编辑”</p>
          </template>
          <Checkbox
            v-model:checked="unbindable"
            :disabled="editable"
            class="ml-4"
          >
            <span :class="editable ? 'text-gray-400' : 'text-red-600'">
              开启解绑功能
            </span>
          </Checkbox>
        </Tooltip>
      </div>
    </div>
    <div :class="dzable ? 'dz' : 'edit'" class="flex flex-col p-4 lg:flex-row">
      <div class="card-box w-full p-2">
        <AgGridVue
          :cell-selection="cellSelection"
          :class="agGridTheme"
          :column-defs="columnDefs"
          :column-hover-highlight="false"
          :get-row-id="getRowId"
          :get-row-style="getRowStyle"
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

    <!-- 以下下为财政数据 -->
    <div
      v-show="dzable"
      class="bg-card text-foreground p-2 text-sm leading-6 text-sky-500 dark:text-sky-400"
    >
      <Tooltip placement="top">
        <template #title>
          <span> 刷新数据并载入 </span>
        </template>
        <FrameReloadRounded
          class="ml-3 mr-1 inline-block size-6 cursor-pointer hover:text-orange-600"
          @click="reloadCzRowData"
        />
      </Tooltip>
      <text class="ml-2 mr-1">账面筛选 :</text>
      <input
        v-model="cz_search_val"
        class="pl-2"
        placeholder="输入关键词全局搜索"
        style="color: red"
        type="text"
        @input="onCzFilterTextBoxChanged()"
      />
      <Tooltip placement="top">
        <template #title>
          <span> 开启后，可修改“自定义备注” </span>
        </template>
        <Checkbox v-model:checked="czEditable" class="ml-4">
          开启表格编辑
        </Checkbox>
      </Tooltip>
      <Button
        :loading="fxxj_loading"
        class="ml-4"
        danger
        size="small"
        type="primary"
        @click="handlePdgl"
      >
        反建盘点并关联
      </Button>
    </div>
    <div
      v-show="dzable"
      :class="dzable ? 'dz' : 'edit'"
      class="flex flex-col p-4 lg:flex-row"
    >
      <div class="card-box w-full p-2">
        <AgGridVue
          :cell-selection="cellSelection"
          :class="agGridTheme"
          :column-defs="czColumnDefs"
          :column-hover-highlight="false"
          :get-row-id="getCzRowId"
          :get-row-style="getcZRowStyle"
          :grid-options="czGridOptions"
          :row-data="czRowData.data"
          :suppress-row-hover-highlight="false"
          cache-block-size="{50}"
          infinite-initial-row-count="{200}"
          max-blocks-in-cache="{10}"
          row-buffer="{0}"
          style="width: 100%; height: 100%"
          @cell-value-changed="onCzCellValueChanged"
          @grid-ready="oncZGridReady"
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

    <Modal
      v-model:open="openChaifenModel"
      :confirm-loading="confirmLoading"
      title="请输入要拆分的数量："
      @ok="handleChaifen"
    >
      <InputNumber
        v-model:value="chaifen_num"
        :max="10"
        :min="0"
        :step="1"
        string-mode
        style="width: 200px"
      />
    </Modal>
  </div>
</template>

<style scoped>
.dz {
  height: calc(50% - 50px);
}

.edit {
  height: calc(100% - 50px);
}

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

.row-red {
  background-color: #fdd;
}
</style>
