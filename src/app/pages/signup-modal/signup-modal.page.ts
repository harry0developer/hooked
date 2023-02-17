import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { map } from 'rxjs';
import { User } from 'src/app/models/User';
import { FirebaseService } from 'src/app/service/firebase.service';
import { COLLECTION, ROUTES } from 'src/app/utils/const';

@Component({
  selector: 'app-signup-modal',
  templateUrl: './signup-modal.page.html',
  styleUrls: ['./signup-modal.page.scss'],
})
export class SignupModalPage implements OnInit {

  validations_form: FormGroup;
  signup_form: FormGroup;
  errorMessage: string = '';
  activeStep: number = 0;

  validation_messages = {
    'name': [
      { type: 'required', message: 'Name is required.' },
      { type: 'minlength', message: 'Name must be at least 4 characters long.' }
    ],
    'email': [
     { type: 'required', message: 'Email is required.' },
     { type: 'pattern', message: 'Please enter a valid email.' }
   ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 6 characters long.' }
    ]
  };
 
  
  profilePicture: string;
  user: User;
  currentUser: any;
  uploadedImages: any;


  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private router: Router,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    public actionSheetController: ActionSheetController,
    private loadingCtrl:LoadingController,
  ) { } 

  get email() {
    return this.validations_form.get('email')?.value;
  }

  get password() {
    return this.validations_form.get('password')?.value;
  }

  get dob() {
    return this.signup_form.get('dob')?.value;
  }

  get gender() {
    return this.signup_form.get('gender')?.value;
  }
  get orientation() {
    return this.signup_form.get('orientation')?.value;
  }
  get name() {
    return this.signup_form.get('name')?.value;
  }
  get want() {
    return this.signup_form.get('want')?.value;
  }
  get with() {
    return this.signup_form.get('with')?.value;
  }
 

  ngOnInit() {    
 
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
    });

    this.signup_form = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(4)
      ])),
      gender: new FormControl('', Validators.compose([
        Validators.required
      ])), 
      dob: new FormControl('', Validators.compose([
        Validators.required
      ])),
      orientation: new FormControl('', Validators.compose([
        Validators.required
      ])),
      want: new FormControl('', Validators.compose([
        Validators.required
      ])),
      with: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
  }



  back() {
    if(this.activeStep > 0) {
      --this.activeStep;
    }
  }

	next() {
		++this.activeStep;
	}
 
	async createAccount() { 

		this.user  = { 
      uid: "",
      email: this.email,
      name: this.firebaseService.capitalize(this.name),
      gender: this.gender,
      want: this.want,
      with: this.with,
      dob: this.dob,
      orientation: this.orientation,
      profile_picture: "",
      images: [],
	  	password: this.password,
      isVerified: false,
      location: {
        distance: "",
        geo: {
          lat: 0,
          lng: 0
        }
      }
    }; 

    const loading = await this.loadingCtrl.create({message: "Creating account, please wait..."});
    await loading.present();
    console.log(this.user);
    
    const user = await this.firebaseService.register(this.email, this.password);
		if(!!user && user.user.uid) {
			this.user.uid = user.user.uid;
			this.firebaseService.addDocumentToFirebase(COLLECTION.users, this.user).then(res => {
				loading.dismiss();
				this.modalCtrl.dismiss().then(() => this.router.navigateByUrl(ROUTES.PROFILE, {replaceUrl:true}));
			}).catch(err => {
				console.log(err);
				loading.dismiss();
			})
		} else {
			loading.dismiss();
			console.log("No user registered");
			this.showAlert("Could not create account", "Check that your email address is correctly formated")
		}
		
	} 
 
  async stepOne() { 
    const loading = await this.loadingCtrl.create({message: "Checkng email.."});
    await loading.present();

    const user = await this.firebaseService.queryUsers(this.email);

    console.log("FOund ", user);
    
    await loading.dismiss();
    if(user && user.length > 0) {
      this.showAlert("Email address already in use", "Please sign in, reset password or create an account with a different email address");
    } else {
      this.next();
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header, message, buttons: ['Dismiss']
    })

    await alert.present();
  }

  goToSignInPage() {
    this.router.navigateByUrl(ROUTES.SIGNIN, {replaceUrl: true})
  }  

 

}
