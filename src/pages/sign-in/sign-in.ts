import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { NgForm } from "@angular/forms";
import { LoadingController, AlertController } from 'ionic-angular';

import { AuthService } from '../../services/auth';
import { Facebook } from '@ionic-native/facebook';
import { HomePage } from '../home/home';

@Component({
	selector: 'page-sign-in',
	templateUrl: 'sign-in.html',
})
export class SignInPage {

  userProfile: any = null;
  homePage: any = HomePage;

	constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private facebook: Facebook,
    private platform: Platform
  ) {}

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
				this.navCtrl.setRoot(this.homePage);
			})
			.catch(signUpError => {
				console.log('authService Signup Error', signUpError);
				this.authService.signin(form.value.email, form.value.password)
					.then(data => {
						console.log('authService.signin', data);
						loading.dismiss();
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
              this.userProfile = data;
              this.navCtrl.setRoot(this.homePage);
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

}
