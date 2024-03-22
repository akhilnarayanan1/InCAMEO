<template> 
    <button class="btn" @click="openDialog()" onclick="listAccountDialog.showModal()">Button</button>

    <dialog id="listAccountDialog" class="modal">
      <div class="modal-box">
        <div v-if="loading.listAccount">
          <span class="loading loading-dots loading-lg items-center "></span>
        </div>
        <div v-else>
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" ref="listAccountDialogClose">✕</button>
          </form>
          <h3 class="py-4 font-bold text-lg">Creator/Business Account(s)</h3>
          <ul class="menu bg-base-200  rounded-box">
            <div v-for="{picture, username, instagram_business_account} in response.connectedAccount.data">
              <li v-if="instagram_business_account">
                <a @click="saveInstgramBusinessAccount(instagram_business_account.id)"><img :src="picture.data.url" class="rounded-full w-6 h-6">{{ username }}</a>
              </li>
            </div>
          </ul>
          <h3 class="py-4 font-bold text-lg">Personal Account(s) <i>(disabled)</i></h3>
          <ul class="menu bg-base-200  rounded-box">
            <div  v-for="{picture, username, instagram_business_account} in response.connectedAccount.data">
              <li v-if="!instagram_business_account" class="disabled">
                <a><img :src="picture.data.url" class="rounded-full w-6 h-6">{{ username }}</a>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </dialog>
</template>

<script setup lang="ts">
import { type InstagramData } from "@/assets/ts/types";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useIsCurrentUserLoaded } from "vuefire";

const listAccountDialogClose = ref();
const loading = reactive({page: true, listAccount: false});

const db =  useFirestore();
const currentUser = useCurrentUser();
const props = defineProps<{accessToken: string}>();
const emit = defineEmits(["loadProfile"]);

const openDialog = () => {
  loading.listAccount = true;
  if (!useIsCurrentUserLoaded().value) {
      watch(currentUser, (newCurrentUser) => loadAccounts());
  } else {
    loadAccounts();
  }
};

const saveInstgramBusinessAccount = async (instagram_business_account_id: string) => {
    await setDoc(doc(db, "instagram_business", instagram_business_account_id), {
      "userid": currentUser.value?.uid,
      "lastUpdatedOn": serverTimestamp(),
    }, { merge: true })
    .then(()=>{
      loading.listAccount = false;
      addToast({message: "Account set as default", type:"success", duration: 3000});
      emit("loadProfile", {accountId: instagram_business_account_id, accessToken: props.accessToken});
      listAccountDialogClose.value.click();
    })
    .catch(error => {
      loading.listAccount = false;
      addToast({message: error, type:"error", duration: 3000});
      listAccountDialogClose.value.click();
    });
};

const response: { connectedAccount: InstagramData } = reactive({ connectedAccount: {} as InstagramData });

const loadAccounts = async () => {
    //Stop processing if user is blank
    if (!currentUser.value) {
      addToast({ message: "Unknown error, Please try again (401)", type: "error", duration: 3000 });
      return;
    };
    const url = await listAccounts({accessToken: props.accessToken});
    const {pending, data: resp, error} = useLazyFetch(url, {server: false});
    watch(pending, (newpending) => {
      loading.listAccount = newpending;
      if(error.value) {
        addToast({message: error.value.data?.error?.message, type: "error", duration: 3000});
      } else {
        response.connectedAccount = resp.value as InstagramData;
      }
    });
    loading.listAccount = pending.value;

}    

</script>