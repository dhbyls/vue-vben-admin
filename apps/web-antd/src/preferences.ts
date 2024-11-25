import { defineOverridesPreferences } from '@vben/preferences';

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    name: import.meta.env.VITE_APP_TITLE,
    enableCheckUpdates: true,
    accessMode: 'backend',
  },
  logo: {
    enable: true,
    source: '/logo.png',
  },
  navigation: {
    styleType: 'plain',
  },
  sidebar: {
    width: 200,
  },
  theme: {
    mode: 'auto',
    radius: '0.25',
    semiDarkSidebar: false,
  },
  widget: {
    languageToggle: false,
    themeToggle: true,
  },
  breadcrumb: {
    showIcon: false,
  },
});
