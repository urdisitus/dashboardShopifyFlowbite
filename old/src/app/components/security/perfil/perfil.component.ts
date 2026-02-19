import { Component, OnInit } from '@angular/core';
import { SessionProvider } from 'src/app/providers/session/session.provider';
import { ExecutingService } from 'src/app/services/shared/executing.service';
import { IRolDto } from 'src/app/models/security/administration/user/Rol';
import { ServiceUser } from 'src/app/services/security/administration/user/Impl/user.service';
import { ServiceLocation } from 'src/app/services/external/location/location.service';
import { BranchOfficeDto } from 'src/app/models/external/location/BranchOfficeDto';
import { List } from 'linqts';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  userInfo: IUserInfo = {};
  roles: IRolDto[] = [];
  rolesSelected: string = '';
  branchOfficeSelected: string= '';
  branchOffices : BranchOfficeDto[] = [];

  constructor(    
    public service: ServiceUser,
    public serviceLocation: ServiceLocation,
    public sessionProvider: SessionProvider,
    public executingService: ExecutingService,
  ) { 
    this.loadTypes();
  }

  ngOnInit() {
    this.sessionProvider.getUserInfo().then((userInfo: IUserInfo) => {
      this.userInfo = userInfo;
      this.updateRoles();
      this.updateBranchOffice();
    });
  }

  updateRoles(){
    if(this.userInfo && this.userInfo.roles){
      const rolesList = new List<string>(this.userInfo.roles);
      this.rolesSelected = new List<IRolDto>(this.roles).Where(x=> rolesList.Contains(x.id.toString())).Select(x=> x.nombre).ToArray().join(', ');      
    } else{
      this.rolesSelected = '';
    }   
  }

  updateBranchOffice(){
    if(this.userInfo && this.userInfo.keyBodega){
      this.branchOfficeSelected = new List<BranchOfficeDto>(this.branchOffices)
      .Where(x=> x.keyBodega == this.userInfo.keyBodega
        && x.puntoVentaId == this.userInfo.puntoVentaId
        && x.noCia == this.userInfo.noCia).Select(x=> `${x.keyBodega} / ${x.puntoVentaId} ${x.nombre}`).FirstOrDefault();      
    } else{
      this.branchOfficeSelected = '';
    }   
  }

  loadTypes() {
    this.service.roles().then((items: IRolDto[]) => {
      this.roles = items;   
      this.updateRoles();   
    });
    this.serviceLocation.get().then((items: BranchOfficeDto[]) => {
      this.branchOffices = items;
      this.updateBranchOffice();
    });
  }
}
