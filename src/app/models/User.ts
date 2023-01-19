export interface User {
    id?: string;
    uid: string;
    email: string;
    phone: string;
    name: string;
    dob: string;
    gender: string;
    images: string[],
    location: {
        address: string;
        geo: {
            lat: number;
            lng: number;
        }
    },
    dateCreated: string;
}
 