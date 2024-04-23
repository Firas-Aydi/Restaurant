import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore'; // Importez le service AngularFirestore

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isUser: boolean = false;
  userType: string = ''; // Ajoutez une propriété pour stocker le type d'utilisateur

  constructor(private af: AngularFireAuth, private route: Router, private as: AuthService, private firestore: AngularFirestore) {
    this.as.user.subscribe((user) => {
      if (user) {
        this.isUser = true;
        const userId = user.uid;
        this.firestore.collection('users').doc(userId).get().subscribe((doc) => {
          // console.log('doc:', doc);
          if (doc.exists) {
            const userData = doc.data();
            if (userData && userData.role) {
              this.userType = userData.role;
              // console.log('User Type:', this.userType);
            } else {
              console.log('Role not found in user data');
            }
          } else {
            console.log('User data not found');
          }
        });
      } else {
        this.isUser = false;
        this.userType = '';
      }
    });
  }

  ngOnInit(): void {
  }

  logout() {
    this.af.signOut()
      .then(() => {
        localStorage.removeItem("userConnect");
        this.route.navigate(['/login']);
      })
      .catch(() => {
        console.log("error");
      });
  }
}
