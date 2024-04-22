import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  menu: any; 

  constructor() { }

  ngOnInit(): void {
    // Récupérer le menu depuis le localStorage
    const storedMenu = localStorage.getItem('currentMenu');
    if (storedMenu !== null) {
      const decodedMenu = decodeURIComponent(storedMenu);
      this.menu = JSON.parse(decodedMenu);
      // Initialiser la quantité de chaque plat à 1
      this.menu.plats.forEach((plat: { quantity: number; }) => plat.quantity = 0);
    } else {
      // Gérer le cas où le menu n'est pas disponible dans le localStorage
      console.error("Le menu n'est pas disponible dans le localStorage.");
    }
  }

  incrementQuantity(index: number) {
    this.menu.plats[index].quantity++;
  }

  decrementQuantity(index: number) {
    if (this.menu.plats[index].quantity > 0) {
      this.menu.plats[index].quantity--;
    }
  }
}
