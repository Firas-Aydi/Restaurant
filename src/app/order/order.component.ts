import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
// import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
// import { error } from 'console';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  menu: any;
  restaurant: any;
  totalPrice: number = 0;

  constructor(private router: Router, private fs: AngularFirestore) {}

  ngOnInit(): void {
    // Récupérer le menu depuis le localStorage
    const storedMenu = localStorage.getItem('currentMenu');
    if (storedMenu !== null) {
      const decodedMenu = decodeURIComponent(storedMenu);
      this.menu = JSON.parse(decodedMenu);
      // Initialiser la quantité de chaque plat à 1
      this.menu.plats.forEach(
        (plat: { customization: string; quantity: number }) => {
          plat.quantity = 0;
          plat.customization = '';
        }
      );
      // Calculer le prix total initial
      this.calculateTotalPrice();
    } else {
      // Gérer le cas où le menu n'est pas disponible dans le localStorage
      console.error("Le menu n'est pas disponible dans le localStorage.");
    }
  }

  incrementQuantity(index: number) {
    this.menu.plats[index].quantity++;
    this.calculateTotalPrice();
  }

  decrementQuantity(index: number) {
    if (this.menu.plats[index].quantity > 0) {
      this.menu.plats[index].quantity--;
      this.calculateTotalPrice();
    }
  }

  calculateTotalPrice() {
    this.totalPrice = this.menu.plats.reduce(
      (total: number, plat: { price: number; quantity: number }) => {
        return total + plat.price * plat.quantity;
      },
      0
    );
  }

  placeOrder() {
    const userConnect = localStorage.getItem('userConnect');
    const storedRest = localStorage.getItem('currentRestaurant');
    if (storedRest !== null) {
      const decodedRest = decodeURIComponent(storedRest);
      this.restaurant = JSON.parse(decodedRest);
    }
    const ownerId = localStorage.getItem('currentUid');
    if (userConnect) {
      // Récupérer l'UID de l'utilisateur connecté
      const userId = userConnect;

      // Utiliser l'UID pour obtenir les détails de l'utilisateur depuis Firebase
      this.fs
        .collection('users')
        .doc(userId)
        .get()
        .toPromise()
        .then((doc) => {
          console.log('doc.data: ', doc.data());
          if (doc.exists) {
            // Obtenir les données de l'utilisateur
            const userData = doc.data();
            if (userData) {
              const clientId = userData.uid; // Supposons que le nom de l'utilisateur soit stocké sous la clé 'name'
              const clientName = userData.flName; // Supposons que le nom de l'utilisateur soit stocké sous la clé 'name'
              const clientNumber = userData.telephone; // Supposons que le numéro de téléphone de l'utilisateur soit stocké sous la clé 'phoneNumber'

              // Continuer avec le reste de la fonction placeOrder en utilisant les données récupérées
              const orderDetails: {
                name: any;
                quantity: any;
                customization: any;
              }[] = [];
              this.menu.plats.forEach((plat: any) => {
                if (plat.quantity > 0) {
                  orderDetails.push({
                    name: plat.name,
                    quantity: plat.quantity,
                    customization: plat.customization,
                  });
                }
              });
              const orderData = {
                restaurantName: this.restaurant.restaurantName,
                ownerId: ownerId,
                clientId: clientId,
                clientName: clientName,
                clientNumber: clientNumber,
                orderDetails: orderDetails,
                totalPrice: this.totalPrice,
                orderDate: new Date().toISOString(),
              };

              // Enregistrement de la commande dans Firebase
              this.fs
                .collection('orders')
                .add(orderData)
                .then(() => {
                  console.log('Order placed successfully!');
                  // Effacer le menu du localStorage après avoir passé la commande
                  localStorage.removeItem('currentMenu');
                  localStorage.removeItem('currentRestaurant');
                  localStorage.removeItem('currentUid');
                  // Rediriger l'utilisateur vers une autre page si nécessaire
                  // this.route.navigate(['/success']);
                })
                .catch((error) => {
                  console.error('Error placing order:', error);
                });
            } else {
              console.log('User data is undefined!');
            }
          } else {
            console.log('User document not found!');
          }
        })
        .catch((error) => {
          console.error('Error getting user document:', error);
        });
    } else {
      // L'utilisateur n'est pas connecté
      console.log('User is not logged in');
      // Rediriger l'utilisateur vers la page de connexion
      this.router.navigate(['/login']);
    }
  }

  confirmOrder() {
    this.router.navigate(['/map']).then(() => window.location.reload());
  }
}
