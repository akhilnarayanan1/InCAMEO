<template>
    <k-popover :opened="popoverOpened" :target="props.popoverTargetRef" @backdropclick="() => (popoverOpened = false)">
      <k-block v-if="loading" class="text-center">
        <k-preloader />
      </k-block>
      <k-list v-else>
        <k-block-title class="mb-0">Instagram Business Accounts</k-block-title>
        <div v-for="{picture, username, instagram_business_account} in response.connectedAccount.data">
          <k-list-item  v-if="instagram_business_account" :title="username" @click="() => saveInstgramBusinessAccount(instagram_business_account.id)" :link="instagram_business_account ? true : false">
            <template #media>
              <img :src="picture.data.url" class="rounded-full" width="32" height="32">
            </template>
          </k-list-item>
        </div>
        <k-block-title class="mb-0">Non-Instagram Business Accounts</k-block-title>
        <div v-for="{picture, username, instagram_business_account} in response.connectedAccount.data">
          <k-list-item v-if="!instagram_business_account" :title="username" :link="instagram_business_account ? true : false">
            <template #media>
              <img :src="picture.data.url" class="rounded-full" width="32" height="32">
            </template>
          </k-list-item>
        </div>

      </k-list>
    </k-popover>
</template>

<script setup lang="ts">

import { kPreloader, kPopover, kBlock, kBlockTitle, kList, kListItem } from "konsta/vue";
import { type InstagramData } from "@/assets/ts/types";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useIsCurrentUserLoaded } from "vuefire";
import type { User } from "firebase/auth";


const popoverOpened = ref(false);
const db =  useFirestore();
const loading = ref(true);

const currentUser = useCurrentUser();
const props = defineProps<{ popoverTargetRef: string}>();

const saveInstgramBusinessAccount = async (instagram_business_account_id: string) => {
    await setDoc(doc(db, "instagram_business", instagram_business_account_id), {
      "userid": currentUser.value?.uid,
      "lastUpdatedOn": serverTimestamp(),
    }, { merge: true })
    .then(()=>{
      popoverOpened.value = false;
      addToast({message: "Account added succesfully!", type:"success", duration: 3000});
    })
    .catch(error => {
      popoverOpened.value = false;
      addToast({message: error, type:"error", duration: 3000});
    });
};

const response: { connectedAccount: InstagramData } = reactive({ connectedAccount: {} as InstagramData });

const loadAccounts = async () => {

    //Stop processing if user is blank
    if (!currentUser) {
      addToast({ message: "Unknown error, Please try again (101)", type: "error", duration: 3000 });
      return;
    };
    popoverOpened.value = true;
    const {pending, data: resp} = await listAccounts(currentUser.value as User, db);
    loading.value = pending.value
    response.connectedAccount = resp.value as InstagramData;
}    

defineExpose({loadAccounts});

</script>