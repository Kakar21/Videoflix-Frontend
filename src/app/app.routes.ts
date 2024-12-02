import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { VideoListComponent } from './videos/video-list/video-list.component';
import { VideoDetailComponent } from './videos/video-detail/video-detail.component';
import { LegalNoticeComponent } from './legal/legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from './legal/privacy-policy/privacy-policy.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'videos', component: VideoListComponent },
  { path: 'videos/:id', component: VideoDetailComponent },
  { path: 'legal-notice', component: LegalNoticeComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: '**', redirectTo: '' } // Fallback-Route
];