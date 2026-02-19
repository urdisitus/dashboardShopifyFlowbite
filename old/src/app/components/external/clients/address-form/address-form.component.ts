import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';
import { CustomerDto } from 'src/app/models/external/client/customer-dto';
import { CustomerAddressDto } from 'src/app/models/external/client/customer-address-dto';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceShopifyCustomer } from 'src/app/services/external/client/shopify-customer-farmacorp.service';
import { ToastrService } from 'ngx-toastr';
import { List } from 'linqts';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { ExecutingService } from 'src/app/services/shared/executing.service';
import { StoreCustomerAddressParam } from 'src/app/models/external/client/store-customer-address-param';
import { MapsAPILoader, MouseEvent } from '@agm/core';

interface City {
  city?: string,
  latitud?: number,
  longitud?: number,
  keyRegion?: string
}

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css']
})
export class AddressFormComponent implements OnInit {

  data: CustomerDto = {};
  param: StoreCustomerAddressParam = {};
  center: { lat?: number; lng?: number } = {};
  map: google.maps.Map;
  searchBox: google.maps.places.SearchBox;
  private geoCoder;

  statusConfig: Options = {
    multiple: false,
    tags: false,
    closeOnSelect: true,
    width: 200
  };

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
    private toastr: ToastrService,
    public service: ServiceShopifyCustomer,
    public _modalService: NgbModal,
    public modal: NgbActiveModal,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public _executingService: ExecutingService
  ) { }

  ngOnInit() {
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
    });
  }

  setData(customer: CustomerDto, element: CustomerAddressDto) {
    this.data = customer;
    this.param.customerId = customer.id;
    if (element) {
      this.param.id = element.id;
      this.onCityChange({
        value: element.city
      });
      if (element.latLng && element.latLng.latitud !== null && element.latLng.longitud !== null) {
        this.param.latitud = element.latLng.latitud;
        this.param.longitud = element.latLng.longitud;
        this.param.zoom = element.latLng.zoom;
      } else if (this.city) {
        this.param.latitud = this.city.latitud;
        this.param.longitud = this.city.longitud;
        this.param.zoom = 15
      }
      this.param.name = element.first_name;
      this.param.address = element.address1;
      this.param.reference = element.address2;
      this.param.phone = element.phone;
      this.param.city = element.city;
      this.param.default = element.default;
    } else if (this.city) {
      this.param.latitud = this.city.latitud;
      this.param.longitud = this.city.longitud;
      this.param.zoom = 15
    }
    this.center.lat = this.param.latitud;
    this.center.lng = this.param.longitud;
  }

  dismissModal() {
    this.modal.dismiss('cancel click');
  }

  store() {
    this.service.store(this.param).then((result: CustomerDto) => {
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

  getAddressAuto(place: object) {
    if (place['geometry'] === undefined || place['geometry'] === null) {
      this.ngZone.run(() => {
        if (place['geometry'] === undefined || place['geometry'] === null) {
          return;
        }
        this.center.lat = place['geometry'].location.lat();
        this.center.lng = place['geometry'].location.lng();
      });
    } else {
      this.center.lat = place['geometry'].location.lat();
      this.center.lng = place['geometry'].location.lng();
    }
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
