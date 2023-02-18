import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroMascotas'
})
export class FiltroMascotasPipe implements PipeTransform {

  transform(value: any, arg: any): any {

    if (arg.toLowerCase() === 'perros') {
      arg = 'canino';
    } else if (arg.toLowerCase() === 'gatos') {
      arg = 'felino';
    }

    if (arg === '' || arg.length < 3) return value;
    const resultPosts = [];
    console.log('valor -> ' + arg)
    for (const post of value) {
      if (post.raza && post.raza.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultPosts.push(post);
      } else if (post.especie && post.especie.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        console.log('especie ->' + post.especie)
        resultPosts.push(post);
      }
    };
    return resultPosts;
  }
}
