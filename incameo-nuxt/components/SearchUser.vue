<template>
  <form id="searchUserForm" @submit.prevent="() => searchUser()" class="m-4">
    <label class="input input-bordered flex items-center gap-2">
      <input id="searchedUsername" v-model="searchedUsername" type="text" class="grow" placeholder="Search creator/business account on Instagram" />
      <button type="button" class="btn btn-sm m-2">
        <span v-if="loading.searchAccount" class="loading loading-spinner loading-sm"></span>
        <span v-else class="material-symbols-outlined">search</span>
      </button>
    </label>
  </form>
  
  <div class="divider"></div>

<div v-if="searchAccountDialogOpened">
  <input type="checkbox" id="modal_search_user" class="modal-toggle" v-model="searchAccountDialogOpened"/>
  <div class="modal" role="dialog">
    <div class="modal-box">
      <div v-if="loading.searchAccount" class="flex justify-center">
        <span class="loading loading-dots loading-lg"></span>
      </div>
      <div v-else>
        <form method="dialog">
          <button class="btn btn-lg btn-circle btn-ghost absolute right-2 top-2" @click="searchAccountDialogOpened = false">✕</button>
        </form>
        <div class="grid grid-cols-1" v-if="dataSearchedUser && Object.keys(dataSearchedUser).length != 0">
          <div class="stat flex flex-row">
            <div class="stat-figure text-secondary">
              <div class="avatar online">
                <div class="w-16 rounded-full">
                  <img :src="dataSearchedUser.business_discovery.profile_picture_url" />
                </div>
              </div>
            </div>
            <div class="flex-grow">
              <div class="stat-value whitespace-normal">{{ dataSearchedUser.business_discovery.username }}</div>
              <div class="stat-title whitespace-normal">{{ dataSearchedUser.business_discovery.name }}</div>
              <div class="stat-desc whitespace-normal">{{ dataSearchedUser.business_discovery.biography }}</div>
              <div class="stat-desc whitespace-normal font-semibold">IG_ID: {{ dataSearchedUser.business_discovery.ig_id }}</div>
              <div class="stat-desc whitespace-normal font-semibold">ID: {{ dataSearchedUser.business_discovery.id }}</div>
            </div>
          </div>
          <div class="stats stats-vertical">
        
            <div class="stat justify-items-center">
              <div class="stat-title">Media Count</div>
              <div class="stat-value">{{ dataSearchedUser.business_discovery.media_count }}</div>
            </div>
            
            <div class="stat justify-items-center">
              <div class="stat-title">Followers Count</div>
              <div class="stat-value">{{ dataSearchedUser.business_discovery.followers_count }}</div>
            </div>
            
            <div class="stat justify-items-center">
              <div class="stat-title">Follows count</div>
              <div class="stat-value">{{ dataSearchedUser.business_discovery.follows_count }}</div>
            </div>
            
            <div class="stat justify-items-center">
              <div class="stat-title">Average Likes on Top {{ calculateTotalMedia(dataSearchedUser) }}  posts:</div>
              <div class="stat-value">{{ calculateAverageLikes(dataSearchedUser) }}</div>
            </div>

            <div class="stat justify-items-center">
              <div class="stat-title">Average Comments on Top {{ calculateTotalMedia(dataSearchedUser) }}  posts:</div>
              <div class="stat-value">{{ calculateAverageComments(dataSearchedUser) }}</div>
            </div>

            <div class="stat justify-items-center">
              <div class="stat-title">Engagment Rate based on Top {{ calculateTotalMedia(dataSearchedUser) }}  posts:</div>
              <div class="stat-value">{{ calculateEngagementRate(dataSearchedUser).toFixed(2) }}%</div>
            </div>
            
          </div>
        </div>
        <!-- <p class="py-4">{{ data }}</p> -->
      </div>
    </div>
  </div>
</div>

</template>

<script setup lang="ts">
  import type {InstagramDiscovery} from "@/assets/ts/types";

  const searchedUsername = ref("");
  const searchAccountDialogOpened =  ref(false);
  const props = defineProps<{accountId: string, accessToken: string}>();

  const loading = reactive({searchAccount: false, userLoaded: false});
  const data = reactive({searchedUser: {} as InstagramDiscovery});

  const db = useFirestore();
  const currentUser = useCurrentUser();

  watch(() => currentUser.value, (newCurrentUser) => loading.userLoaded = true);

  const {status, data: dataSearchedUser, error, execute: searchUser} = useLazyAsyncData('search-user', async() => {

    const accessToken = await getAccessToken(currentUser.value?.uid || "", db).catch(error=>addToast({message: error, type: "error", duration: 3000}));
    const url = await searchInstagramAccount({ accountId: props.accountId, username: searchedUsername.value, accessToken: accessToken});

    return $fetch<InstagramDiscovery>(url);
  }, {immediate: false, server: false});
    
  watch(() => status.value, (newstatus) => {
    if (newstatus == "pending") {
      loading.searchAccount = true;
      searchAccountDialogOpened.value = true;
    } else {
      loading.searchAccount = false;
    }

    if (error.value) {
      const errorMessage = (error.value as any)?.data?.error?.message || error.value.message;
      addToast({message: errorMessage, type: "error", duration: 3000});
      searchAccountDialogOpened.value = false;
    }
  });

</script>