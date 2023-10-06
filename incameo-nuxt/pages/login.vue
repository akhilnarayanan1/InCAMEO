<template>
    <button @click="connectFacebook" class="btn btn-primary w-64 rounded-full">CONNECT FACEBOOK</button>
    {{ user }}
</template>

<script setup lang="ts">

import { signInWithPopup, FacebookAuthProvider, signOut } from "firebase/auth";

const auth = useFirebaseAuth()!;
const user = useCurrentUser();
const provider = new FacebookAuthProvider();

const connectFacebook = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      navigateTo({path: '/dashboard',})
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    })
};

</script>