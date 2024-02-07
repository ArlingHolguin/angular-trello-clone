import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-color',
  templateUrl: './card-color.component.html'
})
export class CardColorComponent  {

  @Input() color: 'sky' | 'yellow' | 'green' | 'gray' | 'purple' | 'red' | 'violet' = 'sky';
  mapColors = {
    sky:{
      'bg-sky-700': true,
      'hover:bg-sky-800': true,
      'text-white': true

    },
    yellow:{
      'bg-yellow-700': true,
      'hover:bg-yellow-800': true,
      'text-white': true
    },
    green:{
      'bg-green-700': true,
      'hover:bg-green-800': true,
      'text-white': true
    },
    gray:{
      'bg-gray-700': true,
      'hover:bg-gray-800': true,
      'text-white': true
    },
    purple:{
      'bg-purple-700': true,
      'hover:bg-purple-800': true,
      'text-white': true
    },
    red:{
      'bg-red-700': true,
      'hover:bg-red-800': true,
      'text-white': true
    },
    violet:{
      'bg-violet-700': true,
      'hover:bg-violet-800': true,
      'text-white': true
    }


  }

  constructor() { }

  

  get colors(){
    const clases = this.mapColors[this.color];
    return clases ? clases : {};
    
  }

}
