<template>
    <div v-if="loading.page" class="flex h-screen">
        <div class="m-auto">
            <span class="loading loading-bars loading-lg"></span>
        </div>
    </div>
    <div v-else-if="!user">
        login now
    </div>
    <div v-else>
        <button @click="signOutFacebook" class="btn btn-primary w-64 rounded-full">SIGNOUT</button>
        {{ user }}
    </div>
</template>

<script setup lang="ts">

import {signOut, User} from "firebase/auth";

const loading = reactive({page: true});

const auth = useFirebaseAuth()!;
const user = useCurrentUser();

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