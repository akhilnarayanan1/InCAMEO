<template>
  <div v-for="toast in reverseToast(toasts)" :key="toast.id" >
    <k-toast :colors="{ bgIos:
        toast.type === 'error' ? 'text-white bg-red-400' : 
        toast.type === 'success' ? 'text-white bg-green-400' :
        toast.type === 'warning' ? 'text-white bg-yellow-400' : '', bgMaterial:
        toast.type === 'error' ? 'text-white bg-red-400' : 
        toast.type === 'success' ? 'text-white bg-green-400' :
        toast.type === 'warning' ? 'text-white bg-yellow-400' : ''
      }" position="right" :opened="opened.right">
      <template #button>
        <k-button v-if="toast.run" small rounded raised :colors="{textIos: 'text-white', textMaterial:'text-white'}" class="font-extrabold" clear inline @click="toast.run.feature">
          {{ toast.run.message }}
        </k-button>
        <k-button v-if="!toast.duration" small rounded :colors="{textIos: 'text-white', textMaterial:'text-white'}" class="font-extrabold" clear inline @click="removeToast(toast.id)">CLOSE</k-button>
      </template>
      <div class="shrink text-white">{{ toast.message }}</div>
    </k-toast>
  </div>
</template>
  
<script setup lang="ts">
import _ from "lodash";
import { getToasts } from "@/composables/toast";
import { type ToastData } from "@/assets/ts/types";
import { kToast, kButton } from "konsta/vue";

const opened = reactive({right: true})
let toasts = getToasts();
const removeToast = (id: number | undefined) => {
    if (id) {
        const isOnIndex = (_.findIndex(toasts.value, {id: id}));
        toasts.value.splice(isOnIndex, 1);
    };
};

const reverseToast = (toasts: ToastData[]) => {
  return [...toasts].reverse()
}

</script>
  
  
<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>