<template>
  <k-page>
    <Navbar />
      <k-block strong>
        <p>Here is your Nuxt & Konsta UI app. Let's see what we have here.</p>
      </k-block>
      <k-button @click="connectFacebook" rounded>CONNECT FACEBOOK</k-button>
  </k-page>
</template>

<script setup lang="ts">
import { kPage, kBlock, kButton } from 'konsta/vue';
import { signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

const auth = useFirebaseAuth()!;
const db =  useFirestore();
const user = useCurrentUser();
const provider = new FacebookAuthProvider();

const connectFacebook = () => {
  provider.addScope('instagram_basic');
  provider.addScope('pages_show_list');
  provider.addScope('instagram_manage_insights');
  provider.addScope('pages_read_engagement');
  provider.setCustomParameters({
    'display': 'popup'
  });
  signInWithPopup(auth, provider)
    .then(async (result) => {
      const userId = result.user.uid;
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;

      await setDoc(doc(db, "users", userId), {
        "accessToken": accessToken,
        "updatedAt": serverTimestamp(),
      }, { merge: true })
      .catch(error => {
        console.log(error);
      });
      navigateTo({path: '/dashboard',})
    })
    .catch(error=>addToast({message: error, type: "error"}));
};

</script>