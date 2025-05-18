import { hiprint } from 'vue-plugin-hiprint';

export default function customProvider(_options) {
  const addElementTypes = function (context) {
    // 移除 旧的 defaultModule "元素"类型, 以避免重复
    context.removePrintElementTypes('defaultModule');
    // 添加 defaultModule "元素"类型
    context.addPrintElementTypes('defaultModule', [
      // PrintElementTypeGroup 分组
      // 如果使用 hiprint.PrintElementTypeManager.build('.hiprintEpContainer2', "defaultModule") 这里会渲染这个 "常规" 分组名称
      new hiprint.PrintElementTypeGroup('常规', [
        {
          tid: 'defaultModule.number', // 唯一 key
          type: 'text', // 元素类型
          // title: '资产名称', // 这里和 options 中的 title 一样。"拖拽时就显示" 优先级高于 options 的, "无法彻底删除"
          // field: 'text' // 这里和 options 中的 field 一样。优先级高于 options 的, "无法彻底删除"
          // data: "1111", // 这里和 options 中的 testData 一样。会有冲突, "无法彻底删除"
          // hideTitle: true,
          options: {
            title: '资产编号', // 标题, "拖进设计器才会显示"
            // hideTitle: true,
            field: 'number', // 字段名称
            testData: 'TY2012000021', // 测试数据
          },
        },
        {
          tid: 'defaultModule.assets_name', // 唯一 key
          type: 'text', // 元素类型
          // title: '资产名称', // 这里和 options 中的 title 一样。"拖拽时就显示" 优先级高于 options 的, "无法彻底删除"
          // field: 'text' // 这里和 options 中的 field 一样。优先级高于 options 的, "无法彻底删除"
          // data: "1111", // 这里和 options 中的 testData 一样。会有冲突, "无法彻底删除"
          // hideTitle: true,
          options: {
            title: '资产名称', // 标题, "拖进设计器才会显示"
            // hideTitle: true,
            field: 'assets_name', // 字段名称
            testData: '办公桌', // 测试数据
          },
        },
        {
          tid: 'defaultModule.mode', // 唯一 key
          type: 'text', // 元素类型
          // title: '资产名称', // 这里和 options 中的 title 一样。"拖拽时就显示" 优先级高于 options 的, "无法彻底删除"
          // field: 'text' // 这里和 options 中的 field 一样。优先级高于 options 的, "无法彻底删除"
          // data: "1111", // 这里和 options 中的 testData 一样。会有冲突, "无法彻底删除"
          // hideTitle: true,
          options: {
            title: '规格型号', // 标题, "拖进设计器才会显示"
            // hideTitle: true,
            field: 'mode', // 字段名称
            testData: '1200*500*750', // 测试数据
          },
        },
        {
          tid: 'defaultModule.addr', // 唯一 key
          type: 'text', // 元素类型
          // title: '资产名称', // 这里和 options 中的 title 一样。"拖拽时就显示" 优先级高于 options 的, "无法彻底删除"
          // field: 'text' // 这里和 options 中的 field 一样。优先级高于 options 的, "无法彻底删除"
          // data: "1111", // 这里和 options 中的 testData 一样。会有冲突, "无法彻底删除"
          // hideTitle: true,
          options: {
            title: '存放地点', // 标题, "拖进设计器才会显示"
            // hideTitle: true,
            field: 'addr', // 字段名称
            testData: '903', // 测试数据
          },
        },
        {
          tid: 'defaultModule.user_name', // 唯一 key
          type: 'text', // 元素类型
          // title: '资产名称', // 这里和 options 中的 title 一样。"拖拽时就显示" 优先级高于 options 的, "无法彻底删除"
          // field: 'text' // 这里和 options 中的 field 一样。优先级高于 options 的, "无法彻底删除"
          // data: "1111", // 这里和 options 中的 testData 一样。会有冲突, "无法彻底删除"
          // hideTitle: true,
          options: {
            title: '使用人', // 标题, "拖进设计器才会显示"
            // hideTitle: true,
            field: 'user_name', // 字段名称
            testData: '小明', // 测试数据
          },
        },
        {
          tid: 'defaultModule.user_dept', // 唯一 key
          type: 'text', // 元素类型
          // title: '资产名称', // 这里和 options 中的 title 一样。"拖拽时就显示" 优先级高于 options 的, "无法彻底删除"
          // field: 'text' // 这里和 options 中的 field 一样。优先级高于 options 的, "无法彻底删除"
          // data: "1111", // 这里和 options 中的 testData 一样。会有冲突, "无法彻底删除"
          // hideTitle: true,
          options: {
            title: '使用部门', // 标题, "拖进设计器才会显示"
            // hideTitle: true,
            field: 'user_dept', // 字段名称
            testData: '财务科', // 测试数据
          },
        },
        {
          tid: 'defaultModule.text', // 唯一 key
          type: 'text', // 元素类型
          // title: '资产名称', // 这里和 options 中的 title 一样。"拖拽时就显示" 优先级高于 options 的, "无法彻底删除"
          // field: 'text' // 这里和 options 中的 field 一样。优先级高于 options 的, "无法彻底删除"
          // data: "1111", // 这里和 options 中的 testData 一样。会有冲突, "无法彻底删除"
        },
        {
          tid: 'defaultModule.qr', // 唯一 key
          type: 'qrcode', // 元素类型
          // title: '二维码', // 这里和 options 中的 title 一样。"拖拽时就显示" 优先级高于 options 的, "无法彻底删除"
          field: 'qr', // 这里和 options 中的 field 一样。优先级高于 options 的, "无法彻底删除"
          // data: "1111", // 这里和 options 中的 testData 一样。会有冲突, "无法彻底删除"
        },
      ]),
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
      ]),
    ]);
  };
  return {
    addElementTypes,
  };
}
