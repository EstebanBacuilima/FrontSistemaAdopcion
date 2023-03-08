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

      // Agregamos la condición para priorizar solicitudes con estado "E" o "P"
      // if (a.estado === 'E' || a.estado === 'P') {
      //   return -1; // Si a tiene prioridad, lo colocamos antes que b
      // } else if (b.estado === 'E' || b.estado === 'P') {
      //   return 1; // Si b tiene prioridad, lo colocamos antes que a
      // }

      return diferenciaFechaA - diferenciaFechaB;
    });
  }

}
