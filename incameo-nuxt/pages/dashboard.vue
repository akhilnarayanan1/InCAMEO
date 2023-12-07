<template>
  <k-page>
    <Navbar />
    <Toast />
    <div class="grid grid-cols-2 gap-x-4">
      <k-button @click="signOutFacebook" rounded>SIGNOUT</k-button> 
      <k-button class="popover-button" @click="() => openPopover('.popover-button')" rounded>LOAD ACCOUNT</k-button>
    </div>
    {{ response }}
    <ListAccounts ref="listAccountsComponent" :popoverTargetRef="popoverTargetRef" />
    
  </k-page>
</template>

<script setup lang="ts">

import { kPage, kButton } from "konsta/vue";
import { signOut, type User } from "firebase/auth";
import { type InstagramData } from "@/assets/ts/types";
import { getDocs, doc, query, collection, where, } from "firebase/firestore";

const listAccountsComponent = ref();
const popoverTargetRef = ref("");
const db = useFirestore();
const response: {connectedAccount: InstagramData}[]= reactive([]);

const loading = reactive({page: true});

const auth = useFirebaseAuth()!;
const currentUser = await getCurrentUser() as User | null | undefined;
watchEffect(() => loading.page = currentUser == undefined);

const openPopover = (targetRef: string) => {
  listAccountsComponent.value.loadAccounts();
  popoverTargetRef.value = targetRef;
};

const loadAccountDetail = async (accountId: string) => {
  const {pending, data: resp} = await accountDetails(currentUser as User, db, accountId);
  loading.page = pending.value
  response.push({connectedAccount: resp.value as InstagramData});
};

onMounted(async ()=> {

  //Stop processing if user is blank
  if (!currentUser) {
    addToast({ message: "Unknown error, Please try again (101)", type: "error", duration: 3000 });
    return;
  };

  const q = query(collection(db, "instagram_business"), where("userid", "==", currentUser.uid));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (doc) => {
    await loadAccountDetail(doc.id);
  });

});

const signOutFacebook = async () => {
  await signOut(auth)
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    })
}

</script>