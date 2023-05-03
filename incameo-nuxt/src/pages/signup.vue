<template>
  <form @submit.prevent="createAccount">
    <input v-model="signup_email" type="email" placeholder="Enter your e-mail" class="w-full input"> 
    <input v-model="signup_password" type="password" placeholder="Choose a password" class="w-full input" autocomplete="false"> 
    <input v-model="signup_confirm_password" type="password" placeholder="Confirm your password" class="w-full input" autocomplete="false"> 
    {{ loading.signup }}
    <button type="submit" :disabled='!showSubmitButton'>CREATE ACCOUNT</button>
  </form>
  

  {{ getFieldAlerts() }}

  {{ getToasts() }}

</template>

<script setup lang="ts">

  import { linkWithCredential, EmailAuthProvider, sendEmailVerification } from "firebase/auth";

  const loading: { signup: boolean } = reactive({ signup: false });
  const router = useRouter();

  const signup_email = ref("");
  const signup_password = ref("");
  const signup_confirm_password = ref("");

  const user = firebaseUser().value;

  const showSubmitButton = ifNoUIError({signup_email, signup_password, signup_confirm_password})
  clearFieldAlertOnTyping({signup_email, signup_password, signup_confirm_password})

  
  const createAccount = () => {

    // Validators
    checkRequiredFieldsForSignup(signup_email, signup_password, signup_confirm_password);
    passwordMatcherForSignup(signup_password, signup_confirm_password);
    if (blankUser(user)) return;
    if (foundError({signup_email, signup_password, signup_confirm_password}).value) return;

    // Create account
    loading.signup = true;
    const credential = EmailAuthProvider.credential(signup_email.value, signup_password.value);

    linkWithCredential(user, credential)
    .then(async (userCredential) => {
      try{
        //Send verification email
        await sendEmailVerification(userCredential.user)
        .catch(err => {
          addToast({
            message: err,
            type: "error",
            duration: 2000,
          })
        })
        addToast({
          message: "Account created successfully. Please verify your email 📧 & login to continue.",
          type: "success",
        });
        router.replace({name: "login",})
      } catch (error) {
        addToast({
          message: "Error sending verification email. Try login.",
          type: "error",
        })
      }
      loading.signup = false;
    })
    .catch(err => {
      loading.signup = false;
      switch (err.code) {
        case "auth/invalid-email":
          addFieldAlert({
            message: "Please provide a valid email",
            fieldid: "signup_email",
            source: "server",
            type: "error",
          })
          break
        case "auth/email-already-in-use":
          addFieldAlert({
            message: "This account is already in use. Please Login",
            fieldid: "signup_email",
            source: "server",
            type: "error",
          })
          break
        case "auth/provider-already-linked":
          addFieldAlert({
            message: "This account is already in use. Please Login",
            fieldid: "signup_email",
            source: "server",
            type: "error",
          })
          break
        default:
          addToast({
            message: err,
            type: "error",
            duration: 2000,
          })
          break
      }
    })
  }


</script>