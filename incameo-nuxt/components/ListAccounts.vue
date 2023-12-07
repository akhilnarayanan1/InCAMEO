<template>
    <k-popover :opened="popoverOpened" :target="props.popoverTargetRef" @backdropclick="() => (popoverOpened = false)">
      <k-block v-if="loading" class="text-center">
        <k-preloader />
      </k-block>
      <k-list v-else>
        <k-block-title>Instagram Business Accounts</k-block-title>
        <div v-for="{picture, username, instagram_business_account} in response.connectedAccount.data">
          <k-list-item  v-if="instagram_business_account" :title="username" @click="()=>{}" :link="instagram_business_account ? true : false">
            <template #media>
              <img :src="picture.data.url" class="rounded-full" width="32" height="32">
            </template>
          </k-list-item>
        </div>
        <k-block-title>Non-Instagram Business Accounts</k-block-title>
        <div v-for="{picture, username, instagram_business_account} in response.connectedAccount.data">
          <k-list-item v-if="!instagram_business_account" :title="username" @click="()=>{}" :link="instagram_business_account ? true : false">
            <template #media>
              <img :src="picture.data.url" class="rounded-full" width="32" height="32">
            </template>
          </k-list-item>
        </div>

      </k-list>
    </k-popover>
</template>

<script setup lang="ts">

import { kPage, kPreloader, kPopover, kBlock, kBlockTitle, kLink, kNavbar, kList, kListItem } from "konsta/vue";
import { type InstagramData } from "@/assets/ts/types";
import { doc, getDoc } from "firebase/firestore";
import { useIsCurrentUserLoaded } from "vuefire";


const popoverOpened = ref(false);
const db =  useFirestore();
const loading = ref(true);

const props = defineProps<{ popoverTargetRef: string}>();

const getAccessToken = async () => {
    let accessToken = "";
    
    const user = useCurrentUser();

    if (useIsCurrentUserLoaded().value) {
        const userId = user.value?.uid || "";
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().accessToken;
        } 
    }
    
    return accessToken;

}

const response: { connectedAccount: InstagramData } = reactive({ connectedAccount: {data: [], paging: {cursors: {after: "", before: ""}}, loading: true} });

const loadAccounts = async () => {

    // if (!userId) {
    //     addToast({message: "UserID not set",  type: "error", duration: 5000})
    // }
    popoverOpened.value = true;
    const accessToken = await getAccessToken().catch(error=>addToast({message: error, type: "error", duration: 3000}));
    const {pending, data: resp} = await listAccounts({accessToken: accessToken});
    loading.value = pending.value
    response.connectedAccount = resp.value as InstagramData;
}    

defineExpose({loadAccounts});

</script>