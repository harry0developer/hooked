import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs'; 
import { DataService } from 'src/app/service/data.service';
import { FirebaseService } from 'src/app/service/firebase.service';
import { CountryCodeModalModalPage } from '../country-code-modal/country-code-modal.page';
import { WindowProvider } from 'src/app/service/window.service';
import { Country, User } from 'src/app/models/models';
import { getAuth, RecaptchaVerifier } from '@angular/fire/auth';
import { COLLECTION, STORAGE } from 'src/app/utils/const';
import { SignupPhoneModalPage } from '../signup-phone-modal/signup-phone-modal.page';

 
@Component({
  selector: 'app-phone-modal',
  templateUrl: './phone-modal.page.html',
  styleUrls: ['./phone-modal.page.scss'],
})
export class PhoneModalPage implements OnInit {

  validations_form: FormGroup;
  phone_number_form: FormGroup;
  otp_code_form: FormGroup;
  signin_form: FormGroup;
  errorMessage: string = '';
  activeStep: number = 0;
 
  selectedCountryCode: string;
  currentUser: any;
  countries: Observable<any>;
  code: string;

  applicationVerifier: any;
  windowRef: any;
  verificationCode: string;
  users: User[] = [];
  OTPCodeActive: boolean = false;

  phoneNumber: string;
  phoneNumberWithSpaces: string;

  appVerifier;

  user;

  isLoading: boolean = false;

  
  validation_messages = {
    'email': [
     { type: 'required', message: 'Email is required.' },
     { type: 'pattern', message: 'Please enter a valid email.' }
   ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 6 characters long.' }
    ]
  };

  phone_number_validation = {
    'phone': [
     { type: 'required', message: 'Phone number is required.' },
     { type: 'minlength', message: 'Phone number must be at least 9 characters long.' }
    ]
  };

  otp_validation = {
    'otp': [
     { type: 'required', message: 'OTP Code is required.' },
     { type: 'minlength', message: 'OTP code must be 6 characters long.' }
    ]
  };
   
  country: Country = {
    name: "South Africa",
    flag: "🇿🇦",
    code: "ZA",
    dialCode: "+27"
  };

  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private router: Router,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    public actionSheetController: ActionSheetController,
    private loadingCtrl:LoadingController,
    private dataService: DataService,
    private win: WindowProvider
  ) { } 

  get phone() {
    return this.phone_number_form.get('phone')?.value;
  } 
  get otp() {
    return this.otp_code_form.get('otp')?.value;
  } 

  ngOnInit() {    
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new RecaptchaVerifier( 
      'recaptcha-container', {
        'size': 'invisible'
      },
      getAuth()
    );
    this.windowRef.recaptchaVerifier.render();
  

    this.selectedCountryCode = "+27";
    this.phone_number_form = this.formBuilder.group({
      phone: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(11),
      ])),
      code: new FormControl('', Validators.compose([
        Validators.required
      ]))

    });

    this.otp_code_form = this.formBuilder.group({
      otp: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(11),
      ]))
    });
  } 

  async signin() {
    const appVerifier = this.windowRef.recaptchaVerifier;
    
    this.phoneNumber = (this.selectedCountryCode.trim()+this.phone.trim()).replace(/\s+/g, '');
    this.phoneNumberWithSpaces = this.selectedCountryCode+this.phone;
    
    this.firebaseService.signInWithPhoneNumber(this.phoneNumber, appVerifier).then(res => {
      this.windowRef.confirmationResult = res;
      this.OTPCodeActive = true;
    }).catch(() => {
      this.showAlert("Create account failed", "Something went wrong while creating account");
    })
  } 

  verifyLoginCode() {
    this.isLoading = true;
    const otp = this.otp.trim().replace(/\s+/g, '');
    this.windowRef.confirmationResult.confirm(otp).then((result) => {
      this.addUserIntoFirestore(result.user);
      this.isLoading = false;
    }).catch(() => {
      this.showAlert("Incorrect OTP", "The verification code entered is incorrect");
      this.isLoading = false;
    });
  }

  
  private async addUserIntoFirestore(user: any) {
    const loading = await this.loadingCtrl.create({message: "Setting you up, please wait..."});
    await loading.present();

    this.firebaseService.createAccountWithMobile(COLLECTION.USERS, user).then(u => {
      loading.dismiss();    
      const data: User = {
        uid: user.uid,
        phone: user.phoneNumber,
        name: "",
        email: "",
        password: "",
        gender: "",
        want: [],
        with: [],
        dob: "",
        orientation: "",
        images: [],
        profile_picture: "",
        isVerified: true, 
        location: {
            distance: "",
            geo: {
              lat: 0,
              lng: 0
            }
        }
      }; 
      
      this.firebaseService.setStorage(STORAGE.USER, data);
      this.modalCtrl.dismiss().then(() => {
        this.openCreateAccountModal();
      });
    }).catch(err => {
      loading.dismiss();
      this.showAlert("Create account", "Something went wrong while creating account");
    })
  }

  private async openCreateAccountModal() {
    const modal = await this.modalCtrl.create({
      component: SignupPhoneModalPage,
      initialBreakpoint: 0.8,
      breakpoints: [0, 0.8],
      backdropBreakpoint: 0,
      backdropDismiss: false
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      console.log("confirmed");
    }
  }

  resendOTPCode() {
    console.log("Reset otp code");
  }

  async openCountryCodeModal() {
    const modal = await this.modalCtrl.create({
      component: CountryCodeModalModalPage,
      componentProps: {
        "code": this.code
      }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'save') {
      console.log("applied", data);
      this.selectedCountryCode = data.dial_code;
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header, message, buttons: ['Dismiss']
    })
    await alert.present();
  }

  cancel() {
    this.modalCtrl.dismiss();
  }  
 
  handleChange(e) {
    console.log("Event ", e);
    this.selectedCountryCode = e.detail.value
    
  }
}
