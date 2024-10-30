<template>
    <Navbar :access-token="userDetails.accessToken" @load-profile="loadProfile" />
    <SearchUser :accountId="userDetails.accountId" :accessToken="userDetails.accessToken" />
    <UserInsights :accountId="userDetails.accountId" :accessToken="userDetails.accessToken" :connectedAccount="responseConnectedAccount" ref="userInsightChild" />

</template>

<script setup lang="ts">
import type { InstagramProfile } from "@/assets/ts/types";
import { useFirestore, useIsCurrentUserLoaded } from "vuefire";
import _ from "lodash";

const loading = reactive({page: true});
const userDetails = reactive({accountId: "",  accessToken: ""});
const userInsightChild = ref();

const db = useFirestore();
const currentUser = useCurrentUser();

watchEffect(() => loading.page = currentUser == undefined);

const {status, error, data: responseConnectedAccount, execute: loadAccountDetails} = useLazyAsyncData('load-account-details', async () => {
  const url = await accountDetails({accountId: userDetails.accountId, accessToken: userDetails.accessToken});
  return $fetch<InstagramProfile>(url);
}, {immediate: false, server: false});

watch(() => status.value, (newstatus) => {
  if(newstatus === "error" && error.value) {
    const errorMessage = (error.value as any)?.data?.error?.message || error.value.message;
    addToast({message: errorMessage, type: "error", duration: 3000});
  }
});

onMounted(() => { 
  if (!useIsCurrentUserLoaded().value) {
    watch(() => currentUser.value, (newCurrentUser) => loadAccount());
  } else {
    loadAccount();
  }
});

const loadAccount = async () => {
    //Stop processing if user is blank
  if (!currentUser.value) {
    addToast({ message: "Unknown error, Please try again (401)", type: "error", duration: 3000 });
    return;
  };
  
  userDetails.accessToken = await getAccessToken(currentUser.value.uid, db).catch(error=>addToast({message: error, type: "error", duration: 3000}));   
};


const loadProfile = async (args: {accountId: string, accessToken: string}) => {
  const {accountId, accessToken} = args;
  userDetails.accountId = accountId;
  await loadAccountDetails();
  userInsightChild.value.fetchUserInsightsTVForId(5);
  userInsightChild.value.fetchUserInsightsTSForId(5);
};

</script>