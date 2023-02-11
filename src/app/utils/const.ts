export const COLLECTION = {
    users: 'users',
    ratings: 'ratings',
    views: 'views',
    images: 'images',
    countries: 'countries',
    appInfo: 'appInfo',
    chats: 'chats'
}

export const AUTH_TYPE = {
    google: 'google',
    email: 'email',
    phone: 'phone',
    apple: 'apple',
}

export const FIREBASE_ERROR = {

    EMAIL_ALREADY_REGISTERED: "The email address is already in use",
    PASSWORD_TOO_SHORT: "Password should be at least 6 characters",
    GENERIC_SIGNINP: "An error has occured while creating an account, please try again",
    VERIFICATION: "An error has occured while sending a veification email, please try again",
    GENERIC_STORE_DATA: "An error has occured while storing data, please try again.",
    SIGNIN_USER_NOT_FOUND: {key: "auth/user-not-found", value: "User not found, please check if your email address is correct or create account"},
    SIGNIN_INCORRECT_PASSWORD: {key: 'auth/wrong-password', value: "Invalid username or password"},
    SINGIN_GENERIC: "Something went wrong, please try again",
    SIGNI_BLOCKED: {
        key: "Access to this account has been temporarily disabled due to many failed login attempts",
        value: "Access to this account has been temporarily disabled due to many failed login attempts, You can immediately restore it by resetting your password or you can try again later"
    }
    
}

export const STATUS = {
    SUCCESS: 'success',
    FAILED: 'failed'
}
export const ROUTES = {
    SIGNIN: "signin",
    SIGNUP: "signup",
    USERS: "tabs/users",
    CHATS: "tabs/chats",
    PROFILE: "tabs/profile",
}


export const STORAGE = {
    USER: 'user',
    FIREBASE_USER: "firebase-user",
    INCOMPLETE_PROFILE: "incomplete-profile",
    SEEN_INTRO: 'seen-intro'
    
}
