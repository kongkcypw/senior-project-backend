export enum WebhookEventType {
    MESSAGE = 'message',
    UNSEND = 'unsend', // When a user unsends a sent message
    FOLLOW = 'follow',
    UNFOLLOW = 'unfollow',
    JOIN = 'join', // Event object for when your LINE Official Account joins a group chat or multi-person chat
    LEAVE = 'leave', // Event object for when a user removes your LINE Official Account from a group chat or multi-person chat.
    MEMBER_JOINED = 'memberJoined', // Event object for when a user joins a group chat or multi-person chat that the LINE Official Account is in.
    MEMBER_LEAVED = 'memberLeft', // Event object for when a user leaves a group chat or multi-person chat that the LINE Official Account is in.
    POSTBACK = 'postback',
    VIDEO_VIEW_COMPLETED = 'videoPlayComplete',
    BEACON = 'beacon',
    ACCOUNT_LINK = 'accountLink',
    MEMBERSHIP = 'membership',
}