import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ShippingAddressOrderParam } from 'src/app/models/external/order/shipping-address-order-param';
import { OrderListItemDto } from 'src/app/models/external/order/order-list-item-dto';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ShippingAddressOrderDto } from 'src/app/models/external/order/shipping-address-order-dto';
import { List } from 'linqts';
import { ServiceUpdShippingAddressOrder } from 'src/app/services/external/order/upd.shipping.address.order.service';
import { Options } from 'select2';
import { Select2OptionData } from 'ng-select2';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { ExecutingService } from 'src/app/services/shared/executing.service';

interface City {
  city?: string,
  latitud?: number,
  longitud?: number,
  keyRegion?: string
}

@Component({
  selector: 'app-update-shipping-address',
  templateUrl: './update-shipping-address.component.html',
  styleUrls: ['./update-shipping-address.component.css']
})
export class UpdateShippingAddressComponent implements OnInit {

  param: ShippingAddressOrderParam = {};
  center: { lat?: number; lng?: number } = {};
  order: OrderListItemDto = {};
  map: google.maps.Map;
  searchBox: google.maps.places.SearchBox;
  private geoCoder;

  statusConfig: Options = {
    multiple: false,
    tags: false,
    closeOnSelect: true,
    width: 200
  };

  showName= false;

  dataBagToSelect2OptionData(): Array<Select2OptionData> {
    return new List<City>(this.cities).Select(x => { return { id: x.city, text: x.city } }).ToArray();
  }

  public cities: City[] = [
    {
      city: "Santa Cruz",
      latitud: -17.783318,
      longitud: -63.182126,
      keyRegion: "001"
    },
    {
      city: "Cobija",
      latitud: -11.023339,
      longitud: -68.766269,
      keyRegion: "009"
    }, {
      city: "Cochabamba",
      latitud: -17.396394,
      longitud: -66.162779,
      keyRegion: ""
    },
    {
      city: "Oruro",
      latitud: -17.969568,
      longitud: -67.114624,
      keyRegion: "005"
    }, {
      city: "Potosí",
      latitud: -19.576795,
      longitud: -65.757412,
      keyRegion: "008"
    }, {
      city: "Trinidad",
      latitud: -14.835039,
      longitud: -64.904141,
      keyRegion: "007"
    }, {
      city: "Tarija",
      latitud: -21.533895,
      longitud: -64.734285,
      keyRegion: "004"
    }, {
      city: "Chuquisaca",
      latitud: -19.047752,
      longitud: -65.259527,
      keyRegion: ""
    }, {
      city: "La Paz",
      latitud: -16.498447,
      longitud: -68.126580,
      keyRegion: "003"
    }
  ];
  city: City = new List<City>(this.cities).FirstOrDefault();

  constructor(
    public service: ServiceUpdShippingAddressOrder,
    public modal: NgbActiveModal,
    private mapsAPILoader: MapsAPILoader,
    public _executingService: ExecutingService
  ) { }

  ngOnInit() {
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
    });
  }

  dismissModal() {
    this.modal.dismiss('cancel click');
  }

  setOrder(order: OrderListItemDto) {
    this.order = order;
    this.param.ordenId = order.id;
    const shippingAddress: ShippingAddressOrderDto = order.shippingAddress;
    if (shippingAddress) {
      this.onCityChange({
        value: shippingAddress.city
      });
      if (order.shippingLatLng && order.shippingLatLng.latitud !== null && order.shippingLatLng.longitud !== null) {
        this.param.latitud = order.shippingLatLng.latitud;
        this.param.longitud = order.shippingLatLng.longitud;
        this.param.zoom = order.shippingLatLng.zoom;
      } else if (this.city) {
        this.param.latitud = this.city.latitud;
        this.param.longitud = this.city.longitud;
        this.param.zoom = 15;
      }
      this.param.name = shippingAddress.first_name;
      this.param.lastName = shippingAddress.last_name;
      this.param.address = shippingAddress.address1;
      this.param.reference = shippingAddress.address2;
      this.param.phone = shippingAddress.phone;
      this.param.city = shippingAddress.city;
      this.showName = false;
    } else if (this.city) {
      this.showName = true;
      this.param.latitud = this.city.latitud;
      this.param.longitud = this.city.longitud;
      this.param.zoom = 15;
    }
    this.center.lat = this.param.latitud;
    this.center.lng = this.param.longitud;
  }

  guardar() {
    // Validar
    this.service.update(this.param).then((result: OrderListItemDto) => {
      this.modal.close(result);
      this.dismissModal();
    });
  }

  onCityChange(newValue: { value: string }) {
    if (newValue && newValue.value) {
      this.city = new List<City>(this.cities).FirstOrDefault(x => x.city === newValue.value);
      if (this.city) {
        this.center.lat = this.city.latitud;
        this.center.lng = this.city.longitud;
        this.param.zoom = 15;
      }
    }
  }

  placeMarker($event: MouseEvent) {
    if ($event.coords) {
      this.param.latitud = $event.coords.lat;
      this.param.longitud = $event.coords.lng;
    }
  }

  mapReadyListener($event: google.maps.Map) {
    this.map = $event;
    const input: HTMLInputElement = <HTMLInputElement>document.getElementById('search');
    this.searchBox = new google.maps.places.SearchBox(input);
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
    this.searchBox.addListener('places_changed', () => this.goToSearchPlace());
  }

  goToSearchPlace() {
    const places = this.searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }
    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    this.map.fitBounds(bounds);
  }

  markerDragEnd($event: MouseEvent) {
    if ($event.coords) {
      this.param.latitud = $event.coords.lat;
      this.param.longitud = $event.coords.lng;
    }
  }

  getCurrentAddress() {
    this.getAddress(this.param.latitud, this.param.longitud);
  }

  getAddress(latitude, longitude) {
    this._executingService.show();
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      this._executingService.hide();
      if (status === 'OK') {
        if (results[0]) {
          this.param.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }
}
