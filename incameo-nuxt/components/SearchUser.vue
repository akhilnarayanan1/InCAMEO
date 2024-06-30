<template>
  <form v-if="userLoaded" id="searchUserForm" @submit.prevent="searchUser" class="mx-4">
    <label class="input input-bordered flex items-center">
      <input v-model="searchedUsername" type="text" class="grow" placeholder="Search Account on Instagram" />
      <span  type="submit" onclick="my_modal_1.showModal()" class="material-symbols-outlined">search</span>
    </label>
  </form>

 <!-- Put this part before </body> tag -->
<input type="checkbox" id="my_modal_6" class="modal-toggle" v-model="searchAccountDialogOpened"/>
<div class="modal" role="dialog">
  <div class="modal-box">
    <div v-if="loading.searchAccount" class="flex justify-center">
      <span class="loading loading-dots loading-lg"></span>
    </div>
    <div v-else>
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="searchAccountDialogOpened = false">✕</button>
      </form>
      <div class="grid grid-cols-1" v-if="Object.keys(data.searchedUser).length != 0">
        <div class="stat flex flex-row">
          <div class="stat-figure text-secondary">
            <div class="avatar online">
              <div class="w-16 rounded-full">
                <img :src="data.searchedUser.business_discovery.profile_picture_url" />
              </div>
            </div>
          </div>
          <div class="flex-grow">
            <div class="stat-value whitespace-normal">{{ data.searchedUser.business_discovery.username }}</div>
            <div class="stat-title whitespace-normal">{{ data.searchedUser.business_discovery.name }}</div>
            <div class="stat-desc whitespace-normal">{{ data.searchedUser.business_discovery.biography }}</div>
            <div class="stat-desc whitespace-normal font-semibold">IG_ID: {{ data.searchedUser.business_discovery.ig_id }}</div>
            <div class="stat-desc whitespace-normal font-semibold">ID: {{ data.searchedUser.business_discovery.id }}</div>
          </div>
        </div>
        <div class="stats stats-vertical">
      
          <div class="stat justify-items-center">
            <div class="stat-title">Media Count</div>
            <div class="stat-value">{{ data.searchedUser.business_discovery.media_count }}</div>
          </div>
          
          <div class="stat justify-items-center">
            <div class="stat-title">Followers Count</div>
            <div class="stat-value">{{ data.searchedUser.business_discovery.followers_count }}</div>
          </div>
          
          <div class="stat justify-items-center">
            <div class="stat-title">Follows count</div>
            <div class="stat-value">{{ data.searchedUser.business_discovery.follows_count }}</div>
          </div>
          
        </div>
      </div>
      <!-- <p class="py-4">{{ data }}</p> -->
    </div>
  </div>
</div>

</template>

<script setup lang="ts">
  const searchedUsername = ref("");
  const searchAccountDialogOpened =  ref(false);
  const userLoaded = ref(false);

  const loading = reactive({searchAccount: false, success: false, error: false});
  const data = reactive({searchedUser: {} as any});

  const db = useFirestore();
  const currentUser = useCurrentUser();

  watch(() => currentUser.value, (newCurrentUser) => userLoaded.value = true);

  const searchUser = async() => {
    //Stop processing if user is blank
    if (!currentUser.value) {
      addToast({ message: "Unknown error, Please try again (401)", type: "error", duration: 3000 });
      return;
    };

    loading.searchAccount = true;
    searchAccountDialogOpened.value = true;

    const accessToken = await getAccessToken(currentUser.value.uid, db).catch(error=>addToast({message: error, type: "error", duration: 3000}));
    const url = await searchInstagramAccount({ username: searchedUsername.value, accessToken: accessToken});

    const {pending, data: resp, error} = useFetch(url, {server: false});

    
    watch(() => pending.value, (newVal) => {
      if (error.value) {
        addToast({ message: error.value.data.error.error_user_title, type: "error", duration: 3000 });
        searchAccountDialogOpened.value = false;
        return;
      }
      loading.searchAccount = false;
      data.searchedUser = resp.value;
    });
  }

</script>