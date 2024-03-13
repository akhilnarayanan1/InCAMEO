<template>
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div class="mx-4">
              <div role="tablist" class="tabs tabs-lifted shadow-xl">
                  <template v-for="{id, value, hint} in insightsTabs1.tablist" :key="id"
                  @click="() => loadUserInsights1(props.accountId, id, props.accessToken)">
                    <input type="radio" name="days_tab_1" role="tab" class="tab" :aria-label="value" :checked="id==1"
                    @click="() => loadUserInsights1(props.accountId, id, props.accessToken)"/>
                    <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6 shadow-xl">
                      <Line :height="230" id="responseInsight1" :options="chartOptions1" :data="chartData1" />
                    </div>
                  </template>
              </div>
            </div>
            <div class="mx-4">
              <div role="tablist" class="tabs tabs-lifted shadow-xl">
                  <template v-for="{id, value, hint} in insightsTabs2.tablist" :key="id">
                    <input type="radio" name="days_tab_2" role="tab" class="tab" :aria-label="value" :checked="id==1"
                    @click="() => loadUserInsights2(props.accountId, id, props.accessToken)"/>
                    <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6 shadow-xl">
                      <Bar :height="230" id="responseInsight2" :options="chartOptions2" :data="chartData2" />
                    </div>
                  </template>
              </div>
            </div>
        </div> 
        
</template>

<script setup lang="ts">
import type {UserInsightsTimeSeries, UserInsightsDuration, ModifiedUserInsightsTotalValue} from "@/assets/ts/types";
import _ from "lodash"; 
import { Bar, Line } from "vue-chartjs";
import { epochSinchUntil } from "~/composables/epoch";
import type {ChartOptions, ChartData} from "chart.js"

const responseInsights1: {pending: boolean, insights: UserInsightsTimeSeries} = reactive({pending: true, insights: {} as UserInsightsTimeSeries});
const responseInsights2: {pending: boolean, insights: ModifiedUserInsightsTotalValue} = reactive({pending: true, insights: {} as ModifiedUserInsightsTotalValue});

const insightsTabs1 = reactive({
    tablist : [
      {id: 1, value: "last_1_day", hint: "Last 1 Day"},
      {id: 2, value: "last_2_day", hint: "Last 2 Days"},
      {id: 3, value: "last_7_days", hint: "Last 7 Days"},
      {id: 4, value: "last_14_days", hint: "Last 14 Days"},
      {id: 5, value: "last_30_days", hint: "Last 30 Days"},
    ],
    activetab: 1,
});

const insightsTabs2 = reactive({
    tablist : [
      {id: 1, value: "last_1_day", hint: "Last 1 Day"},
      {id: 2, value: "last_2_day", hint: "Last 2 Days"},
      {id: 3, value: "last_7_days", hint: "Last 7 Days"},
      {id: 4, value: "last_14_days", hint: "Last 14 Days"},
      {id: 5, value: "last_30_days", hint: "Last 30 Days"},
    ],
    activetab: 1,
});

// // create chartData and chartOptions which will replace data from responseInsights2
const chartData1 = ref({
    datasets: [{
      data: [],
    }]
});
const chartData2 = ref({
    datasets: [{
      data: [],
    }]
});

const chartOptions1 = {
  maintainAspectRatio: false,
  scales: {
    y : {
      beginAtZero: true
    }
  }
};

const chartOptions2 = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y : {
      beginAtZero: true
    }
  }
};

const getDatetime = (dateTimeString: string) => {
  const dateObject = new Date(dateTimeString);
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
  const day = String(dateObject.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;

  return dateString;
};


watch(() => responseInsights1.insights, (newVal, oldVal) => {
  // console.log(toRaw(newVal));
  const ch = newVal.data.map(data => {
    const borderColor = "#" + Math.floor(Math.random() * 16777215).toString(16).toString();
    return {
      label: data.name,
      data: data.values.map(value => ({
        x: getDatetime(value.end_time),
        y: value.value,
      })),
      tension: 0.3,
      borderColor,
    }
  });

  chartData1.value = {
    datasets: ch as never[],
  }
});

watch(() => responseInsights2.insights, (newVal, oldVal) => { 
// this took me lot of time to figure out 
const totalValueObject = {
    label: 'Total Value',
    backgroundColor: "#" + Math.floor(Math.random() * 16777215).toString(16).toString(),
    data: [] as {x: string, y:number}[], // Initially empty array
};
const datasets = _.chain(newVal.data)
  .flatMap(data => {
    const x = _.get(data, 'name', ".");
    const y = _.get(data, 'total_value.value', 0);
    totalValueObject.data.push({ x, y });
    
    if (_.has(data, 'total_value.breakdowns')) {
      return _.get(data, 'total_value.breakdowns', [])
        .flatMap(breakdown => {
          if (_.has(breakdown, 'results')) {
            return _.get(breakdown, 'results', []).map(result => {
              const x = _.get(data, 'name', ".");
              const y = _.get(result, 'value', 0);
              const label = _.get(result, 'dimension_values[0]', ".");
              const stack = _.get(breakdown, 'dimension_keys[0]', ".");
              const backgroundColor = "#" + Math.floor(Math.random() * 16777215).toString(16).toString();
              return { label, backgroundColor, stack, data: [{ x, y }] };
            });
          } else {
            const x = _.get(data, 'name', ".");
            const y = _.get(data, 'total_value.value', 0);
            const label = _.get(breakdown, 'dimension_values[0]', ".");
            const stack = _.get(breakdown, 'dimension_keys[0]', ".");
            const backgroundColor = "#" + Math.floor(Math.random() * 16777215).toString(16).toString();
            return { label, backgroundColor, stack, data: [{ x, y }] };
          }
        });
    }
    return [];
  })
  .compact()
  .value();

  const ch = [totalValueObject, ...datasets]; 
  chartData2.value = {
    datasets: ch as never[],
  }
});


const loadUserInsights1 = async (accountId: string, tabId: number, accessToken?: string) => {
    insightsTabs1.activetab = tabId;
    const duration = insightsTabs1.tablist.find(tab => tab.id === tabId)?.value as UserInsightsDuration;
    let {since, until} = epochSinchUntil(duration);
    responseInsights1.pending = true;
    const {pending: pending1, data: data1, error: error1} = await fetchUserInsightsTimeSeries({accountId, since, until, accessToken: accessToken as string});
    responseInsights1.pending = pending1.value;
    responseInsights1.insights = data1.value?.response as UserInsightsTimeSeries;
};

const loadUserInsights2 = async (accountId: string, tabId: number, accessToken?: string) => {
    insightsTabs2.activetab = tabId;
    const duration = insightsTabs1.tablist.find(tab => tab.id === tabId)?.value as UserInsightsDuration;
    let {since, until} = epochSinchUntil(duration);
    responseInsights2.pending = true;
    const {pending: pending2, data: data2, error: error2} = await fetchUserInsightsTotalValue({accountId, since, until, accessToken: accessToken as string});
    responseInsights2.pending = pending2.value;
    responseInsights2.insights = data2.value?.response as ModifiedUserInsightsTotalValue;
};

const props = defineProps<{
    accountId: string
    accessToken: string
}>();

defineExpose({
  loadUserInsights1, loadUserInsights2
})

</script>