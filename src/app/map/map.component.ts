import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  restaurants: any[] | undefined;
  map: any;
  count = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.initializeMap();
    this.fetchRestaurants();
  }

  initializeMap(): void {
    this.map = L.map('map').setView([38.6685955, -90.2654703], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(this.map);
  }

  fetchRestaurants(): void {
    this.http.get<any[]>('http://localhost:5000/').subscribe((restaurants) => {
      this.restaurants = restaurants;
      console.log(this.restaurants);
      this.updateMapWithReviews();
    });
  }

  showReviews(restaurantName: string): void {
    const reviewsElement = document.getElementById(`reviews-${restaurantName}`);
    console.log("showReviews restaurantName: ",restaurantName)
    const menuElement = document.getElementById(`menu-${restaurantName}`);
    if (reviewsElement && menuElement) {
      reviewsElement.style.display = 'block';
      menuElement.style.display = 'none';
    }
  }

  showMenu(restaurantName: string): void {
    const reviewsElement = document.getElementById(`reviews-${restaurantName}`);
    const menuElement = document.getElementById(`menu-${restaurantName}`);
    if (reviewsElement && menuElement) {
      reviewsElement.style.display = 'none';
      menuElement.style.display = 'block';
    }
  }

  updateMapWithReviews(): void {
    const restaurants = this.restaurants;
    if (restaurants) {
      for (const restaurant of restaurants) {
        let TerribleReviews = 0;
        let PoorReviews = 0;
        let AverageReviews = 0;
        let GoodReviews = 0;
        let ExcellentReviews = 0;

        for (const review of restaurant.reviews) {
          this.http
            .post<any>('http://localhost:5000/predict_sentiment', {
              text: review.text,
            })
            .subscribe((data) => {
              switch (data.sentiment) {
                case 'Terrible':
                  TerribleReviews++;
                  break;
                case 'Poor':
                  PoorReviews++;
                  break;
                case 'Average':
                  AverageReviews++;
                  break;
                case 'Very good':
                  GoodReviews++;
                  break;
                case 'Excellent':
                  ExcellentReviews++;
                  break;
              }

              let popupContent = `<button (click)="showMenu('${restaurant.restaurantName}')">Menu</button><br>`;
              console.log("popupContent restaurantName: ",restaurant.restaurantName)
              // popupContent += `<button (click)="showReviews('${restaurant.restaurantName}')">Reviews</button></br>`;
              // popupContent += `<div id="restaurantInfo${restaurant.restaurantName}">`;
              popupContent += `<b>${restaurant.restaurantName}</b><br>
                                ${restaurant.address}, ${restaurant.city}, ${restaurant.state} ${restaurant.postalCode}<br>
                                Stars: ${restaurant.stars}<br>`;
              popupContent += `<div style='color:green;'><b>Excellent reviews: ${ExcellentReviews}</b></div>`;
              popupContent += `<div style='color:blue;'><b>Very good reviews: ${GoodReviews}</b></div>`;
              popupContent += `<div style='color:yellow;'><b>Average reviews: ${AverageReviews}</b></div>`;
              popupContent += `<div style='color:orange;'><b>Poor reviews: ${PoorReviews}</b></div>`;
              popupContent += `<div style='color:red;'><b>Terrible reviews: ${TerribleReviews}</b></div>`;
              popupContent += `<br><b>Reviews:</b><br>`;
              // popupContent += `<div id="reviews-${restaurant.restaurantName}" style="display:none">`;
              for (const review of restaurant.reviews) {
                const truncatedText =
                  review.text.length > 100
                    ? review.text.substring(0, 100) + '...'
                    : review.text;
                popupContent += truncatedText + '<br><br>';
              }
              // popupContent += `</div>`;
              // popupContent += `<div id="menu-${restaurant.restaurantName}" style="display:none">`;
              // Ajoutez ici le contenu du menu en fonction de l'ID du restaurant
              // popupContent += `Menu du restaurant ${restaurant.restaurantName}`;
              // popupContent += `</div>`;
              // popupContent += `</div>`;

              const popupOptions = {
                maxHeight: 300,
              };

              L.marker([restaurant.latitude, restaurant.longitude])
                .addTo(this.map)
                .bindPopup(popupContent, popupOptions);
            });
        }
      }
    }
  }
}
