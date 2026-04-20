import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ standalone: true, name: 'enumToArray' })
export class EnumToArrayPipe implements PipeTransform {
  /**
   *  when data enum like:
   * A=1,
   * B=2,
   * C=3
   */
  transform(data: Object) {
    // The list should be sorted due to the existence of negative ENUMs
    const keys = Object.keys(data).sort();
    // return key of enum => men,women,...
    // return keys.slice(keys.length / 2);
    // return value of enum => 0,1,2,3
    return keys.slice(0, keys.length / 2);
  }
}

@Pipe({ standalone: true, name: 'enumToArrayStringValue' })
export class EnumToArrayStringValuePipe implements PipeTransform {
  /**
   *  when data enum like:
   * A='A',
   * B='B',
   * C='C'
   */
  transform(data: Object, sort = true) {
    let keys = Object.keys(data);
    if (sort) keys = keys.sort();
    return keys;
  }
}
