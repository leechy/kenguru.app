import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { NgForm } from "@angular/forms";
import { LoadingController, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../services/auth';
import { Store } from '@ngrx/store';
import { AppState } from '../../models/app-state.interface';
import { AuthInterface } from '../../models/auth.interface';
import * as AuthActions from '../../store/auth.actions';
import { Facebook } from '@ionic-native/facebook';
import { HomePage } from '../home/home';

@Component({
	selector: 'page-sign-in',
	templateUrl: 'sign-in.html',
})
export class SignInPage implements OnInit {

  authState$: Observable<AuthInterface>;

  userProfile: any = null;
  homePage: any = HomePage;

	constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private facebook: Facebook,
    private platform: Platform,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.authState$ = this.store.select('auth');
  }

	onSignup(form: NgForm) {
		console.log('onSignUp', form.value);
		const loading = this.loadingCtrl.create({
			content: 'Вход или регистрация'
		});
		loading.present();
		this.authService.signup(form.value.email, form.value.password)
			.then(data => {
				console.log('authService.signup', data);
				loading.dismiss();
				this.store.dispatch(new AuthActions.SignUp(form.value.email));
			})
			.catch(signUpError => {
				console.log('authService Signup Error', signUpError);
				this.authService.signin(form.value.email, form.value.password)
					.then(data => {
						console.log('authService.signin', data);
            loading.dismiss();
            this.store.dispatch(new AuthActions.SignIn(form.value.email));
						this.navCtrl.setRoot(this.homePage)
					})
					.catch(signInError => {
						console.log('authService Signin Error', signInError);
						loading.dismiss();
						const alert = this.alertCtrl.create({
							title: 'Грешка при входа или регистрацията',
							message: signUpError + signInError.message,
							buttons: ['Ок']
						});
						alert.present();
					});
			});
	}

  onFacebookSignup(): void {
    if (this.platform.is('cordova')) {
      // inside the app
      this.facebook.login(['public_profile', 'email'])
        .then(response => {
          this.authService.credentialSignIn(response.authResponse.accessToken)
            .then(data => {
              console.log('onFacebookSignup success', data);
              this.store.dispatch(new AuthActions.FacebookLogin({
                email: data.user.email,
                token: data.credential.accessToken
              }));
              this.userProfile = data;
            })
            .catch(error => {
              const alert = this.alertCtrl.create({
                title: 'Грешка при регистрацията на Фейсбук-акаунта във Firebase',
                message: error.message,
                buttons: ['Ок']
              });
              alert.present();
            })

        })
        .catch(error => {
          const alert = this.alertCtrl.create({
            title: 'Грешка при входа през Фейсбук',
            message: error,
            buttons: ['Ок']
          });
          alert.present();
        });
    } else {
      // on a desktop browser
      this.authService.facebookLogin()
        .then(data => {
          console.log('onFacebookSignup success', data);
        }).catch(error => {
          console.log('onFacebookSignup error', error);
        });
    }
  }

  logout() {
    this.authService.logout();
    this.store.dispatch(new AuthActions.Logout());
  }

}
