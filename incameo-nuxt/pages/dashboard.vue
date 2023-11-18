<template>
  <k-page>
    <Navbar />
    <Toast />
    <div class="grid grid-cols-2 gap-x-4">
      <k-button @click="signOutFacebook" rounded>SIGNOUT</k-button> 
      <k-button @click="loadAccounts" rounded>LOAD ACCOUNT</k-button>
    </div>

    <ListAccounts ref="listAccountsComponent" />
    
  </k-page>
</template>

<script setup lang="ts">

import { kPage, kButton, kToast } from "konsta/vue";
import { signOut, type User } from "firebase/auth";

const listAccountsComponent = ref();

const loading = reactive({page: true});
const opened = reactive({left:true})

const auth = useFirebaseAuth()!;
const user = useCurrentUser();

const loadAccounts = async () => {
  listAccountsComponent.value.loadAccounts();
};

// Change loading status after fetching user
getCurrentUser()
  .then((user: User) => {
    loading.page = false;
  })
  .catch((error) => {
    loading.page = false;
  });

const signOutFacebook = async () => {
  await signOut(auth)
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    })
}

</script>