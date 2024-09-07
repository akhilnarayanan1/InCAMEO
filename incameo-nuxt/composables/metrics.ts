import type { InstagramDiscovery } from "@/assets/ts/types";
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