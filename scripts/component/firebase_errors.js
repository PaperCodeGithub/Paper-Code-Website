export const errorMessages = {
  'auth/invalid-email':            "Invalid email format. Please check your email.",
  'auth/user-disabled':            "This user account has been disabled.",
  'auth/user-not-found':           "No user found with this email. Please register.",
  'auth/wrong-password':           "Incorrect password. Please try again.",
  'auth/email-already-in-use':     "This email is already registered. Please login or use a different email.",
  'auth/operation-not-allowed':    "Operation not allowed. Please enable the sign-in method in Firebase Console.",
  'auth/weak-password':            "Weak password. Please use a stronger password.",
  'auth/invalid-credential':       "Invalid credentials. Please check and try again.",
  'auth/too-many-requests':        "Too many login attempts. Please try again later.",
  'auth/network-request-failed':   "Network error. Please check your connection.",
  'auth/requires-recent-login':    "Recent login required. Please sign in again before retrying.",
  'auth/app-not-authorized':       "This app is not authorized to use Firebase Auth with this API key.",
  'auth/invalid-verification-code':"Invalid verification code. Please retry.",
  'auth/invalid-verification-id':  "Invalid verification ID.",
  'auth/invalid-persistence-type': "Invalid persistence type. Must be 'local', 'session', or 'none'.",
  'auth/unsupported-persistence-type': "This browser does not support the specified persistence.",
  'auth/unauthorized-domain':      "Domain not authorized for authentication. Add it in Firebase Console.",
  'auth/invalid-action-code':      "This action code is invalid or expired.",
  'auth/expired-action-code':      "Action code has expired. Please request a new one.",
  'auth/captcha-check-failed':     "Captcha verification failed. Try again.",
  'auth/code-expired':             "SMS code has expired. Please resend the code.",
  'auth/invalid-phone-number':     "Invalid phone number format.",
  'auth/missing-phone-number':     "Phone number is required.",
  'auth/missing-verification-code':"Verification code is missing.",
  'auth/missing-verification-id':  "Verification ID is missing.",
  'auth/session-cookie-expired':   "Session cookie expired. Please sign in again.",
  'auth/internal-error':           "An internal error occurred. Please try again later.",
  'auth/no-such-provider':         "No such sign-in provider is associated with this account.",
  'auth/account-exists-with-different-credential':
      "An account already exists with the same email but different sign-in credentials.",
  'auth/invalid-oauth-provider':   "Unsupported OAuth provider.",
  'auth/popup-blocked':            "Popup was blocked by the browser.",
  'auth/popup-closed-by-user':     "Popup was closed before completing sign-in.",
  'auth/user-token-expired':       "User credential expired. Please sign in again.",
  'auth/null-user':                "No user is signed in.",
};


export function getAuthErrorMessage(code, fallback) {
  return errorMessages[code] || fallback || "Something went wrong.";
}
