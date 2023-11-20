<template>
    <k-popup size="w-160 h-160" :opened="popupOpened" @backdropclick="() => (popupOpened = false)">
      <k-page>
        <k-navbar title="Popup">
          <template #right>
            <k-link navbar @click="() => (popupOpened = false)"><span class="material-symbols-outlined">cancel</span></k-link>
          </template>
        </k-navbar>
        <k-block>
          <k-list strong inset>
            <div v-for="{picture, username, instagram_business_account} in response.connectedAccount.data">
              <k-list-item aria-disabled="true" :title="username">
                <template #media>
                  <img :src="picture.data.url" class="rounded-full" :width="`32`" :height="`32`">
                </template>
              </k-list-item>
            </div>
          </k-list>
        </k-block>
      </k-page>
    </k-popup>
</template>

<script setup lang="ts">

import { kPage, kPopup, kBlock, kLink, kNavbar, kList, kListItem } from "konsta/vue";
import { type InstagramData } from "@/assets/ts/types";
import { doc, getDoc } from "firebase/firestore";
import { useIsCurrentUserLoaded } from "vuefire";


const popupOpened = ref(false);
const db =  useFirestore();
const loading = ref(true);

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
    popupOpened.value = true;
    const accessToken = await getAccessToken().catch(error=>addToast({message: error, type: "error", duration: 3000}));
    const {pending, data: resp} = await listAccounts({accessToken: accessToken});
    loading.value = pending.value
    response.connectedAccount = resp.value as InstagramData;
}    

defineExpose({loadAccounts});

</script>