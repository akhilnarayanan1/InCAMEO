<template>
  <k-page>
    <Navbar />
    <Toast />
    <ListAccounts :accessToken="userDetails.accessToken" @load-profile="loadProfile"/>
    <!-- <UserInsights :accountId="userDetails.accountId" :accessToken="userDetails.accessToken" /> -->
    <div class="aspect-square overflow-hidden w-24 h-24 rounded-full">
      <img :src="response.connectedAccount.profile_picture_url" alt="Image description">
    </div>
    <div>{{ response.connectedAccount.username }}</div>
    <div>{{ response.connectedAccount.id }}</div>
    <div>{{ response.connectedAccount.ig_id }}</div>
    <div>{{ response.connectedAccount.name }}</div>
    <div>{{ response.connectedAccount.media_count }} posts</div>
    <div>{{ response.connectedAccount.followers_count }} followers</div>
    <div>{{ response.connectedAccount.follows_count }} following</div>
    <div>{{ response.connectedAccount.biography }}</div>
    <!-- <div>
      {{ response }}
    </div> -->
  </k-page>
</template>

<script setup lang="ts">

import { kPage, kCard, kButton } from "konsta/vue";
import { signOut, type User } from "firebase/auth";
import type { InstagramProfile, UserInsightsTotalValue } from "@/assets/ts/types";
import { getDocs, doc, query, collection, where, getDoc} from "firebase/firestore";
import { useFirestore, useIsCurrentUserLoaded } from "vuefire";
import _ from "lodash";

const loading = reactive({page: true});
const response: {connectedAccount: InstagramProfile}= reactive({connectedAccount: {} as InstagramProfile});
const userDetails = reactive({accountId: "",  accessToken: ""});

const router = useRouter();
const db = useFirestore();
const currentUser = useCurrentUser();

watchEffect(() => loading.page = currentUser == undefined);

const loadAccountDetail = async (accountId: string, accessToken?: string) => {
  const url = await accountDetails({accountId, accessToken: accessToken as string});
  const {pending, data: resp, error} = useLazyFetch(url as string);
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
    watch(currentUser, (newCurrentUser) => loadAccount());
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
  loadAccountDetail(accountId, accessToken);
};

</script>