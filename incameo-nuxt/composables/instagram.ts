import type {InstagramData, UserInsightsDuration, DurationTypes} from "@/assets/ts/types";
import { useIsCurrentUserLoaded } from "vuefire";
import { type User } from "firebase/auth";
import { doc, getDoc, type Firestore } from "firebase/firestore";

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
    return urlWithoutAT + accessToken;
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
    return urlWithoutAT + accessToken;
};

export const epochSinchUntil = (timerangeStr: UserInsightsDuration | DurationTypes) => {
  let since: number;
  let until: number = Math.floor(Date.now() / 1000);
  switch (timerangeStr) {
    case "last_1_day":
      since = calculateSinceForLast1Day();
        break;
    case "last_2_day": 
      since = calculateSinceForLast2Days();
        break;
    case "last_7_days": 
      since = calculateSinceForLast7Days();
        break;
    case 'this_week':
      since = calculateSinceForThisWeek();
    case 'this_month':
      since = calculateSinceForThisMonth();
      break;
    case 'last_30_days':
      since = calculateSinceForLast30Days();
      break;
    case 'last_14_days':
      since = calculateSinceForLast14Days();
      break;
    case 'last_90_days':
      since = calculateSinceForLast90Days();
      break;
    case 'prev_month':
      since = calculateSinceForPreviousMonth();
      break;
    default:
      throw new Error('Invalid timerangeStr');
  }
  return { since, until };
};

  function calculateSinceForLast1Day(): number {
    const today = new Date();
    const last1Day = new Date(today.setDate(today.getDate() - 1));
    return Math.floor(last1Day.getTime() / 1000); // Convert to seconds and return the epoch
  }
  function calculateSinceForLast2Days(): number {
    const today = new Date();
    const last2Day = new Date(today.setDate(today.getDate() - 2));
    return Math.floor(last2Day.getTime() / 1000); // Convert to seconds and return the epoch
  }
  function calculateSinceForLast7Days(): number {
    const today = new Date();
    const last7Day = new Date(today.setDate(today.getDate() - 7));
    return Math.floor(last7Day.getTime() / 1000); // Convert to seconds and return the epoch
  }

  function calculateSinceForThisWeek(): number {
    const today = new Date();
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Get first day of the current week
    return Math.floor(firstDayOfWeek.getTime() / 1000); // Convert to seconds and return the epoch
  }
  function calculateSinceForThisMonth(): number {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return Math.floor(firstDayOfMonth.getTime() / 1000); // Convert to seconds and return the epoch
  }
  function calculateSinceForLast30Days(): number {
    const today = new Date();
    const last30Days = new Date(today.setDate(today.getDate() - 30));
    return Math.floor(last30Days.getTime() / 1000); // Convert to seconds and return the epoch
  }
  function calculateSinceForLast14Days(): number {
    const today = new Date();
    const last14Days = new Date(today.setDate(today.getDate() - 14));
    return Math.floor(last14Days.getTime() / 1000); // Convert to seconds and return the epoch
  }
  function calculateSinceForLast90Days(): number {
    const today = new Date();
    const last90Days = new Date(today.setDate(today.getDate() - 90));
    return Math.floor(last90Days.getTime() / 1000); // Convert to seconds and return the epoch
  }
  function calculateSinceForPreviousMonth(): number {
    const today = new Date();
    const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfPreviousMonth = new Date(firstDayOfCurrentMonth.setDate(firstDayOfCurrentMonth.getDate() - 1));
    const firstDayOfPreviousMonth = new Date(lastDayOfPreviousMonth.getFullYear(), lastDayOfPreviousMonth.getMonth(), 1);
    return Math.floor(firstDayOfPreviousMonth.getTime() / 1000); // Convert to seconds and return the epoch
  }

export const fetchUserInsights = async (args: {accountId: string, since: number, until: number} & ({user: User, db: Firestore} | {accessToken: string})) => {
    let accessToken: string = "";
    if (!("accessToken" in args)) {
        const { user, db } = args;
        getAccessToken(user.uid, db)
        .then((processedAccessToken: string)=>{
            accessToken = processedAccessToken;
        })
        .catch(error=>addToast({message: error, type: "error", duration: 3000}));
    } else {
        accessToken = args.accessToken;
    };
    const {accountId, since, until} = args;

    const url1 = `https://graph.facebook.com/${accountId}/insights?` +
    `metric=impressions,reach&period=day&timeframe=&metric_type=time_series&breakdown=&` +
    // `since=${since}&until=${until}&` +
    `access_token=${accessToken}`;

    const url2 = `https://graph.facebook.com/${accountId}/insights?` +
    `metric=impressions,accounts_engaged,replies,website_clicks,profile_views&period=day&timeframe=&metric_type=total_value&breakdown=&` +
    `since=${since}&until=${until}&` +
    `access_token=${accessToken}`;

    const url3 = `https://graph.facebook.com/${accountId}/insights?` +
    `metric=reach,total_interactions,likes,comments,saves,shares&period=day&timeframe=&metric_type=total_value&breakdown=media_product_type&` +
    `since=${since}&until=${until}&` +
    `access_token=${accessToken}`;

    const url4 = `https://graph.facebook.com/${accountId}/insights?` +
    `metric=reach,follows_and_unfollows&period=day&timeframe=&metric_type=total_value&breakdown=follow_type&` +
    `since=${since}&until=${until}&` +
    `access_token=${accessToken}`;

    const url5 = `https://graph.facebook.com/${accountId}/insights?` +
    `metric=profile_links_taps&period=day&timeframe=&metric_type=total_value&breakdown=contact_button_type&` +
    `since=${since}&until=${until}&` +
    `access_token=${accessToken}`;

    const { data, pending, error, execute, refresh, status } = await useAsyncData(async () => {
        const [resp1, resp2, resp3, resp4, resp5] = await Promise.all([
            $fetch(url1), $fetch(url2), $fetch(url3), $fetch(url3), $fetch(url5)
        ]);
        return {resp1, resp2, resp3, resp4, resp5};
    });
    return { data, pending, error, execute, refresh, status } ;
};

