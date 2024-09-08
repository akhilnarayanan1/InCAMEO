<template>
<div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box">
<div class="grid grid-cols-1 xl:grid-cols-3">

    <div class="card bg-base-100">
    <div class="card-body">
        <div class="stats stats-vertical lg:stats-horizontal overflow-x-hidden">
        <div class="stat justify-items-center">
            <div class="stat-title">Likes</div>
            <div class="stat-value">{{ calculateInsights(props.response, 'likes') }}</div>
        </div>
        <div class="stat justify-items-center">
            <div class="stat-title">Comments</div>
            <div class="stat-value">{{ calculateInsights(props.response, 'comments') }}</div>
        </div>
        </div>
    </div>
    </div>

    <div class="card bg-base-100">
    <div class="card-body">
        <div class="stats stats-vertical lg:stats-horizontal overflow-x-hidden">
        <div class="stat justify-items-center">
            <div class="stat-title">Follows</div>
            <div class="stat-value">{{ calculateInsightsFollowsAndUnfollows(props.response)[0].follows }}</div>
        </div>
        <div class="stat justify-items-center">
            <div class="stat-title">Unfollows</div>
            <div class="stat-value">{{ calculateInsightsFollowsAndUnfollows(props.response)[0].unfollows }}</div>
        </div>
        </div>
    </div>
    </div>

    <div class="card bg-base-100">
    <div class="card-body">
        <div class="stats stats-vertical lg:stats-horizontal overflow-x-hidden">
        <div class="stat justify-items-center">
            <div class="stat-title">Saves</div>
            <div class="stat-value">{{ calculateInsights(props.response, 'saves') }}</div>
        </div>
        <div class="stat justify-items-center">
            <div class="stat-title">Shares</div>
            <div class="stat-value">{{ calculateInsights(props.response, 'shares') }}</div>
        </div>
        </div>
    </div>
    </div>


    <div class="card bg-base-100">
    <div class="card-body">
        <div class="stats stats-vertical lg:stats-horizontal overflow-x-hidden">
        <div class="stat justify-items-center">
            <div class="stat-title">Profile Views</div>
            <div class="stat-value">{{ calculateInsights(props.response, 'profile_views') }}</div>
        </div>
        <div class="stat justify-items-center">
            <div class="stat-title">Replies</div>
            <div class="stat-value">{{ calculateInsights(props.response, 'replies') }}</div>
        </div>
        </div>
    </div>
    </div>

    <div class="card bg-base-100">
    <div class="card-body">
        <div class="stats stats-vertical lg:stats-horizontal overflow-x-hidden">
        <div class="stat justify-items-center">
            <div class="stat-title">Accounts Engaged</div>
            <div class="stat-value">{{ calculateInsights(props.response, 'accounts_engaged') }}</div>
        </div>
        <div class="stat justify-items-center">
            <div class="stat-title">Website Clicks</div>
            <div class="stat-value">{{ calculateInsights(props.response, 'website_click') }}</div>
        </div>
        </div>
    </div>
    </div>

    <div class="card bg-base-100">
    <div class="card-body">
        <div class="stats stats-vertical lg:stats-horizontal overflow-x-hidden">
        <div class="stat justify-items-center">
            <div class="stat-title">Total Interactions</div>
            <div class="stat-value">{{ calculateInsights(props.response, 'total_interactions') }}</div>
        </div>
        <div class="stat justify-items-center">
            <div class="stat-title">Profile Links Taps</div>
            <div class="stat-value">{{ calculateInsights(props.response, 'profile_links_taps') }}</div>
        </div>
        </div>
    </div>
    </div>

</div>

</div>
</template>

<script setup lang="ts">

import type { ResponseModifiedUserInsightsTotalValue } from '@/assets/ts/types';

const props = defineProps<{
    response: ResponseModifiedUserInsightsTotalValue
}>();

</script>