<template>
  <k-page>
    <Navbar />
    <Toast />
    <div class="grid grid-cols-2 gap-x-4">
      <k-button @click="signOutFacebook" rounded>SIGNOUT</k-button> 
      <k-button class="popover-button" @click="() => openPopover('.popover-button')" rounded>LOAD ACCOUNT</k-button>
    </div>

    <ListAccounts ref="listAccountsComponent" :popoverTargetRef="popoverTargetRef" />
    
  </k-page>
</template>

<script setup lang="ts">

import { kPage, kButton } from "konsta/vue";
import { signOut } from "firebase/auth";

const listAccountsComponent = ref();
const popoverTargetRef = ref();

const loading = reactive({page: true});

const auth = useFirebaseAuth()!;
const user = useCurrentUser();
watchEffect(() => loading.page = user.value == undefined);

const openPopover = (targetRef: string) => {
  listAccountsComponent.value.loadAccounts();
  popoverTargetRef.value = targetRef;
};

const signOutFacebook = async () => {
  await signOut(auth)
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    })
}

</script>