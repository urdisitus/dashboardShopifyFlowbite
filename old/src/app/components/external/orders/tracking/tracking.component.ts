import { FetchCoordinatesResponse } from './../../../../models/external/tookanApi/agent/fetch-coordinates-response';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isNumeric } from 'rxjs/internal-compatibility';
import { OrderTrackingDto } from 'src/app/models/external/order/order-tracking-dto';
import { MapStyles } from 'src/app/providers/map-styles';
import { ApiResponse } from 'src/app/services/base.service';
import { ServiceShippingAddressOrder } from 'src/app/services/external/order/shipping.address.order.service';
import { AgentService } from 'src/app/services/external/tookanapi/agent.service';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements OnInit {
  orderId: string;
  order: OrderTrackingDto;
  //agentDetail: AgentDetailDto;
  agentLocation: FetchCoordinatesResponse;
  interval;
  motoAnimation: string = null;
  firstTracking = false;
  fitBounds = false;
  lastTime: Date;
  map: google.maps.Map;
  directionsService: google.maps.DirectionsService;
  directionsRenderer: google.maps.DirectionsRenderer;
  mapStyle = MapStyles.styles.silver;
  lastRoute: google.maps.LatLng;
  center: {
    lat?: number;
    lng?: number;
    zoom?: number;
    distance?: string;
    duration?: string;
  } = {
      lat: -17.783318,
      lng: -63.182126,
      zoom: 15
    };

  motoIcon = {};
  origenIcon = {};
  destIcon = {};

  constructor(
    private _agentService: AgentService,
    private _shippingAddressOrderService: ServiceShippingAddressOrder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {
    this.interval = setInterval(() => {
      this.loadAgentLocation();
    }, 15000);
  }

  private loadTracking() {
    if (this.order && this.order.provider === 'Beetrack') {
      this._agentService.fetchCoordinates(this.order.ordenName, this.firstTracking)
        .then((response: FetchCoordinatesResponse) => {
          if (response) {
            if (this.agentLocation) {
              const current = new google.maps.LatLng(this.agentLocation.latitude, this.agentLocation.longitude);
              const moveTo = new google.maps.LatLng(response.latitude, response.longitude);
              this.animatedMove(
                0.5,
                current,
                moveTo,
                (newLatLng: google.maps.LatLng) => {
                  this.agentLocation.latitude = newLatLng.lat();
                  this.agentLocation.longitude = newLatLng.lng();
                },
                (dist: number) => {
                  if (dist > 50) {
                    this.calculateAndDisplayRoute(moveTo, new google.maps.LatLng(this.order.destLat, this.order.destLng));
                    this.lastRoute = moveTo;
                  }
                });
            } else {
              this.agentLocation = response;
              this.calculateAndDisplayRoute(new google.maps.LatLng(response.latitude, response.longitude), new google.maps.LatLng(this.order.destLat, this.order.destLng));
            }
            this.makeFitBounds();
            this.firstTracking = true;
          }
        });
    }
  }

  private makeFitBounds() {
    if (this.map && this.order && !this.fitBounds) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(new google.maps.LatLng(this.order.originLat, this.order.originLng));
      if (this.agentLocation) {
        bounds.extend(new google.maps.LatLng(this.agentLocation.latitude, this.agentLocation.longitude));
        this.fitBounds = true;
        this.motoAnimation = 'BOUNCE';
        setTimeout(() => {
          this.motoAnimation = null;
        }, 3000);
      }
      bounds.extend(new google.maps.LatLng(this.order.destLat, this.order.destLng));
      this.map.fitBounds(bounds, 150);
    }
  }

  ngOnInit() {
    this.orderId = this._activatedRoute.snapshot.paramMap.get('orderId');
    if (!isNumeric(this.orderId)) {
      clearInterval(this.interval);
      this._router.navigate([`404/El código ${this.orderId} debe ser numérico.`]);
    } else {
      this._shippingAddressOrderService.get(parseInt(this.orderId))
        .then((response: ApiResponse<OrderTrackingDto>) => {
          if (response.data) {
            this.order = response.data;
            this.motoIcon = {
              url: this.order.agenteEntregaIcon,
              scaledSize: {
                width: 80,
                height: 80
              }
            };
            this.origenIcon = {
              url: this.order.originIcon,
              scaledSize: {
                width: 70,
                height: 70
              }
            };
            this.destIcon = {
              url: this.order.destIcon,
              scaledSize: {
                width: 70,
                height: 70
              }
            };
            this.makeFitBounds();
            this.loadAgentLocation();
          } else if (response.errors && response.errors.length > 0) {
            clearInterval(this.interval);
            this._router.navigate([`404/${response.errors[0].message}`]);
          }
        });
    }
  }

  private loadAgentLocation() {
    this.lastTime = new Date();
    //this.loadAgentDetail();
    this.loadTracking();
  }

  // private loadAgentDetail() {
  //   if (!this.agentDetail && this.order && this.order.agenteEntregaId) {
  //     this._agentService.getDetail(this.order.agenteEntregaId)
  //       .then((response: AgentDetailDto) => {
  //         if (response) {
  //           this.agentDetail = response;
  //         }
  //       });
  //   }
  // }

  mapReadyListener($event: google.maps.Map) {
    this.map = $event;
    this.makeFitBounds();
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      map: this.map,
      suppressMarkers: true,
      preserveViewport: true
    });

    this.map.controls[google.maps.ControlPosition.RIGHT_TOP].clear();
    this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(document.getElementById('tariff-container'));
  }

  calculateAndDisplayRoute(origin: google.maps.LatLng, destination: google.maps.LatLng) {
    if (this.directionsService) {
      this.directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response: google.maps.DirectionsResult, status) => {
          if (status === "OK") {
            this.directionsRenderer.setDirections(response);
            if (response != null
              && response.routes != null
              && response.routes.length > 0
              && response.routes[0].legs != null
              && response.routes[0].legs.length > 0
              && response.routes[0].legs[0].distance != null
              && response.routes[0].legs[0].duration != null) {
              let distance: google.maps.Distance = response.routes[0].legs[0].distance;
              let duration: google.maps.Duration = response.routes[0].legs[0].duration;
              let distanceStr: string = distance.text;
              let durationStr: string = duration.text;
              this.center.duration = durationStr;
              this.center.distance = distanceStr;
            } else {
              this.center.duration = null;
              this.center.distance = null;
            }
          }
        }
      );
    }
  }

  animatedMove(
    t: number,
    current: google.maps.LatLng,
    moveto: google.maps.LatLng,
    updateMarker: (latLng: google.maps.LatLng) => void,
    onFinish: (distance: number) => void = null) {
    let deltalat = (moveto.lat() - current.lat()) / 100;
    let deltalng = (moveto.lng() - current.lng()) / 100;

    let delay = 10 * t;
    let latLng = current;
    for (let i: number = 0; i < 100; i++) {
      ((ind: number) => {
        setTimeout(
          () => {
            var lat = latLng.lat();
            var lng = latLng.lng();
            lat += deltalat;
            lng += deltalng;
            latLng = new google.maps.LatLng(lat, lng);
            updateMarker(latLng);
          }, delay * ind);
      })(i)
    }
    if (onFinish) {
      if (!this.lastRoute) {
        this.lastRoute = current;
      }
      const dist = google.maps.geometry.spherical.computeDistanceBetween(this.lastRoute, moveto);
      onFinish(dist);
    }
  }
}