export const fetchUserInsights_1 = (args: {accountId: string} & ({user: User, db: Firestore} | {accessToken: string})) => {
    /*
        Metric Type = Time Series
        Breakdown = None
        Metrics = impressions, reach
    */
    let accessToken: string = "";
    if (!("accessToken" in args)) {
        const { user, db } = args;
        getAccessToken(user.uid, db)
        .then((processedAccessToken: string)=>{
            accessToken = processedAccessToken;
        })
        .catch(error=>addToast({message: error, type: "error", duration: 3000}));
    } else {
        accessToken = args.accessToken;
    };
    const {accountId} = args;
    const url = `https://graph.facebook.com/${accountId}/insights?` +
    `metric=impressions,reach&period=day&timeframe=&metric_type=time_series&breakdown=&` +
    `access_token=${accessToken}`;
    return useFetch(url, {server: false, lazy: true});
};


export const fetchUserInsights_2 = (args: {accountId: string} & ({user: User, db: Firestore} | {accessToken: string})) => {
    /*
        Metric Type = Total Value
        Breakdown = None
        Metrics = impressions, accounts_engaged, replies, website_clicks, profile_views
    */
    let accessToken: string = "";
    if (!("accessToken" in args)) {
        const { user, db } = args;
        getAccessToken(user.uid, db)
        .then((processedAccessToken: string)=>{
            accessToken = processedAccessToken;
        })
        .catch(error=>addToast({message: error, type: "error", duration: 3000}));
    } else {
        accessToken = args.accessToken;
    };
    const {accountId} = args;
    const url = `https://graph.facebook.com/${accountId}/insights?` +
    `metric=impressions,accounts_engaged,replies,website_clicks,profile_views&period=day&timeframe=&metric_type=total_value&breakdown=&` +
    `access_token=${accessToken}`;
    return useFetch(url, {server: false, lazy: true});
};


export const fetchUserInsights_3 = (args: {accountId: string} & ({user: User, db: Firestore} | {accessToken: string})) => {
    /*
        Metric Type = Total Value
        Breakdown = media_product_type
        Metrics = impreach, total_interactions, likes, comments, saves, shares
    */
    let accessToken: string = "";
    if (!("accessToken" in args)) {
        const { user, db } = args;
        getAccessToken(user.uid, db)
        .then((processedAccessToken: string)=>{
            accessToken = processedAccessToken;
        })
        .catch(error=>addToast({message: error, type: "error", duration: 3000}));
    } else {
        accessToken = args.accessToken;
    };
    const {accountId} = args;
    const url = `https://graph.facebook.com/${accountId}/insights?` +
    `metric=reach,total_interactions,likes,comments,saves,shares&period=day&timeframe=&metric_type=total_value&breakdown=media_product_type&` +
    `access_token=${accessToken}`;
    return useFetch(url, {server: false, lazy: true});
};

export const fetchUserInsights_4 = (args: {accountId: string} & ({user: User, db: Firestore} | {accessToken: string})) => {
    /*
        Metric Type = Total Value
        Breakdown = follow_type
        Metrics = reach, follows_and_unfollows
    */
    let accessToken: string = "";
    if (!("accessToken" in args)) {
        const { user, db } = args;
        getAccessToken(user.uid, db)
        .then((processedAccessToken: string)=>{
            accessToken = processedAccessToken;
        })
        .catch(error=>addToast({message: error, type: "error", duration: 3000}));
    } else {
        accessToken = args.accessToken;
    };
    const {accountId} = args;
    const url = `https://graph.facebook.com/${accountId}/insights?` +
    `metric=reach,follows_and_unfollows&period=day&timeframe=&metric_type=total_value&breakdown=follow_type&` +
    `access_token=${accessToken}`;
    return useFetch(url, {server: false, lazy: true});
};


export const fetchUserInsights_5 = (args: {accountId: string} & ({user: User, db: Firestore} | {accessToken: string})) => {
    /*
        Metric Type = Total Value
        Breakdown = contact_button_type
        Metrics = profile_links_taps
    */
    let accessToken: string = "";
    if (!("accessToken" in args)) {
        const { user, db } = args;
        getAccessToken(user.uid, db)
        .then((processedAccessToken: string)=>{
            accessToken = processedAccessToken;
        })
        .catch(error=>addToast({message: error, type: "error", duration: 3000}));
    } else {
        accessToken = args.accessToken;
    };
    const {accountId} = args;
    const url = `https://graph.facebook.com/${accountId}/insights?` +
    `metric=profile_links_taps&period=day&timeframe=&metric_type=total_value&breakdown=contact_button_type&` +
    `access_token=${accessToken}`;
    return useFetch(url, {server: false, lazy: true});
};
