<template>
    <Navbar />
    <SearchUser />
    
    <button class="btn btn-primary" @click="connectFacebook">CREATOR/BUSINESS ACCOUNT</button>
</template>

<script setup lang="ts">
import { signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

const auth = useFirebaseAuth()!;
const db =  useFirestore();
const user = useCurrentUser();
const provider = new FacebookAuthProvider();

const popupOpened = ref(false);
const loading = reactive({popup: false});
const response = ref("");

const connectFacebook = () => {
  provider.addScope('instagram_basic');
  provider.addScope('pages_show_list');
  provider.addScope('instagram_manage_insights');
  provider.addScope('pages_read_engagement');
  provider.addScope('business_management');
  provider.setCustomParameters({
    'display': 'popup',
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
    .catch(error=>addToast({message: error, type: "error", duration: 3000}));
};

</script>