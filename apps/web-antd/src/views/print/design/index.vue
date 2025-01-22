<script setup>
import { onMounted, reactive, ref } from 'vue';
import { defaultElementTypeProvider, hiprint } from 'vue-plugin-hiprint';
import { useRoute, useRouter } from 'vue-router';

import { ChevronDown } from '@vben/icons';

import {
  Button,
  Dropdown,
  InputNumber,
  Menu,
  MenuItem,
  message,
} from 'ant-design-vue';

import {
  getPrintProviderApi,
  getPrintTemplateApi,
  savePrintTemplateApi,
} from '#/api';

import TestProvider from './custom-provider';
// 自定义的 provider

const template_id = ref('');
const print_template = ref('');
const route = useRoute();
const router = useRouter();
const paperSize = ref({ width: 0, height: 0 });
const tenant_name = ref('');

const customProvider = reactive({ data: [] });

/**
 * 构建左侧可拖拽元素
 * 注意: 可拖拽元素必须在 hiprint.init() 之后调用
 * 而且 必须包含 class="ep-draggable-item" 否则无法拖拽进设计器
 */
const buildLeftElement = () => {
  hiprint.PrintElementTypeManager.buildByHtml($('.ep-draggable-item'));
};
/**
 * 构建设计器
 * 注意: 必须要在 onMounted 中去构建
 * 因为都是把元素挂载到对应容器中, 必须要先找到该容器
 */

// const TEMPLATE_KEY = getCurrentInstance().type.name; // 存储模板对象的 key

// const {
//   paperTypes,
//   curPaperType,
//   paperPopVisible,
//   paperWidth,
//   paperHeight,
//   showPaperPop,
//   setPaper,
//   setPaperOther,
// } = usePaper(TEMPLATE_KEY);
// const { scaleValue, changeScale } = useZoom(TEMPLATE_KEY);

let hiprintTemplate;
const buildDesigner = () => {
  const json = JSON.parse(print_template.value);
  // console.log('json', json.panels[0].width, json.panels[0].height);
  paperSize.value = {
    width: json.panels[0].width,
    height: json.panels[0].height,
  };
  const templateRef = reactive(json);
  $('#hiprint-printTemplate').empty(); // 先清空, 避免重复构建
  hiprintTemplate = new hiprint.PrintTemplate({
    template: templateRef,
    settingContainer: '#PrintElementOptionSetting', // 元素参数容器
  });
  // 构建 并填充到 容器中
  // 可以先 console.log($("#hiprint-printTemplate")) 看看是否有该 dom
  hiprintTemplate.design('#hiprint-printTemplate');
};

// const buildProvider = (data, clear) => {
//   // 组装 provider
//   if (Array.isArray(data)) {
//     // 如果返回的是数组
//     const providerList = helper.createProviderList(data);
//     hiprint.init({ providers: providerList });
//   } else {
//     const provider = helper.createProvider(data.key, data.options);
//     hiprint.init({ providers: [provider] });
//   }
//   if (clear) {
//     $('#provider-container').empty(); // 先清空, 避免重复构建
//   }
//   if (Array.isArray(data)) {
//     // 数组就循环去构建
//     data.forEach((item) =>
//       hiprint.PrintElementTypeManager.build($('#provider-container'), item.key),
//     );
//   } else {
//     hiprint.PrintElementTypeManager.build($('#provider-container'), data.key);
//   }
// };

// 加载provider
// const getProvider1 = async (clear = true) => {
//   message.loading({
//     content: '正在加载模板...',
//     key: 'loadTemplate',
//     duration: 0,
//   });
//   await getPrintProviderApi2({ template_id: template_id.value }).then((res) => {
//     message.destroy('loadTemplate');
//     if (res.code === 0) {
//       buildProvider(res.data, clear);
//     }
//   });
// };

const gettemplate = async () => {
  message.loading({
    content: '正在加载模板...',
    key: 'loadTemplate',
    duration: 0,
  });

  // 加载provider;
  await getPrintProviderApi({ template_id: template_id.value }).then((res) => {
    message.destroy('loadTemplate');
    if (res.code === 0) {
      customProvider.data = res.data;
      // 初始化 provider
      hiprint.init({
        providers: [
          defaultElementTypeProvider(),
          new TestProvider(customProvider.data),
        ],
      });
    }
  });

  // // 获取provider; // 这个需要写自定义样式
  // hiprint.init({
  //   providers: [],
  // });
  // getProvider1();

  // 获取打印模板
  await getPrintTemplateApi({ template_id: template_id.value }).then((res) => {
    if (res.code === 0) {
      print_template.value = res.data;
      buildLeftElement();
      buildDesigner();
    }
  });
};

