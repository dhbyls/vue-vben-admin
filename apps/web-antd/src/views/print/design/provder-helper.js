const PRINT_ELEMENT_TYPE_MAP = {
  // 比如后端返回元素类型的是 "txt", 但是我们需要的是 "text"
  txt: 'text',
  img: 'image',
  // 比如后端返回的 "二维码", 但是我们需要的是 "text"， 还需要特殊处理
  qrcode: 'text',
  // 比如后端返回的 "条形码", 但是我们需要的是 "text"， 也需要特殊处理
  barcode: 'text',
  table: 'table',
  tableCustom: 'table',
  hLine: 'hline', // 后端返回的它就是不一样，怼他
  vLine: 'vline',
  rect: 'rect',
  oval: 'oval',
};

/**
 * 创建一个 provider, 我这里示例，传入两个参数
 * @param {*} key 这个 key 是用于创建 "唯一" 的 "tid" 的, 一般是用于区分不同的 provider
 * @param {*} options 这个就需要根据实际情况来定义了,根据项目实际情况与后端协商定义
 */
const createProvider = function (key, options) {
  const addElementTypes = function (context) {
    // 先清空, 避免重复添加. 如果有特殊需求, 可以不清空
    context.removePrintElementTypes(key);
    // 第 3 步: 创建元素数组
    const printElements = options.printElements.map((item) => {
      // 提出来, 方便处理 二维码 条形码;
      // 如果和后端约定好,那么就更简单了,直接把后端返回的数据,直接赋值给 options
      const options = {
        title: item.title, // 在 options 中添加 title, 是可以清空的
        field: item.field,
        testData: item.testData,
        ...item.options, // 可选参数之类的, 或者参数都在这里面
      };
      // 有些元素可以不设置宽高的,比如 table
      item.width && (options.width = item.width);
      item.height && (options.height = item.height);
      // 特殊处理 二维码 条形码
      if (['barcode', 'qrcode'].includes(item.type)) {
        options.textType = item.type;
      }
      // 基础打印元素选项
      const printElement = {
        tid: `${key}.${item.id}`, // 确保不重复就行
        title: item.title, // 这个 title 清空了,还是会有这个默认值
        type: PRINT_ELEMENT_TYPE_MAP[item.type], // 转换后端返回的元素类型
        options,
      };
      // 特殊处理 表格 (表格参比较多咯~~~)
      printElement.columns = item.columns ?? [
        [
          { align: 'center', width: 100 },
          { align: 'center', width: 100 },
        ],
      ];
      return printElement;
    });
    // 第 2 步: 创建分组对象
    const printElementGroup = new hiprint.PrintElementTypeGroup(
      options.groupName,
      printElements,
    );
    // 第 1 步: 添加到 key 数组中
    context.addPrintElementTypes(key, [printElementGroup]);
  };
  return {
    addElementTypes,
  };
};
/**
 * 创建多个 provider
 * @param {*} optionList 参数列表
 */
const createProviderList = function (optionList) {
  const providers = optionList.map((item) => {
    return createProvider(item.key, item.options);
  });
  // 当你不清楚的时候, 可以 log 出来看看
  return providers;
};
export default { createProvider, createProviderList };
