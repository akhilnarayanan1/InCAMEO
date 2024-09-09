<template> 
    <label for="model_list_account" class="btn" @click="openDialog">
      <span class="material-symbols-outlined">person_add</span>Load Accounts
    </label>
    
    <input type="checkbox" id="listAccountDialogInput" class="modal-toggle" v-model="listAccountDialogOpened" />
    <div id="listAccountDialog" class="modal"  role="dialog">
      <div class="modal-box">
        <div v-if="loading.listAccount" class="flex justify-center">
          <span class="loading loading-dots loading-lg"></span>
        </div>
        <div v-else>
          <form method="dialog">
            <button class="btn btn-lg btn-circle btn-ghost absolute right-2 top-2" @click="listAccountDialogOpened = false">✕</button>
          </form>
          <h3 class="py-4 font-bold text-lg">Creator/Business Account(s)</h3>
          <ul class="menu bg-base-200 rounded-box">
            <div v-for="{picture, username, instagram_business_account} in response.connectedAccount.data">
              <li v-if="instagram_business_account">
                <a @click="loadInstgramBusinessAccount(instagram_business_account.id)">
                  <img :src="picture.data.url" class="rounded-full w-6 h-6">{{ username }}
                </a>
              </li>
            </div>
          </ul>
          <h3 class="py-4 font-bold text-lg">Non Creator/Business Account(s) <i>(disabled)</i></h3>
          <ul class="menu bg-base-200 rounded-box">
            <div  v-for="{picture, username, instagram_business_account} in response.connectedAccount.data">
              <li v-if="!instagram_business_account" class="disabled">
                <a><img :src="picture.data.url" class="rounded-full w-6 h-6">{{ username }}</a>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </div >
</template>

<script setup lang="ts">
import { type InstagramData } from "@/assets/ts/types";
import { useIsCurrentUserLoaded } from "vuefire";

const listAccountDialogOpened = ref(false);
const loading = reactive({page: true, listAccount: false});

const db =  useFirestore();
const currentUser = useCurrentUser();
const props = defineProps<{accessToken: string}>();
const emit = defineEmits(["loadProfile"]);

onMounted(() => { 
  watch([() => currentUser.value, () => props.accessToken], ([newCurrentUser, newAccessToken]) => {
    if(newCurrentUser && newAccessToken) {
      openDialog();
    }
  });
});

const openDialog = () => {
  listAccountDialogOpened.value = true;
  loading.listAccount = true;
  if (!useIsCurrentUserLoaded().value) {
      watch(() => currentUser, (newCurrentUser) => loadAccounts());
  } else {
    loadAccounts();
  }
};

const loadInstgramBusinessAccount = async (instagram_business_account_id: string) => {
    loading.listAccount = false;
    addToast({message: "Account set as default", type:"success", duration: 3000});
    emit("loadProfile", {accountId: instagram_business_account_id, accessToken: props.accessToken});
    listAccountDialogOpened.value = false;
};

const response: { connectedAccount: InstagramData } = reactive({ connectedAccount: {} as InstagramData });

const loadAccounts = async () => {
    //Stop processing if user is blank
    if (!currentUser.value) {
      addToast({ message: "Unknown error, Please try again (401)", type: "error", duration: 3000 });
      listAccountDialogOpened.value = false;
      return;
    };
    const url = await listAccounts({accessToken: props.accessToken});
    const {status, data: resp, error} = useLazyFetch(url, {server: false});
    watch(() => status.value, (newstatus) => {
      loading.listAccount = newstatus != "pending" ? false : true;
      if(error.value) {
        addToast({message: error.value.data?.error?.message, type: "error", duration: 3000});
        listAccountDialogOpened.value = false;
      } else {
        response.connectedAccount = resp.value as InstagramData;
      }
    });
    loading.listAccount = status.value != "pending" ? false : true;

}    

</script>