<template>
  <div class="grid grid-cols-1 sm:grid-cols-2" v-if="props.connectedAccount && Object.keys(props.connectedAccount).length != 0">
    <div class="stat flex flex-row">
      <div class="stat-figure text-secondary">
        <div class="avatar online">
          <div class="w-16 rounded-full">
            <img :src="props.connectedAccount.profile_picture_url" />
          </div>
        </div>
      </div>
      <div class="flex-grow">
        <div class="stat-value whitespace-normal">{{ props.connectedAccount.username }}</div>
        <div class="stat-title whitespace-normal">{{ props.connectedAccount.name }}</div>
        <div class="stat-desc whitespace-normal">{{ props.connectedAccount.biography }}</div>
        <div class="stat-desc whitespace-normal font-semibold">IG_ID: {{ props.connectedAccount.ig_id }}</div>
        <div class="stat-desc whitespace-normal font-semibold">ID: {{ props.connectedAccount.id }}</div>
      </div>
    </div>
    <div class="stats stats-vertical lg:stats-horizontal overflow-x-hidden">
  
      <div class="stat justify-items-center">
        <div class="stat-title">Media Count</div>
        <div class="stat-value">{{ props.connectedAccount.media_count }}</div>
      </div>
      
      <div class="stat justify-items-center">
        <div class="stat-title">Followers Count</div>
        <div class="stat-value">{{ props.connectedAccount.followers_count }}</div>
      </div>
      
      <div class="stat justify-items-center">
        <div class="stat-title">Follows count</div>
        <div class="stat-value">{{ props.connectedAccount.follows_count }}</div>
      </div>
      
    </div>
  </div>
  <div class="divider"></div>
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-outline btn-wide">
          <div>{{ _.find(insightsTabs2.tablist, ['id', insightsTabs1.activetab])?.hint }}</div>
          <span class="material-symbols-outlined">keyboard_arrow_down</span>
        </div>
        <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
          <template v-for="{id, hint} in insightsTabs1.tablist" :key="id">
            <li><a @click="fetchUserInsightsTVForId(id)">{{ hint }}</a></li>
          </template>
        </ul>
      </div>
      <UserInsights2 :response="responseInsights1" />

  <div class="divider"></div>
  <div class="m-4">
    <div role="tablist" class="tabs tabs-lifted tabs-lg">
      <template v-for="{id, hint} in insightsTabs2.tablist" :key="id">
        <input type="radio" name="days_tab_1" role="tab" class="tab" :aria-label="hint" :checked="id==insightsTabs2.activetab" 
        @click="fetchUserInsightsTSForId(id)"/>
        <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box">
          <div class="card shadow-xl">
            <div class="card-body">
              <Line id="responseInsight2" :options="chartOptions" :data="chartData" />
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>

        
</template>

<script setup lang="ts">
import type {UserInsightsTimeSeries, UserInsightsDuration, ModifiedUserInsightsTotalValue, UserInsightsTotalValue, InstagramProfile, ResponseUserInsightsTimeSeries, ResponseModifiedUserInsightsTotalValue} from "@/assets/ts/types";
import _ from "lodash"; 
import { Line } from "vue-chartjs";
import { epochSinchUntil } from "~/composables/epoch";
import type {ChartOptions, ChartData, ChartDataset} from "chart.js"

const responseInsights1 = reactive({} as ResponseModifiedUserInsightsTotalValue);
const responseInsights2 = reactive({} as ResponseUserInsightsTimeSeries);

const insightsTabs1 = reactive({
    tablist : [
      {id: 1, value: "last_1_day", hint: "1 Day"},
      {id: 2, value: "last_2_day", hint: "2 Days"},
      {id: 3, value: "last_7_days", hint: "7 Days"},
      {id: 4, value: "last_14_days", hint: "14 Days"},
      {id: 5, value: "last_30_days", hint: "30 Days"},
    ],
    activetab: 1,
});

const insightsTabs2 = reactive({
    tablist : [
      {id: 1, value: "last_1_day", hint: "1 Day"},
      {id: 2, value: "last_2_day", hint: "2 Days"},
      {id: 3, value: "last_7_days", hint: "7 Days"},
      {id: 4, value: "last_14_days", hint: "14 Days"},
      {id: 5, value: "last_30_days", hint: "30 Days"},
    ],
    activetab: 1,
});

