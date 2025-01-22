import { hiprint } from 'vue-plugin-hiprint';

export default function customProvider(options) {
  const addElementTypes = function (context) {
    // 移除 旧的 defaultModule "元素"类型, 以避免重复
    context.removePrintElementTypes('defaultModule');
    // 添加 defaultModule "元素"类型
    context.addPrintElementTypes('defaultModule', [
      // PrintElementTypeGroup 分组
      // 如果使用 hiprint.PrintElementTypeManager.build('.hiprintEpContainer2', "defaultModule") 这里会渲染这个 "常规" 分组名称
      new hiprint.PrintElementTypeGroup('常规', options),
      new hiprint.PrintElementTypeGroup('辅助', [
        {
          tid: 'defaultModule.hline',
          title: '横线',
          type: 'hline',
        },
        {
          tid: 'defaultModule.vline',
          title: '竖线',
          type: 'vline',
        },
        {
          tid: 'defaultModule.rect',
          title: '矩形',
          type: 'rect',
        },
        {
          tid: 'defaultModule.oval',
          title: '圆形',
          type: 'oval',
        },
        {
          tid: 'defaultModule.image',
          title: '图片',
          type: 'image',
        },
      ]),
    ]);
  };
  return {
    addElementTypes,
  };
}
