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

@Component({
  selector: 'app-phone-modal',
  templateUrl: './phone-modal.page.html',
  styleUrls: ['./phone-modal.page.scss'],
})
export class PhoneModalPage implements OnInit {

  validations_form: FormGroup;
  phone_number_form: FormGroup;
  signin_form: FormGroup;
  errorMessage: string = '';
  activeStep: number = 0;

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
     { type: 'required', message: 'Email is required.' }
    ]
  };
   
  
  country: Country = {
    name: "South Africa",
    flag: "🇿🇦",
    code: "ZA",
    dialCode: "+27"
  };
 
  selectedCountryCode: string;
  currentUser: any;
  countries: Observable<any>;
  code: string;

  applicationVerifier: any;
  windowRef: any;
  verificationCode: string;
  users: User[] = [];


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

 
  ngOnInit() {    
    this.selectedCountryCode = "+27";
    this.phone_number_form = this.formBuilder.group({
      phone: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      code: new FormControl('', Validators.compose([
        Validators.required,
      ]))

    });
  }

  ionViewDidLoad() {

    // this.dataProvider.getAllFromCollection(COLLECTION.users).pipe(take(1)).subscribe(users => {
    //   this.users = users;
    // });

    // if (this.authProvider.isLoggedIn() && this.authProvider.getStoredUser()) {
    //   this.navigate(this.authProvider.getStoredUser());
    // } else {
      this.windowRef = this.win.windowRef
      // this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      //   'size': 'invisible'
      // });

      if (this.windowRef && this.windowRef.recaptchaVerifier) {
        this.windowRef.recaptchaVerifier.render().then(widgetId => {
          this.windowRef.recaptchaWidgetId = widgetId;
        }).catch(err => {
          console.log(err);
        });
      } else {
        console.log('reCapture error');

      }
    // }

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

  

  async signin() {
     
  } 

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header, message, buttons: ['Dismiss']
    })

    await alert.present();
  }

  cancel() {
    // this.router.navigateByUrl(ROUTES.SIGNIN, {replaceUrl: true})
    this.modalCtrl.dismiss();
  }  
 

 async getCountryCode() {
    
  }

  handleChange(e) {
    console.log("Event ", e);
    this.selectedCountryCode = e.detail.value
    
  }
}