// create chartData and chartOptions which will replace data from responseInsights2
const chartData = ref<ChartData<'line'>>({datasets: []});

const chartOptions = {
  // maintainAspectRatio: false,
  scales: {
    y : {
      beginAtZero: true,
    }
  }
} as ChartOptions<'line'>;

const getDatetime = (dateTimeString: string) => {
  const dateObject = new Date(dateTimeString);
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
  const day = String(dateObject.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;

  return dateString;
};


watch(() => responseInsights2.insights, (newVal) => {
  chartData.value = {
    labels: newVal.data[0].values.map(value => getDatetime(value.end_time)),
    datasets: newVal.data.map(data => {
      return {
        label: data.name,
        data: data.values.map(value => value.value),
        tension: 0.3,
        borderColor: "#" + Math.floor(Math.random() * 16777215).toString(16).toString(),
      }
    }) as ChartDataset<'line'>[],
  }
});

const fetchUserInsightsTVForId = (tabId: number) => {
  insightsTabs1.activetab = tabId;
  fetchUserInsightsTV();
};

const fetchUserInsightsTSForId = (tabId: number) => {
  insightsTabs2.activetab = tabId;
  fetchUserInsightsTS();
};

const {status: userInsightsTVStatus, data: userInsightsTV, execute: fetchUserInsightsTV, error: error1} = useLazyAsyncData('user-insights-tv', async () => {
  let {since, until} = epochSinchUntil(insightsTabs1.tablist.find(tab => tab.id === insightsTabs1.activetab)?.value as UserInsightsDuration);
  const {url1, url2, url3, url4}  = await fetchUserInsightsTotalValue({accountId: props.accountId, since, until, accessToken: props.accessToken});
  const [resp1, resp2, resp3, resp4] = await Promise.all([
    $fetch(url1), $fetch(url2), $fetch(url3), $fetch(url4)
  ]) as (UserInsightsTotalValue)[];
  return {resp1, resp2, resp3, resp4};
}, 
{
  transform:(allResponse) =>{
    const {resp1, resp2, resp3, resp4} = allResponse;
    const response = {
      data: [...resp1.data, ...resp2.data, ...resp3.data, ...resp4.data],
      paging: {
        next: [resp1.paging.next, resp2.paging.next, resp3.paging.next, resp4.paging.next],
        previous: [resp1.paging.previous, resp2.paging.previous, resp3.paging.previous, resp4.paging.previous],
      }
    } as ModifiedUserInsightsTotalValue;
    return {response}
  },
  immediate: false,
  server: false,
});

watch(() => userInsightsTVStatus.value, (newstatus) => {
    if(error1.value) {
      const errorMessage = (error1.value as any)?.data?.error?.message || error1.value.message;
      addToast({message: errorMessage, type: "error", duration: 3000});
    } else {
      responseInsights1.status = newstatus;
      responseInsights1.insights = userInsightsTV.value?.response as ModifiedUserInsightsTotalValue;
    }
});

const {status: userInsightsTSStatus, data: userInsightsTS, execute: fetchUserInsightsTS, error: error2} = useLazyAsyncData('user-insights-ts',async () => {
  let {since, until} = epochSinchUntil(insightsTabs2.tablist.find(tab => tab.id === insightsTabs2.activetab)?.value as UserInsightsDuration);
  const { url1 } = await fetchUserInsightsTimeSeries({accountId: props.accountId, since, until, accessToken: props.accessToken});
  const [resp1] = await Promise.all([
    $fetch(url1),
  ]) as (UserInsightsTimeSeries)[];
  return {resp1};
}, 
{
  transform:(allResponse) =>{
    const {resp1} = allResponse;
    const response = resp1;
    return {response}
  },
  immediate: false,
  server: false,
});

watch(() => userInsightsTSStatus.value, (newstatus) => {
    if(error2.value) {
      const errorMessage = (error2.value as any)?.data?.error?.message || error2.value.message;
      addToast({message: errorMessage, type: "error", duration: 3000});
    } else {
      responseInsights2.status = newstatus;
      responseInsights2.insights = userInsightsTS.value?.response as UserInsightsTimeSeries;
    }
});

const props = defineProps<{
    accountId: string
    accessToken: string
    connectedAccount: InstagramProfile | null
}>();

defineExpose({
  fetchUserInsightsTSForId, fetchUserInsightsTVForId,
})

</script>