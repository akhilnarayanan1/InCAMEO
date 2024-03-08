<template>
  <k-page>
    <Navbar />
    <Toast />
    <ListAccounts :accessToken="userDetails.accessToken" />

    <UserInsights 
      :accountId="userDetails.accountId" 
      :accessToken="userDetails.accessToken"
    />

    <div v-for="{connectedAccount} in response">
      {{ connectedAccount.username }}
    </div>
    
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
const response: {connectedAccount: InstagramProfile}[]= reactive([]);
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
      response.push({connectedAccount: resp.value as InstagramProfile});
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
  
  const q = query(collection(db, "instagram_business"), where("userid", "==", currentUser.value.uid));
  const querySnapshot = await getDocs(q);

  // userDetails.accountId = "17841435790960205";

  // const docRef = doc(db, "instagram_business",  userDetails.accountId);
  // const docSnap = await getDoc(docRef);

  // if (docSnap.exists()) {
  //   loadAccountDetail( userDetails.accountId, userDetails.accessToken);
  //   // loadUserInsights( userDetails.accountId, userDetails.accessToken);
  // }

  querySnapshot.forEach(async (doc) => {
    loadAccountDetail(doc.id, userDetails.accessToken);
    // loadUserInsights(doc.id, accessToken);
  });

};

</script>