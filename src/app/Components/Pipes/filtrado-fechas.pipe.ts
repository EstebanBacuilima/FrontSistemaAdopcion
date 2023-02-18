import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtradoFechas'
})
export class FiltradoFechasPipe implements PipeTransform {

  transform(solicitudes: any[]): any[] {
    let fechaActual = new Date();
    return solicitudes.sort((a, b) => {
      let diferenciaFechaA = Math.abs(fechaActual.getTime() - new Date(a.fecha_solicitud_adopcion).getTime());
      let diferenciaFechaB = Math.abs(fechaActual.getTime() - new Date(b.fecha_solicitud_adopcion).getTime());
      return diferenciaFechaA - diferenciaFechaB;
    });
  }

}
