import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canActivate, redirectLoggedInTo , redirectUnauthorizedTo} from '@angular/fire/auth-guard';
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['signin']);
const redirectLoggedInHome = () => redirectLoggedInTo(['tabs/users']);

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  }, 
  {
    path: 'signin',
    loadChildren: () => import('./pages/signin/signin.module').then( m => m.SigninPageModule),
    ...canActivate(redirectLoggedInHome)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule),
  },
  {
    path: 'chat/:uid',
    loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'verify-email',
    loadChildren: () => import('./verify-email/verify-email.module').then( m => m.VerifyEmailPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'intro',
    loadChildren: () => import('./pages/intro/intro.module').then( m => m.IntroPageModule),
    ...canActivate(redirectLoggedInHome)

  },
  {
    path: 'complete-profile',
    loadChildren: () => import('./pages/complete-profile/complete-profile.module').then( m => m.CompleteProfilePageModule),
    ...canActivate(redirectLoggedInHome)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
