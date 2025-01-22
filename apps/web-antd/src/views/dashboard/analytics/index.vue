<script lang="ts" setup>
import type { AnalysisOverviewItem } from '@vben/common-ui';
import type { TabOption } from '@vben/types';

import {
  AnalysisChartCard,
  AnalysisChartsTabs,
  AnalysisOverview,
} from '@vben/common-ui';
import { SvgCakeIcon, SvgCardIcon } from '@vben/icons';

import AnalyticsTrends from './analytics-trends.vue';
import AnalyticsVisitsData from './analytics-visits-data.vue';
import AnalyticsVisitsSales from './analytics-visits-sales.vue';
import AnalyticsVisitsSource from './analytics-visits-source.vue';

const overviewItems: AnalysisOverviewItem[] = [
  {
    icon: SvgCardIcon,
    title: '我的资产',
    totalTitle: '资产总数',
    totalValue: 120_000,
    value: 100,
  },
  {
    icon: SvgCakeIcon,
    title: '我的分类',
    totalTitle: '总分类',
    totalValue: 5,
    value: 2,
  },
  {
    icon: SvgCardIcon,
    title: '盘亏',
    totalTitle: '盘亏（总）',
    totalValue: 100,
    value: 2,
  },
  {
    icon: SvgCardIcon,
    title: '盘盈',
    totalTitle: '盘盈（总）',
    totalValue: 4,
    value: 302,
  },
];

const chartTabs: TabOption[] = [
  {
    label: '资产新增趋势',
    value: 'trends',
  },
  // {
  //   label: '资产报废',
  //   value: 'visits',
  // },
];
</script>

<template>
  <div class="p-5">
    <AnalysisOverview :items="overviewItems" />
    <AnalysisChartsTabs :tabs="chartTabs" class="mt-5">
      <template #trends>
        <AnalyticsTrends />
      </template>
      <!-- <template #visits>
        <AnalyticsVisits />
      </template> -->
    </AnalysisChartsTabs>

    <div class="mt-5 w-full md:flex">
      <AnalysisChartCard class="mt-5 md:mr-4 md:mt-0 md:w-1/3" title="资产状态">
        <AnalyticsVisitsData />
      </AnalysisChartCard>
      <AnalysisChartCard class="mt-5 md:mr-4 md:mt-0 md:w-1/3" title="部门分布">
        <AnalyticsVisitsSource />
      </AnalysisChartCard>
      <AnalysisChartCard class="mt-5 md:mt-0 md:w-1/3" title="类别分布">
        <AnalyticsVisitsSales />
      </AnalysisChartCard>
    </div>
  </div>
</template>
