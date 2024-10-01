// ErrorMessages.ts
export const getFriendlyErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "This email is already in use. Please try logging in.";
    case "auth/email-already-exists":
      return "This email is already in use by an existing user. Please try logging in.";
    case "auth/invalid-email":
      return "The email address is not valid. Please check and try again.";
    case "auth/invalid-email-verified":
      return "The email verification status is invalid. Please try again.";
    case "auth/invalid-claims":
      return "There was an issue with your account permissions. Please contact support.";
    case "auth/claims-too-large":
      return "Your account has too many permissions. Please contact support.";
    case "auth/invalid-argument":
      return "Invalid input provided. Please check your data and try again.";
    case "auth/invalid-continue-uri":
      return "The redirect URL is invalid. Please try again.";
    case "auth/invalid-creation-time":
      return "The account creation time is invalid. Please try again.";
    case "auth/invalid-credential":
      return "Invalid authentication credentials. Please try again.";
    case "auth/invalid-disabled-field":
      return "The disabled field value is invalid. Please try again.";
    case "auth/invalid-display-name":
      return "The display name provided is invalid. Please try again.";
    case "auth/invalid-dynamic-link-domain":
      return "The dynamic link domain is not authorized. Please contact support.";
    case "auth/invalid-hash-algorithm":
      return "The hash algorithm is not supported. Please contact support.";
    case "auth/invalid-hash-block-size":
      return "The hash block size is invalid. Please contact support.";
    case "auth/invalid-hash-derived-key-length":
      return "The hash key length is invalid. Please contact support.";
    case "auth/invalid-hash-key":
      return "The hash key provided is invalid. Please contact support.";
    case "auth/invalid-hash-memory-cost":
      return "The hash memory cost is invalid. Please contact support.";
    case "auth/invalid-hash-parallelization":
      return "The hash parallelization is invalid. Please contact support.";
    case "auth/invalid-hash-rounds":
      return "The number of hash rounds is invalid. Please contact support.";
    case "auth/invalid-hash-salt-separator":
      return "The hash salt separator is invalid. Please contact support.";
    case "auth/invalid-id-token":
      return "The ID token provided is invalid. Please sign in again.";
    case "auth/id-token-expired":
      return "Your session has expired. Please sign in again.";
    case "auth/id-token-revoked":
      return "Your session has been revoked. Please sign in again.";
    case "auth/invalid-last-sign-in-time":
      return "The last sign-in time is invalid. Please try again.";
    case "auth/invalid-page-token":
      return "The page token provided is invalid. Please try again.";
    case "auth/invalid-password":
      return "The password must be at least six characters long. Please try again.";
    case "auth/invalid-password-hash":
      return "The password hash is invalid. Please contact support.";
    case "auth/invalid-password-salt":
      return "The password salt is invalid. Please contact support.";
    case "auth/invalid-phone-number":
      return "The phone number provided is invalid. Please check and try again.";
    case "auth/invalid-photo-url":
      return "The photo URL provided is invalid. Please try again.";
    case "auth/invalid-provider-data":
      return "The provider data is invalid. Please contact support.";
    case "auth/invalid-provider-id":
      return "The provider ID is invalid. Please try again.";
    case "auth/invalid-oauth-responsetype":
      return "Only one OAuth response type must be set. Please try again.";
    case "auth/invalid-session-cookie-duration":
      return "The session duration is invalid. Please try again.";
    case "auth/invalid-uid":
      return "The UID provided is invalid. Please try again.";
    case "auth/invalid-user-import":
      return "The user record provided is invalid. Please contact support.";
    case "auth/maximum-user-count-exceeded":
      return "The maximum number of users has been exceeded. Please try again later.";
    case "auth/missing-android-pkg-name":
      return "The Android package name is missing. Please try again.";
    case "auth/missing-continue-uri":
      return "The redirect URL is missing. Please try again.";
    case "auth/missing-hash-algorithm":
      return "The hash algorithm is missing. Please contact support.";
    case "auth/missing-ios-bundle-id":
      return "The iOS bundle ID is missing. Please try again.";
    case "auth/missing-uid":
      return "The UID is missing. Please try again.";
    case "auth/missing-oauth-client-secret":
      return "The OAuth client secret is missing. Please contact support.";
    case "auth/operation-not-allowed":
      return "This sign-in method is disabled. Please contact support.";
    case "auth/phone-number-already-exists":
      return "This phone number is already in use. Please try logging in.";
    case "auth/project-not-found":
      return "Firebase project not found. Please contact support.";
    case "auth/reserved-claims":
      return "One or more custom claims are reserved. Please contact support.";
    case "auth/session-cookie-expired":
      return "Your session has expired. Please sign in again.";
    case "auth/session-cookie-revoked":
      return "Your session has been revoked. Please sign in again.";
    case "auth/too-many-requests":
      return "Too many requests. Please try again later.";
    case "auth/uid-already-exists":
      return "This UID is already in use. Please try logging in.";
    case "auth/unauthorized-continue-uri":
      return "The redirect URL is not authorized. Please contact support.";
    case "auth/user-not-found":
      return "No user found with the provided credentials. Please sign up.";
    case "auth/internal-error":
      return "An internal error occurred. Please try again later.";
    case "auth/insufficient-permission":
      return "You do not have the necessary permissions. Please contact support.";

    case "auth/weak-password":
      return "The password is too weak.";
    case "auth/popup-closed-by-user":
      return "The popup was closed before completing the sign in. Please try again.";
    case "auth/cancelled-popup-request":
      return "Popup request was cancelled. Please try again.";
    case "auth/popup-blocked":
      return "Popup was blocked by the browser. Please allow popups and try again.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection and try again.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
};
