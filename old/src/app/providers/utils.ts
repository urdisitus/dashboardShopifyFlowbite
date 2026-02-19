import swal, { SweetAlertResult } from "sweetalert2";
import { retry } from "rxjs/operators";

export class Utils {
  static clone<T>(origin: T, external: any): T {
    if (external) {
      for (const key in external) {
        if (external.hasOwnProperty(key)) {
          const element = external[key];
          if (element && !origin[key]) {
            origin[key] = element;
          }
        }
      }
    }
    return origin;
  }

  static confirm(
    message: string,
    onConfirm: () => void,
    onCancel: () => void = null) {
    swal({
      title: "Confirmación",
      text: message,
      type: "question",
      showCancelButton: true,
      //confirmButtonColor: "#26FF52",
      confirmButtonText: "Aceptar",
      //cancelButtonColor: "#CCCCCC",
      cancelButtonText: "Cancelar"
    }).then((result: SweetAlertResult) => {
      if (result.value) {
        if (onConfirm) {
          onConfirm();
        }
      } else {
        if (onCancel) {
          onCancel();
        }
      }
    });
  }

  static showAlert(
    title: string,
    message: string,
    onConfirm: () => void = null) {
    swal({
      title: title,
      text: message,
      type: "success",
      showCancelButton: false,
      confirmButtonText: "Aceptar",
    }).then((result: SweetAlertResult) => {
      if (onConfirm) {
        onConfirm();
      }
    });
  }

  public static tableConfigEs(): any {
    return {
      responsive: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      language: {
        search: "Buscar:",
        searchPlaceholder: '¿Qué estás buscando?',
        infoEmpty: "Mostrando desde 0 hasta 0 de 0 registros",
        emptyTable: "No hay datos para mostrar.",
        info: "Mostrando desde _START_ hasta _END_ de _TOTAL_ registros",
        infoFiltered: "(filstrados de _MAX_ total de registros)",
        lengthMenu: "Mostrar _MENU_ registros",
        zeroRecords: "No hay registros que coincidan con el criterio.",
        paginate: {
          first: "Primero",
          last: "Último",
          next: "Siguiente",
          previous: "Anterior"
        },
      }
    };
  }

  static aviso(
    message: string,
    onConfirm: () => void) {
    swal({
      title: "Aviso",
      text: message,
      type: "question",
      showCancelButton: false,
      confirmButtonText: "Aceptar",
    }).then((result: SweetAlertResult) => {
      if (result.value) {
        if (onConfirm) {
          onConfirm();
        }
      }
    });
  }
}
