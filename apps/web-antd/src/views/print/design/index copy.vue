<script setup>
import { onMounted, reactive } from 'vue';
import { defaultElementTypeProvider, hiprint } from 'vue-plugin-hiprint';

import { message } from 'ant-design-vue';

import template from './template';

// 自定义的 provider
import CUstomProvider from './custom-provider';

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
const templateRef = reactive(template);
const buildDesigner = () => {
  $('#hiprint-printTemplate').empty(); // 先清空, 避免重复构建
  hiprintTemplate = new hiprint.PrintTemplate({
    template: templateRef,
    settingContainer: '#PrintElementOptionSetting', // 元素参数容器
  });
  // 构建 并填充到 容器中
  // 可以先 console.log($("#hiprint-printTemplate")) 看看是否有该 dom
  hiprintTemplate.design('#hiprint-printTemplate');
};

// 初始化 provider
hiprint.init({
  providers: [defaultElementTypeProvider(), new CUstomProvider()],
});
/**
 * 这里必须要在 onMounted 中去构建 左侧可拖拽元素 或者 设计器
 * 因为都是把元素挂载到对应容器中, 必须要先找到该容器
 */
onMounted(() => {
  buildLeftElement();
  buildDesigner();
});

/**
 * 浏览器打印
 */
const print = () => {
  // 打印数据，key 对应 元素的 字段名
  const printData = { name: 'CcSimple' };
  // 参数: 打印时设置 左偏移量，上偏移量
  const options = { leftOffset: -1, topOffset: -1 };
  // 扩展
  const ext = {
    callback: () => {
      // console.log('浏览器打印窗口已打开');
    },
    styleHandler: () => {
      // 重写 文本 打印样式
      return '<style>.hiprint-printElement-text{color:red !important;}</style>';
    },
  };
  // 调用浏览器打印
  hiprintTemplate.print(printData, options, ext);
};
/**
 * 直接打印: 借助客户端,静默打印(无弹窗直接打印)
 * 注意: 需要先连接客户端
 */
const print2 = () => {
  const printData = { name: 'CcSimple' };
  if (hiprint.hiwebSocket.opened) {
    hiprintTemplate.print2(printData);
  } else {
    message.warn({
      content: `请先连接客户端(刷新网页), 然后再点击「直接打印」`,
    });
  }
};
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-row justify-center" style="margin-bottom: 10px">
      <button class="secondary circle-10" @click.stop="print">
        <i class="iconfont sv-printer"></i>
        浏览器打印
      </button>
      <button class="warning circle-10 ml-10" @click.stop="print2">
        直接打印(需要连接客户端)
        <i class="iconfont sv-printer"></i>
      </button>
    </div>
    <div class="flex flex-row" style="height: 87vh">
      <div class="left w-1/4">
        <div class="flex-row flex-wrap justify-center">
          <div class="title">基础元素</div>
          <div class="ep-draggable-item item" tid="defaultModule.text">
            <i class="iconfont sv-text"></i>
            <span>文本</span>
          </div>
          <div class="ep-draggable-item item" tid="defaultModule.image">
            <i class="iconfont sv-image"></i>
            <span>图片</span>
          </div>
          <div class="ep-draggable-item item" tid="defaultModule.longText">
            <i class="iconfont sv-longText"></i>
            <span>长文</span>
          </div>
          <div class="ep-draggable-item item" tid="defaultModule.table">
            <i class="iconfont sv-table"></i>
            <span>表格</span>
          </div>
          <div class="ep-draggable-item item" tid="defaultModule.html">
            <i class="iconfont sv-html"></i>
            <span>html</span>
          </div>
          <div class="ep-draggable-item item" tid="defaultModule.customText">
            <i class="iconfont sv-text"></i>
            <span>自定义</span>
          </div>
          <div class="title">辅助元素</div>
          <div class="ep-draggable-item item" tid="defaultModule.hline">
            <i class="iconfont sv-hline"></i>
            <span>横线</span>
          </div>
          <div class="ep-draggable-item item" tid="defaultModule.vline">
            <i class="iconfont sv-vline"></i>
            <span>竖线</span>
          </div>
          <div class="ep-draggable-item item" tid="defaultModule.rect">
            <i class="iconfont sv-rect"></i>
            <span>矩形</span>
          </div>
          <div class="ep-draggable-item item" tid="defaultModule.oval">
            <i class="iconfont sv-oval"></i>
            <span>圆形</span>
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

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 38%;
  min-height: 60px;
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
