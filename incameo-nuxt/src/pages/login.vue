<template>
  <form @submit.prevent="loginAccount">
    <input v-model="login_email" type="email" placeholder="Enter your e-mail" class="w-full input"> 
    <input v-model="login_password" type="password" placeholder="Enter your password" class="w-full input" autocomplete="false"> 
    {{ loading.login }}
    <button type="submit" :disabled='!showSubmitButton'>LOGIN</button>
  </form>
  

  {{ getFieldAlerts() }}

  {{ getToasts() }}

</template>

<script setup lang="ts">

  import { signInWithEmailAndPassword, sendEmailVerification, User, Auth } from "firebase/auth";
  import { Ref } from "vue";

  const loading: { login: boolean } = reactive({ login: false });
  const router = useRouter();

  const $firebaseAuth: Ref<Auth> = ref(null)
  onMounted(()=>{
    $firebaseAuth.value = useFirebase().$firebaseAuth
  })

  const login_email = ref("");
  const login_password = ref("");

  const showSubmitButton = ifNoUIError({login_email, login_password})
  clearFieldAlertOnTyping({login_email, login_password})

  const loginAccount = () => {

    // Validators
    checkRequiredFieldsForLogin(login_email, login_password);
    if(foundError({login_email, login_password}).value) return;

    // Login account
    loading.login = true;
    signInWithEmailAndPassword($firebaseAuth.value, login_email.value, login_password.value)
    .then((userCredential) => {
      loading.login = false;
      if (userCredential.user.emailVerified) {
        router.replace({name: "dashboard",});
      } else {
        addToast({
          message: `Please verify your email 📧 address before login.`,
          run: { 
            feature: () => sendVerificationEmail(userCredential.user),
            message: "RESEND EMAIL",
          },
          type: "error",
        });
      };
    })
    .catch((err) => {
      loading.login = false
      switch (err.code) {
        case "auth/wrong-password":
        case "auth/user-not-found":
          addToast({
            message: "Wrong credentials. Please check and try again",
            type: "error",
            duration: 2000,
          });
          break;
        case "auth/user-disabled":
          addToast({
            message: "Your account has been disabled. Please contact support",
            type: "error",
          });
          break;
        case "auth/too-many-requests":
          addToast({
            message: "Calm down. You are trying to login too many times",
            type: "error",
            duration: 2000,
          });
          break;
        default:
          addToast({
            message: err,
            type: "error",
            duration: 2000,
          });
          break;
      }
    });
  };


  const sendVerificationEmail = (user: User) => {
    sendEmailVerification(user).then(()=>{
      addToast({
        message: "Verification email has been sent. Please check your email",
        type: "success",
        duration: 2000,
      });
    }).catch((err)=>{
      switch (err.code) {
        case "auth/too-many-requests":
          addToast({
            message: "Calm down. You are trying to too many times",
            type: "error",
            duration: 2000,
          });
          break;
        default:
          addToast({
            message: err,
            type: "error",
            duration: 2000,
          });
          break;
      }
    });
  };

</script>