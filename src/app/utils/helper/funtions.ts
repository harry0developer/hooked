import { User } from "src/app/models/User";
var moment = require('moment'); // require

export default class Methods {
    static getUserAge(user: User) : string{
        return  moment().diff(user.dob, 'years');
    }

    static getSendDate(milisec: string) : string{
        return moment(new Date(milisec), "YYYYMMDD").fromNow();
    }
}