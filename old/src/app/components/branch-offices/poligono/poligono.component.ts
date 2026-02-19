import { Component, OnInit } from '@angular/core';
import { ApiSucursalService } from '../../../services/branchOffices/sucursal.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SucursalDto, SucursalPolygonDto } from '../../../dataTransferObjects/branchOffice/branchOffice';

@Component({
  selector: 'app-poligono',
  templateUrl: './poligono.component.html',
  styleUrls: ['./poligono.component.css']
})
export class PoligonoComponent implements OnInit {
  zoom: number = 15;
  public bodega: SucursalDto;
  public polygon: SucursalPolygonDto;
  polygonCoords: google.maps.LatLngLiteral[] = [];
  private previousPolygon: google.maps.Polygon | null = null
  constructor(
    private _apiService: ApiSucursalService,
    private _toastr: ToastrService,
    public modal: NgbActiveModal,
    private _modalService: NgbModal) {

  }


  onMapReady(map) {
    this.initDrawingManager(map);
   
  }

  private getPolygon(): void {

    this._apiService.GetPoligon(this.bodega.noCia, this.bodega.keyBodega)
      .then(
        (result) => {
          this.polygon = result;
        }
      );
  }

  initDrawingManager(map: any) {

    const option = {
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: [google.maps.drawing.OverlayType.POLYGON]
      },
      polygonOptions: {
        draggable: true,
        editable: true
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON
    };
    const drawingManager = new google.maps.drawing.DrawingManager(option);
    drawingManager.setMap(map);
    
    google.maps.event.addListener(drawingManager, 'polygoncomplete', (polygon) => {
      if (this.previousPolygon) {
        this.previousPolygon.setMap(null);
      }
      this.polygonCoords = polygon.getPath().getArray();
      this.previousPolygon = polygon;

    });

    map.setOptions({
      fullscreenControl: true, 
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM 
      }
    });


  }

  ngOnInit() {
  }

  setData(item: SucursalDto) {
    this.bodega = item;
    this.getPolygon();

  }


  dismissModal() {
    this.modal.dismiss('cancel click');
  }

  guardar() {

    this.polygon.poligon = this.polygonCoords;

    this._apiService.SetPolygon(this.polygon)
      .then(
        (result) => {
          this._toastr.success('Se actualizo la cobertura de manera exitosa.', 'Sucursales', { progressAnimation: 'decreasing', timeOut: 3000 });
          if (this.previousPolygon) {
            this.previousPolygon.setMap(null);
          }
        }
      );
  }

}
