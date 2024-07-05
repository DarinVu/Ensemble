import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'embed'
})
export class EmbedPipe implements PipeTransform {

  transform(value: string): string {
    return "https://www.youtube.com/embed/" +  value.substring(17);
  }

}