/**
 * 这里必须要在 onMounted 中去构建 左侧可拖拽元素 或者 设计器
 * 因为都是把元素挂载到对应容器中, 必须要先找到该容器
 */
onMounted(async () => {
  // console.log('onMounted');
  template_id.value = route.query.template_id;
  tenant_name.value = route.query.tenant_name;
  await gettemplate();
});

/**
 * 浏览器打印
 */
const print = () => {
  // 打印数据，key 对应 元素的 字段名
  const printData = [
    {
      number: '500103771761131224000054',
      name: '办公桌',
      user_dept: '财务部',
      user_name: '张三',
      addr: '14楼VOC检测实验室',
      mode: '1200*500*750',
      qr: '500103771761131224000054',
      print_time: '2023-01-01 00:00',
    },
  ];
  // 参数: 打印时设置 左偏移量，上偏移量
  const options = { leftOffset: -1, topOffset: -1 };
  // 扩展
  const ext = {
    callback: () => {
      // console.log('浏览器打印窗口已打开');
    },
    // styleHandler: () => {
    //   // 重写 文本 打印样式
    //   return '<style>.hiprint-printElement-text{color:red !important;}</style>';
    // },
  };
  // 调用浏览器打印
  hiprintTemplate.print(printData, options, ext);
};
/**
 * 直接打印: 借助客户端,静默打印(无弹窗直接打印)
 * 注意: 需要先连接客户端
 */
const print2 = () => {
  const printData = [
    {
      number: '500103771761131224000054',
      name: '办公桌',
      user_dept: '财务部',
      user_name: '张三',
      addr: '14楼VOC检测实验室',
      mode: '1200*500*750',
      qr: '500103771761131224000054',
      print_time: '2023-01-01 00:00',
    },
  ];
  if (hiprint.hiwebSocket.opened) {
    hiprintTemplate.print2(printData);
  } else {
    message.warn({
      content: `请先连接客户端(刷新网页), 然后再点击「直接打印」`,
    });
  }
};

// 保存模板
const save_loading = ref(false);
const saveTemplate = () => {
  save_loading.value = true;
  const json = hiprintTemplate.getJson();
  const jsonstr = JSON.stringify(json);
  savePrintTemplateApi({ jsonstr, id: template_id.value }).then((res) => {
    save_loading.value = false;
    if (res.code !== 0) {
      message.error({
        content: res.msg,
      });
      return false;
    }
    message.success({
      content: res.msg,
    });
    // setTimeout(() => {
    //   router.go(-1);
    // }, 2000);
  });
};

const scaleValue = ref(1);
const state = reactive({
  scaleMin: 0.5,
  scaleMax: 5,
});
// 缩放
const changeScale = (big) => {
  if (big) {
    scaleValue.value += 0.1;
    if (scaleValue.value > state.scaleMax) scaleValue.value = 5;
  } else {
    scaleValue.value -= 0.1;
    if (scaleValue.value < state.scaleMin) scaleValue.value = 0.5;
  }
  hiprintTemplate.zoom(scaleValue.value);
};

const paperTypes = reactive({
  '60*40': {
    width: 60,
    height: 40,
  },
  '70*30': {
    width: 70,
    height: 30,
  },
  A3: {
    width: 420,
    height: 296.6,
  },
  A4: {
    width: 210,
    height: 296.6,
  },
  A5: {
    width: 210,
    height: 147.6,
  },
  B3: {
    width: 500,
    height: 352.6,
  },
  B4: {
    width: 250,
    height: 352.6,
  },
  B5: {
    width: 250,
    height: 175.6,
  },
});

// 缩放纸张大小
const changePaperZoom = (bool) => {
  // hiprintTemplate.setPaper(210, 297);
  changeScale(bool);
};

const choosePagerSize = (index) => {
  const size = paperTypes[index];
  hiprintTemplate.setPaper(size.width, size.height);
  paperSize.value.width = size.width;
  paperSize.value.height = size.height;
};
const setkPaperSize = () => {
  hiprintTemplate.setPaper(paperSize.value.width, paperSize.value.height);
};

// 后退
const goback = () => {
  router.go(-1);
};
</script>

