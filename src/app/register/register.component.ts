import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  // registerForm!: FormGroup;
  // constructor(private sa: AuthService, private fs: AngularFirestore, private route: Router) {}
  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit(): void {}
  userType: string = 'client';

  onUserTypeChange(userType: string) {
    this.userType = userType;
  }

  // register(f: { value: any }) {
  //   // console.log(f.value)
  //   let data = f.value;
  //   this.sa
  //     .signUp(data.email, data.password)
  //     .then((user) => {
  //       if (user && user.user) {
  //         localStorage.setItem('userConnect', user.user.uid);
  //         this.fs
  //           .collection('users')
  //           .doc(user.user.uid)
  //           .set({
  //             flName: data.flName,
  //             email: data.email,
  //             password: data.password,
  //             uid: user.user.uid,
  //             role: 'admin',
  //           })
  //           .then(() => {
  //             this.route.navigate(['/']);
  //           });
  //       } else {
  //         console.log('User or user.user is null.');
  //       }
  //     })
  //     .catch(() => {
  //       console.log('error !');
  //     });
  // }
  register(form: any) {
    let data = form.value;
    this.authService
      .signUp(data.email, data.password)
      .then((userCredential) => {
        if (userCredential && userCredential.user) {
          localStorage.setItem('userConnect', userCredential.user.uid);
          const userData: {
            uid: string;
            flName: string;
            telephone: number;
            email: string;
            password: string;
            role: string;
            restaurantData?: any;
          } = {
            uid: userCredential.user.uid,
            flName: data.flName,
            telephone: data.telephone,
            email: data.email,
            password: data.password,
            role: this.userType === 'client' ? 'client' : 'restaurantOwner',
          };
          if (this.userType === 'restaurantOwner') {
            userData.restaurantData = {
              restaurantName: data.restaurantName,
              address: data.address,
              city: data.city,
              state: data.state,
              postalCode: data.postalCode,
              latitude: data.latitude,
              longitude: data.longitude,
              reviews: [
                {
                  text: '',
                },
              ],
            };
          }
          this.firestore
            .collection('users')
            .doc(userCredential.user.uid)
            .set(userData)
            .then(() => {
              this.router.navigate(['/']);
            })
            .catch((error) => {
              console.error('Error adding document: ', error);
            });
        } else {
          console.log('User or userCredential.user is null.');
        }
      })
      .catch((error) => {
        console.error('Error signing up: ', error);
      });
  }
}
