import type { InstagramDiscovery, ResponseModifiedUserInsightsTotalValue } from "@/assets/ts/types";
import _ from "lodash";

export const calculateTotalMedia = (response: InstagramDiscovery) => {
    return response.business_discovery.media?.data.length || 0;
};

export const calculateTotalLikesOnMedia = (response: InstagramDiscovery) => {
    return _.sumBy(response.business_discovery.media?.data, (media) => {
        return media.like_count;
    });
};

export const calculateTotalCommentsOnMedia = (response: InstagramDiscovery) => {
    return _.sumBy(response.business_discovery.media?.data, (media) => {
        return media.comments_count;
    });
};

export const calculateAverageLikes = (response: InstagramDiscovery) => {
    if (!response.business_discovery.media?.data) return 0;

    return _.meanBy(response.business_discovery.media.data, (media) => {
        return media.like_count;
    });
};

export const calculateAverageComments = (response: InstagramDiscovery) => {
    if (!response.business_discovery.media?.data) return 0;

    return _.meanBy(response.business_discovery.media.data, (media) => {
        return media.comments_count;
    });
};

export const calculateTotalPosts = (response: InstagramDiscovery) => {
    return response.business_discovery.media_count;
}

export const calculateEngagementRate = (response: InstagramDiscovery) => {
    const likes = calculateTotalLikesOnMedia(response) as number;
    const comments = calculateTotalCommentsOnMedia(response) as number;
    const media = calculateTotalMedia(response) as number;
    const followers = response.business_discovery.followers_count;

    const engagmentRate = ( (likes+comments) / media) / followers;
    const correctedEngagmentRate = isNaN(engagmentRate) ? 0 : engagmentRate;

    return correctedEngagmentRate * 100;
};

export const calculateInsights = (response: ResponseModifiedUserInsightsTotalValue, keyToFind: string) => {
    return _.find(response.insights?.data, ['name', keyToFind])?.total_value.value || 0;
};

export const calculateInsightsFollowsAndUnfollows = (response: ResponseModifiedUserInsightsTotalValue): {follows:number, unfollows:number}[]=> {
    return _.defaultTo(_.find(response.insights?.data, ['name', 'follows_and_unfollows'])?.
        total_value.breakdowns?.map((breakdown) => {
            let follows = 0;
            let unfollows = 0;
            breakdown.results?.forEach((result) => {
                if (result.dimension_values?.[0] === 'FOLLOWER') {
                    follows = result.value || 0;
                }
                if (result.dimension_values?.[0] === 'NON_FOLLOWER') {
                    unfollows = result.value || 0;
                }
            });
        return {follows, unfollows};
    }), [{follows: 0, unfollows: 0}]);
};