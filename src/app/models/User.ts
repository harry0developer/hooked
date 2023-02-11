
export interface User {
    uid: string;
    name: string;
    email: string;
    gender: string;
    dob: string;
    phone?: string;
    orientation: string;
    images: string[];
    profile_picture: string;
    isVerified: boolean;
    dateCreated?: string;
    location: {
        address: string;
        geo: {
            lat: number;
            lng: number
        }
    }
 }


 export interface Message {
    msg: string,
    createdAt: any,
    from: string;
    to: string;
 }

 export interface MessageObj {
    messages: Message[];
 }

 export interface Chat {
    senderUid: string;
    recieverUid: string;
    message: string;
    timestamp: any;
 }