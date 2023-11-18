import {type InstagramData} from "@/assets/ts/types";

export const listAccounts = async ({url, accessToken}: { url?: string, accessToken?: string }) => {
    url = url ? url : ""
    if (accessToken) {
        url = `https://graph.facebook.com/me/accounts?` +
        `fields=instagram_business_account,username,picture{height,width,url}&` +
        `access_token=${accessToken}`;
    }

    return await useLazyFetch(url, {server: false});
};