<template>
  <div class="flex flex-col">
    <div class="mb-2 mt-2 flex flex-row justify-center">
      <Button class="mr-5" size="small" type="dashed" @click.stop="goback">
        返回
      </Button>
      <div class="mr-5">
        <Dropdown>
          <a class="ant-dropdown-link" @click.prevent>
            <span>设计尺寸(mm):</span>
            <ChevronDown class="inline-block size-6 cursor-pointer" />
          </a>
          <template #overlay>
            <Menu>
              <MenuItem v-for="(row, index) in paperTypes" :key="index">
                <a href="javascript:;" @click="choosePagerSize(index)">{{
                  index
                }}</a>
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>
        <InputNumber
          v-model:value="paperSize.width"
          :max="1000"
          :min="1"
          size="small"
          @change="setkPaperSize"
        />
        X
        <InputNumber
          v-model:value="paperSize.height"
          :max="1000"
          :min="1"
          size="small"
          @change="setkPaperSize"
        />
      </div>
      <div>
        <Button class="mr-1" size="small" @click.stop="changePaperZoom(false)">
          -缩小
        </Button>
        <Button class="mr-5" size="small" @click.stop="changePaperZoom(true)">
          +放大
        </Button>
      </div>

      <Button
        :loading="save_loading"
        class="mr-5"
        size="small"
        type="primary"
        @click.stop="saveTemplate"
      >
        保存模板
      </Button>

      <Button class="mr-5" danger size="small" type="text" @click.stop="print">
        打印预览
      </Button>

      <Button class="mr-5" danger size="small" type="text" @click.stop="print2">
        直接打印测试(需要连接客户端)
      </Button>
    </div>
    <div class="flex flex-row" style="height: 87vh">
      <div class="left postion w-1/4">
        <view class="absolute left-5 top-12 bg-red-400 px-2 text-white">
          {{ tenant_name }}
        </view>
        <div
          id="provider-container"
          class="flex-row flex-wrap justify-center p-5"
        >
          <div class="title">基础元素</div>
          <div v-if="customProvider.data" class="items">
            <div
              v-for="(item, index) in customProvider.data"
              :key="index"
              :tid="item.tid"
              class="ep-draggable-item item"
            >
              <span>{{ item?.options.title }}</span>
            </div>
          </div>
          <div class="title mt-10">辅助元素</div>
          <div class="items">
            <div class="ep-draggable-item item" tid="defaultModule.hline">
              <span>横线</span>
            </div>
            <div class="ep-draggable-item item" tid="defaultModule.vline">
              <span>竖线</span>
            </div>
            <div class="ep-draggable-item item" tid="defaultModule.rect">
              <span>矩形</span>
            </div>
            <div class="ep-draggable-item item" tid="defaultModule.oval">
              <span>圆形</span>
            </div>
          </div>
        </div>
      </div>
      <div class="center w-1/2">
        <!-- 设计器的 容器 -->
        <div id="hiprint-printTemplate"></div>
      </div>
      <div class="right w-1/4">
        <!-- 元素参数的 容器 -->
        <div id="PrintElementOptionSetting"></div>
      </div>
    </div>
  </div>
</template>

<style>
/* 重写全局 hiprint 样式 */
.hiprint-headerLine,
.hiprint-footerLine {
  border-color: purple !important;
}

.hiprint-printElement.design .del-btn {
  visibility: hidden !important;
}

.hiprint-headerLine:hover,
.hiprint-footerLine:hover {
  border-top: 3px dashed purple !important;
}

.hiprint-headerLine:hover::before {
  position: relative;
  top: -14px;
  left: calc(50% - 18px);
  font-size: 12px;
  color: purple;
  content: '页眉线';
  background: #ffff;
}

.hiprint-footerLine:hover::before {
  position: relative;
  top: -14px;
  left: calc(50% - 18px);
  font-size: 12px;
  color: purple;
  content: '页脚线';
  background: #ffff;
}
</style>

<style scoped>
/* 区域 */
.left {
  padding: 10px 0;
  overflow: auto;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-shadow: 2px 2px 2px 0 rgb(128 0 128 / 20%);
}

.center {
  padding: 20px;
  margin: 0 10px;
  overflow: auto;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-shadow: 2px 2px 2px 0 rgb(128 0 128 / 20%);
}

.right {
  padding: 10px 0;
  overflow: auto;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-shadow: 2px 2px 2px 0 rgb(128 0 128 / 20%);
}

/* 左侧拖拽元素样式 */
.title {
  width: 100%;

  /* margin: 10px 0 0 24px; */
  font-size: 16px;
  font-weight: 500;
}

.items {
  display: flex;
  flex-wrap: wrap;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 38%;

  /* min-height: 60px; */
  padding: 4px 10px;
  margin: 10px 8px 4px;
  background: white;
  border-radius: 4px;
  box-shadow: 2px 2px 2px 2px rgb(171 171 171 / 20%);
}

.item .iconfont {
  font-size: 1.5rem;
}

.item span {
  font-size: 14px;
}
</style>
