import {  Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ROUTER_CONFIGURATION } from '@angular/router';
import { User } from 'src/app/models/User';
import { COLLECTION, ROUTES } from 'src/app/utils/const';
import { IonModal } from '@ionic/angular';
import { ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { Auth } from '@angular/fire/auth';
import { Camera,  CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { FirebaseService } from 'src/app/service/firebase.service';
var moment = require('moment'); // require


interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

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


 images: LocalFile[] = [];

 profilePicture: string;

 user: User;

 currentUser: any;

 uploadedImages: any;

 @ViewChild('modal') modal: IonModal;

  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private router: Router,
    public actionSheetController: ActionSheetController,
    private loadingCtrl:LoadingController,
    private alertCtrl: AlertController,
    private auth: Auth, 
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
      ]))
    });

  
  
    //Listern to image upload
    // import { doc, onSnapshot } from "firebase/firestore";

    // const userDocRef = doc(this.firestore, currentUser.uid)

  

    // this.uploadedImages = this.firebaseService.afs.collection(COLLECTION.images).valueChanges();
  }

  async uploadImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: source
    });
    
    if(image) {
      
      this.firebaseService.savePictureInFirebaseStorage(image).then(r => {
        console.log("Uploaded",r);
      })
      // const result = await this.chat.uploadImage(this.user, image);

      // this.user.images.push(`data:image/${image.format};base64,${image.base64String}`);
    }
  }
 
  async selectImageActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image",
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.uploadImage(CameraSource.Photos)
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.uploadImage(CameraSource.Camera)
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
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
      name: this.name,
      gender: this.gender,
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


		//create auth, for uid

    const loading = await this.loadingCtrl.create({message: "Creating account, please wait..."});
    await loading.present();
    const user = await this.firebaseService.register(this.email, this.password);
		if(!!user && user.user.uid) {
			this.user.uid = user.user.uid;
			this.firebaseService.addDocumentToFirebase(COLLECTION.users, this.user).then(res => {
				loading.dismiss();
				 this.modal.dismiss().then(() => this.router.navigateByUrl(ROUTES.USERS, {replaceUrl:true}));
			}).catch(err => {
				console.log(err);
				loading.dismiss();
			})
		} else {
			loading.dismiss();
			console.log("No user registered");
			this.showAlert("Could not create account", "Verfy that your email address is correctly formated")
		}
		
	} 
 
  async stepOne() {

    const loading = await this.loadingCtrl.create({message: "Checking email address..."});
    await loading.present();
    // const user = await this.firebaseService.register(this.email, this.password);
    //check if email is registered

    this.firebaseService.getAllUsers().then(res => {
      loading.dismiss();

      res.forEach(users => {
        const foundUser = users.filter(u => u.email == this.email)[0];
        if(foundUser) {
          this.showAlert("Email address already in use", "Please sign in, reset your password or create an account with a different email address" )
        } else {
					this.next();
        }
      })
    }).catch(err => {
      console.log(err);
    }) 
  }
 

  goToSignInPage() {
    this.modal.dismiss().then(() => this.router.navigate(['/signin']));
  }  

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header, message, buttons: ['Dismiss']
    })

    await alert.present();
  }
 
}
