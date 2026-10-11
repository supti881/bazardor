import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function getFirebaseAuth() {
  const requiredConfig = {
    NEXT_PUBLIC_FIREBASE_API_KEY: firebaseConfig.apiKey,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
    NEXT_PUBLIC_FIREBASE_APP_ID: firebaseConfig.appId,
  };
  const missingConfig = Object.entries(requiredConfig)
    .filter(([, value]) => !value?.trim())
    .map(([name]) => name);

  if (missingConfig.length > 0) {
    throw new Error(
      `Firebase কনফিগারেশন পাওয়া যায়নি। .env.local ফাইলে এই মানগুলো সেট করুন: ${missingConfig.join(", ")}।`
    );
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return getAuth(app);
}

export function getFirebaseAuthErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (typeof error === "object" && error !== null && "code" in error) {
    if (error.code === "auth/invalid-api-key") {
      return "Firebase API key invalid. Firebase Console → Project settings → Your apps থেকে এই project-এর সঠিক Web API key .env.local-এ বসান। API key-এর website restrictions-এ localhost এবং আপনার deployed domain allow করুন, তারপর dev server restart করুন।";
    }
    if (error.code === "auth/operation-not-allowed") {
      return "এই sign-in পদ্ধতিটি Firebase-এ চালু নেই। Firebase Console → Authentication → Sign-in method-এ Email/Password চালু করুন। Google বা GitHub দিয়ে সাইন ইন করলে সংশ্লিষ্ট provider-টিও চালু করুন।";
    }
  }

  return error instanceof Error ? error.message : fallback;
}