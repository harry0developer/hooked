
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