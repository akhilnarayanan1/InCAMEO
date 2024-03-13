<template>
  <div class="stack">
    <div class="toast toast-end" v-for="toast in reverseToast(toasts)" :key="toast.id">
      <div :class="
      toast.type === 'error' ? 'alert alert-error' :
      toast.type === 'success' ? 'alert alert-success' :
      toast.type === 'warning' ? 'alert alert-warning' : 'alert-error'
      " role="alert">
        <span>{{ toast.message }}</span>
        <div v-if="toast.run">
            <button class="btn btn-sm" @click="removeToast(toast.id || '0')">Close</button>
          <button class="btn btn-sm btn-primary" @click="toast.run.feature">{{ toast.run.message }}</button>
        </div>
        <div v-else></div>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import _ from "lodash";
import { getToasts } from "@/composables/toast";
import { type ToastData } from "@/assets/ts/types";

const opened = reactive({right: true})
let toasts = getToasts();
const removeToast = (id: string) => {
    const isOnIndex = (_.findIndex(toasts.value, { id }));
    toasts.value.splice(isOnIndex, 1);
};

const reverseToast = (toasts: ToastData[]) => {
  return [...toasts].reverse()
}

</script>