import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  api_response = {
	  "token": '',
	  "refresh_token": ""
  };
  errorMessage = '';
  roles: string[] = [];
  constructor(private authService: AuthService, private tokenStorage: TokenStorageService , private UserService: UserService) { }
  ngOnInit(): void {
	  if (window.sessionStorage.length > 0) {
		  if (this.tokenStorage.getUser()) {
			  this.isLoggedIn = true;
			  this.UserService.getMe(this.tokenStorage.getToken()).subscribe(data => {		
			this.tokenStorage.saveUser(data);
		}, err => {
				console.log(err);
		})
			  this.roles = this.tokenStorage.getUser().roles;
		  }
	  }
   
  }
  onSubmit(): void {
    const { username, password } = this.form;
    this.authService.login(username, password).subscribe(
      data => {
		this.tokenStorage.saveToken(data.token);
		
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.reloadPage();
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }
  reloadPage(): void {
    window.location.reload();
  }
}
