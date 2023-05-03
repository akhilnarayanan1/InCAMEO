import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { indexedDBLocalPersistence, browserSessionPersistence, browserLocalPersistence, User } from "firebase/auth"
import { onAuthStateChanged, initializeAuth, signInAnonymously } from "firebase/auth"

export const useFirebase = () => {
    const config = useRuntimeConfig();
    const firebaseConfig = {
      apiKey: config.firebaseApiKey,
      authDomain: config.firebaseAuthDomain,
      projectId: config.firebaseProjectId,
      storageBucket: config.firebaseStorageBucket,
      messagingSenderId: config.firebaseMessagingSenderId,
      appId: config.firebaseAppId,
      measurementId: config.firebaseMeasurementId,
    };

    const $firebaseApp = initializeApp(firebaseConfig)
    const $firestore = getFirestore($firebaseApp)
    const $firebaseAuth = initializeAuth($firebaseApp, {
      persistence: [indexedDBLocalPersistence, browserSessionPersistence, browserLocalPersistence],
    });

    return {
      $firestore,
      $firebaseAuth
    }
}


export const firebaseUser = () => useState<User>("firebaseUser")
export const isUserLoading = () => useState("isUserLoading", () => true)

export const getOrCreateFirebaseUser = () => {
  onMounted(()=>{
    const { $firebaseAuth } = useFirebase()
    onAuthStateChanged($firebaseAuth, (currentUser) => {
      if (currentUser) {
        firebaseUser().value = currentUser
        isUserLoading().value = false
      } else {
        signInAnonymously($firebaseAuth).catch(err=>console.log(err))
        isUserLoading().value = false
      }
    })
  })
}
