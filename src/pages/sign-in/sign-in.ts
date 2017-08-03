import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NgForm } from "@angular/forms";
import { LoadingController, AlertController } from 'ionic-angular';

import { AuthService } from '../../services/auth';
import { HomePage } from '../home/home';
import { SettingsPage } from '../settings/settings';

@Component({
	selector: 'page-sign-in',
	templateUrl: 'sign-in.html',
})
export class SignInPage {

  settingsPage: any = SettingsPage;
  homePage: any = HomePage;

	constructor(private navCtrl: NavController,
	            private authService: AuthService,
	            private loadingCtrl: LoadingController,
	            private alertCtrl: AlertController) {
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
				this.navCtrl.setRoot(this.settingsPage);
			})
			.catch(signUpError => {
				console.log('authService Signup Error', signUpError);
				this.authService.signin(form.value.email, form.value.password)
					.then(data => {
						console.log('authService.signin', data);
						loading.dismiss();
            this.navCtrl.setRoot(this.homePage)
						// this.navCtrl.pop();
						// this.navCtrl.push(this.settingsPage);
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

}
