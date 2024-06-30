<template>
    <Navbar />
    <SearchUser :accountId="userDetails.accountId" :accessToken="userDetails.accessToken" />
    <ListAccounts :accessToken="userDetails.accessToken" @load-profile="loadProfile"/>
    <UserInsights :accountId="userDetails.accountId" :accessToken="userDetails.accessToken" :connectedAccount="response.connectedAccount" ref="userInsightChild" />

</template>

<script setup lang="ts">
import type { InstagramProfile } from "@/assets/ts/types";
import { useFirestore, useIsCurrentUserLoaded } from "vuefire";
import _ from "lodash";

const loading = reactive({page: true});
const response: {connectedAccount: InstagramProfile}= reactive({connectedAccount: {} as InstagramProfile});
const userDetails = reactive({accountId: "",  accessToken: ""});
const userInsightChild = ref();

const db = useFirestore();
const currentUser = useCurrentUser();

watchEffect(() => loading.page = currentUser == undefined);

const loadAccountDetail = async (accountId: string, accessToken?: string) => {
  const url = await accountDetails({accountId, accessToken: accessToken as string});
  const {pending, data: resp, error} = useLazyFetch(url, {server: false});
  watch(() => pending.value, (newpending) => {
    loading.page = newpending;
    if(error.value) {
      addToast({message: error.value.data?.error?.message, type: "error", duration: 3000});
    } else {
      response.connectedAccount = resp.value as InstagramProfile;
    }
  });
};

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
  loadAccountDetail(accountId, accessToken);
  userInsightChild.value.loadUserInsights1(accountId, 1, accessToken);
  userInsightChild.value.loadUserInsights2(accountId, 1, accessToken);
};

</script>