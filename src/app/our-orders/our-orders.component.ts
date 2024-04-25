// our-orders.component.ts
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

interface OrderDetail {
  name: string; // Nom du plat
  quantity: number; // Quantité commandée
  customization: string; // Personnalisation du plat (optionnel)
}

interface OrderData {
  id: string;
  clientId: string;
  clientName: string;
  clientNumber: string;
  orderDate: string;
  orderDetails: OrderDetail[];
  ownerId: string;
  restaurantName: string;
  totalPrice: string;
}
@Component({
  selector: 'app-our-orders',
  templateUrl: './our-orders.component.html',
  styleUrls: ['./our-orders.component.css'],
})
export class OurOrdersComponent implements OnInit {
  restaurantName: string = ''; // Le nom du restaurant
  orders: OrderData[] = []; // Les commandes pour ce restaurant
  selectedOrderId: string | undefined;
  getOrders: Subscription = new Subscription();
  dataArray: {
    id: string;
    clientId: any;
    clientName: any;
    clientNumber: any;
    orderDate: any;
    orderDetails: any;
    ownerId: any;
    restaurantName: any;
    totalPrice: any;
  }[] = [];
  dataOrder: OrderData = {
    id: '',
    clientId: '',
    clientName: '',
    clientNumber: '',
    orderDate: '',
    orderDetails: [],
    ownerId: '',
    restaurantName: '',
    totalPrice: '',
  };

  constructor(private router: Router, private fs: AngularFirestore) {}

  ngOnInit(): void {
    // Récupérer le nom du restaurant depuis les paramètres de l'URL ou d'où vous stockez ce nom
    const userConnect = localStorage.getItem('userConnect');
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
          if (doc.exists) {
            // Obtenir les données de l'utilisateur
            const userData = doc.data();
            if (userData) {
              this.restaurantName = userData.restaurantData.restaurantName;

              this.getOrders = this.fs
                .collection('orders', (ref) =>
                  ref.where('restaurantName', '==', this.restaurantName)
                )
                .snapshotChanges()
                .subscribe((data) => {
                  this.orders = data.map((element) => {
                    const docData = element.payload.doc.data() as OrderData;
                    return {
                      id: element.payload.doc.id,
                      clientId: docData.clientId,
                      clientName: docData.clientName,
                      clientNumber: docData.clientNumber,
                      orderDate: docData.orderDate,
                      orderDetails: docData.orderDetails,
                      ownerId: docData.ownerId,
                      restaurantName: docData.restaurantName,
                      totalPrice: docData.totalPrice,
                    };
                  });
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
  deleteOrder(id: string | undefined) {
    this.selectedOrderId = id;
    console.log('selectedOrderId: ', this.selectedOrderId);
  }

  confirmDelete() {
    if (this.selectedOrderId) {
      this.fs
        .collection('orders')
        .doc(this.selectedOrderId)
        .delete()
        .then(() => {
          console.log('Order deleted successfully');
          this.selectedOrderId = undefined; // Réinitialise selectedPlatId
          window.location.reload(); // Recharge la page ou utilisez une autre méthode pour mettre à jour la liste
        })
        .catch((error) => {
          console.error('Error deleting Order:', error);
        });
    }

    document.getElementById('deleteModal')?.click(); // Ferme la modal
  }

  ngOnDestroy(): void {
    // Désinscription pour éviter les fuites de mémoire
    this.getOrders.unsubscribe();
  }
}
