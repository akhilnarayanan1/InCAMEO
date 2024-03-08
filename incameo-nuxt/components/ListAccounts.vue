<template>
    <k-button class="popover-button" @click="() => openPopover('.popover-button')" rounded>LOAD ACCOUNT</k-button>
    <k-popover :opened="popoverOpened" :target="popoverTargetRef" @backdropclick="() => (popoverOpened = false)">
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

import { kButton, kPreloader, kPopover, kBlock, kBlockTitle, kList, kListItem } from "konsta/vue";
import { type InstagramData } from "@/assets/ts/types";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useIsCurrentUserLoaded } from "vuefire";

const popoverOpened = ref(false);
const popoverTargetRef = ref("");
const loading = ref(true);

const db =  useFirestore();
const currentUser = useCurrentUser();
const props = defineProps<{accessToken: string}>();

const openPopover = (targetRef: string) => {
  popoverTargetRef.value = targetRef;
  popoverOpened.value = true;
  if (!useIsCurrentUserLoaded().value) {
      watch(currentUser, (newCurrentUser) => loadAccounts());
  } else {
    loadAccounts();
  }
};

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
    if (!currentUser.value) {
      addToast({ message: "Unknown error, Please try again (401)", type: "error", duration: 3000 });
      return;
    };
    popoverOpened.value = true;
    const url = await listAccounts({accessToken: props.accessToken});
    const {pending, data: resp, error} = useLazyFetch(url as string)

    watch(() => pending.value, (newpending) => {
      loading.value = newpending;
      if(error.value) {
        addToast({message: error.value.data?.error?.message, type: "error", duration: 3000});
      } else {
        response.connectedAccount = resp.value as InstagramData;
      }
    });
}    

</script>