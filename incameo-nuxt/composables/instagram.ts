import {type InstagramData} from "@/assets/ts/types";
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
}

export const listAccounts = async (user: User, db: Firestore) => {
    const accessToken = await getAccessToken(user.uid, db).catch(error=>addToast({message: error, type: "error", duration: 3000}));
    const url = `https://graph.facebook.com/me/accounts?` +
    `fields=instagram_business_account,username,picture{height,width,url}&` +
    `access_token=${accessToken}`;
    return await useLazyFetch(url, {server: false});
};


export const accountDetails = async (user: User, db: Firestore, accountId: string) => {
    const accessToken = await getAccessToken(user.uid, db).catch(error=>addToast({message: error, type: "error", duration: 3000}));
    const url = `https://graph.facebook.com/${accountId}?` +
    `fields=biography,followers_count,follows_count,id,username,ig_id,name,profile_picture_url&` +
    `access_token=${accessToken}`;
    return await useLazyFetch(url, {server: false});
};
