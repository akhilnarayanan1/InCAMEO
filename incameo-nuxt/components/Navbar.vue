<template>
  <div class="navbar bg-base-100">
    <div class="flex-1">
      <a class="btn btn-ghost text-xl">InCAMEO</a>
    </div>
    <div class="flex-none">
      <ListAccounts :accessToken="props.accessToken" @load-profile="loadProfile"/>
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-square btn-ghost rounded-btn">
            <span class="material-symbols-outlined">more_vert</span>
          </div>
          <ul tabindex="0" class="menu dropdown-content bg-white dark:bg-base-200 p-2 shadow-xl rounded-box w-52 mt-4">
            <li><a>Light/Dark Mode</a></li>
            <li><a @click="signOutFacebook">Signout</a></li>
          </ul>
        </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { signOut } from "firebase/auth";

const auth = useFirebaseAuth()!;

const darkMode = ref(false);

const props = withDefaults(defineProps<{accessToken?: string}>(), {accessToken: ''});
const emit = defineEmits(["loadProfile"]);

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  document.documentElement.classList.toggle('dark');
  darkMode.value ? setAppLighting('dark') : setAppLighting('light');
};

const signOutFacebook = async () => {
  await signOut(auth)
    .catch(error=>addToast({message:error, type: "error", duration: 3000}));
};

const loadProfile = async (args: {accountId: string, accessToken: string}) => {
  emit("loadProfile", {accountId: args.accountId, accessToken: args.accessToken});
};

</script>