import { Routes } from '@angular/router';
import { ROUTES_UI } from './constants';
import { LoginComponent } from './components/userAuth/login/login.component';
import { RegisterComponent } from './components/userAuth/register/register.component';
import { OtpTestComponent } from './components/userAuth/otp-test/otp-test.component';
import { FeedComponent } from './components/mainPages/feed/feed.component';
import { PageNotFoundComponent } from './components/home/page-not-found/page-not-found.component';
import { canActivate, canActivateLogin } from './services/auth.guard';
import { UserPageComponent } from './components/mainPages/user-page/user-page.component';
import { SettingsPageComponent } from './components/mainPages/settings-page/settings-page.component';

export const routes: Routes = [
  { path: ROUTES_UI.DEFAULT, pathMatch: 'full', redirectTo: ROUTES_UI.LOGIN },
  {
    path: ROUTES_UI.LOGIN,
    component: LoginComponent,
    canActivate: [canActivateLogin],
  },
  {
    path: ROUTES_UI.REGISTER,
    component: RegisterComponent,
    canActivate: [canActivateLogin],
  },
  {
    path: ROUTES_UI.OTP_TEST,
    component: OtpTestComponent,
    canActivate: [canActivateLogin],
  },
  {
    path: ROUTES_UI.FEED,
    component: FeedComponent,
    canActivate: [canActivate],
  },
  {
    path: ROUTES_UI.USER_POSTS_PAGE,
    component: UserPageComponent,
    canActivate: [canActivate],
  },
  {
    path: ROUTES_UI.SETTINGS,
    component: SettingsPageComponent,
    canActivate: [canActivate],
  },
  { path: ROUTES_UI.WILDCARD_ROUTE, component: PageNotFoundComponent },
];
