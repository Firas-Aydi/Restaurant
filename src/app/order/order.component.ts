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
    console.log("storedMenu: ",storedMenu)
    if (storedMenu !== null) {
      const decodedMenu = decodeURIComponent(storedMenu);
      this.menu = JSON.parse(decodedMenu);
      console.log("menu: ",this.menu)
    } else {
      // Gérer le cas où le menu n'est pas disponible dans le localStorage
      console.error("Le menu n'est pas disponible dans le localStorage.");
    }
  }

}
