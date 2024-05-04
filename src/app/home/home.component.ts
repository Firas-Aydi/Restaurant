import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // this.getCurrentLocation();
  }

  // getCurrentLocation() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const latitude = position.coords.latitude;
  //         const longitude = position.coords.longitude;
  //         console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  //         localStorage.setItem('latitude', latitude.toString());
  //         localStorage.setItem('longitude', longitude.toString());
  //       },
  //       (error) => {
  //         console.error('Erreur de géolocalisation:', error);
  //       }
  //     );
  //   } else {
  //     console.error(
  //       "La géolocalisation n'est pas prise en charge par ce navigateur."
  //     );
  //   }
  // }
}
