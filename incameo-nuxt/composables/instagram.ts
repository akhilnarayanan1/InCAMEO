import type {InstagramData, UserInsightsDuration, DurationTypes, UserInsightsTotalValue, ModifiedUserInsightsTotalValue} from "@/assets/ts/types";
import { useIsCurrentUserLoaded } from "vuefire";
import { type User } from "firebase/auth";
import { doc, getDoc, type Firestore } from "firebase/firestore";
import _ from "lodash";

export const getAccessToken = async (userId: string, db: Firestore) => {
    let accessToken = "";
    if (useIsCurrentUserLoaded().value) {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().accessToken;
        }
    }
    return accessToken;
};

export const listAccounts = async (args: {user: User, db: Firestore} | {accessToken: string}) => {
    let accessToken = "";
    const urlWithoutAT = `https://graph.facebook.com/me/accounts?` +
        `fields=instagram_business_account,username,picture{height,width,url}&` +
        `access_token=`;

    if("accessToken" in args) {
        accessToken = args.accessToken;
    } else {
        const { user, db } = args;
        accessToken = await getAccessToken(user.uid, db).catch(error=>addToast({message: error, type: "error", duration: 3000}));
    }
    const url = urlWithoutAT + accessToken;

    return url;
};


export const accountDetails = async (args: {accountId: string} & ({user: User, db: Firestore} | {accessToken: string})) => {
    let accessToken = "";
    const {accountId} = args;
    const urlWithoutAT = `https://graph.facebook.com/${accountId}?` +
    `fields=biography,followers_count,follows_count,id,username,ig_id,name,profile_picture_url,media_count&` +
    `access_token=`;

    if(("accessToken" in args)) {
        accessToken = args.accessToken;
    } else {
        const { user, db } = args;
        accessToken = await getAccessToken(user.uid, db).catch(error=>addToast({message: error, type: "error", duration: 3000}));
    }
    const url = urlWithoutAT + accessToken;

    return url;
};

export const fetchUserInsightsTimeSeries = async (args: {accountId: string, since: number, until: number} & ({user: User, db: Firestore} | {accessToken: string})) => {
    let accessToken: string = "";
    if (("accessToken" in args)) {
        accessToken = args.accessToken;
    } else {
        const { user, db } = args;
        accessToken = await getAccessToken(user.uid, db).catch(error=>addToast({message: error, type: "error", duration: 3000}));
    };
    const {accountId, since, until} = args;

    const url1 = `https://graph.facebook.com/${accountId}/insights?` +
    `metric=impressions,reach&period=day&timeframe=&metric_type=time_series&breakdown=&` +
    `since=${since}&until=${until}&` +
    `access_token=${accessToken}`;

    return { url1 };
};

export const fetchUserInsightsTotalValue = async (args: {accountId: string, since: number, until: number} & ({user: User, db: Firestore} | {accessToken: string})) => {
    let accessToken: string = "";
    if (("accessToken" in args)) {
        accessToken = args.accessToken;
    } else {
        const { user, db } = args;
        accessToken = await getAccessToken(user.uid, db).catch(error=>addToast({message: error, type: "error", duration: 3000}));
    };
    const {accountId, since, until} = args;

    const url1 = `https://graph.facebook.com/${accountId}/insights?` +
    `metric=impressions,accounts_engaged,replies,website_clicks,profile_views&period=day&timeframe=&metric_type=total_value&breakdown=&` +
    `since=${since}&until=${until}&` +
    `access_token=${accessToken}`;

    const url2 = `https://graph.facebook.com/${accountId}/insights?` +
    `metric=reach,total_interactions,likes,comments,saves,shares&period=day&timeframe=&metric_type=total_value&breakdown=media_product_type&` +
    `since=${since}&until=${until}&` +
    `access_token=${accessToken}`;

    const url3 = `https://graph.facebook.com/${accountId}/insights?` +
    `metric=reach,follows_and_unfollows&period=day&timeframe=&metric_type=total_value&breakdown=follow_type&` +
    `since=${since}&until=${until}&` +
    `access_token=${accessToken}`;

    const url4 = `https://graph.facebook.com/${accountId}/insights?` +
    `metric=profile_links_taps&period=day&timeframe=&metric_type=total_value&breakdown=contact_button_type&` +
    `since=${since}&until=${until}&` +
    `access_token=${accessToken}`;

    return { url1, url2, url3, url4 };
};


export const searchInstagramAccount = async (args: {accountId: string, username: string} & ({user: User, db: Firestore} | {accessToken: string})) => {
    let accessToken = "";
    const {accountId, username} = args;
    const urlWithoutAT = `https://graph.facebook.com/${accountId}?` +
    `fields=business_discovery.username(${username}){followers_count,media_count,media{comments_count,like_count}}&` +
    `access_token=`;

    if(("accessToken" in args)) {
        accessToken = args.accessToken;
    } else {
        const { user, db } = args;
        accessToken = await getAccessToken(user.uid, db).catch(error=>addToast({message: error, type: "error", duration: 3000}));
    }
    const url = urlWithoutAT + accessToken;
    
    return url;
};
