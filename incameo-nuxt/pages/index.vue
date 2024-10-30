<template>
    <Navbar />
    
    <button class="btn btn-primary" @click="connectFacebook">
      <span v-if="loading.popup" class="loading loading-spinner loading-sm"></span>
      <span v-else>CREATOR/BUSINESS ACCOUNT</span>
    </button>
</template>

<script setup lang="ts">
import { signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

const auth = useFirebaseAuth()!;
const db =  useFirestore();
const provider = new FacebookAuthProvider();
provider.addScope('instagram_basic');
provider.addScope('pages_show_list');
provider.addScope('instagram_manage_insights');
provider.addScope('pages_read_engagement');
provider.addScope('business_management');
provider.setCustomParameters({
  'display': 'popup',
});

const loading = reactive({popup: false});

const connectFacebook = () => {
  loading.popup = true;
  signInWithPopup(auth, provider)
  .then(result => {
    const userId = result.user.uid;
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken;
    return {accessToken, userId};
  })
  .then(({accessToken, userId}) => {
    return setDoc(doc(db, "users", userId), {
      "accessToken": accessToken,
      "updatedAt": serverTimestamp(),
    }, { merge: true });
  })
  .then(() => {
    loading.popup = false;
    addToast({message: "Facebook connected successfully", type: "success", duration: 3000});
    navigateTo({path: '/dashboard',});
  })
  .catch(error => {
    loading.popup = false;
    addToast({message: error, type: "error", duration: 3000});
  });
};

</script>