import { CMYK, HSLA, HSVA, RGBA } from './color-interface';
import { NgxColor } from '../utils/color-helper';

export type ColorInput = string | CMYK | HSLA | HSVA | RGBA | NgxColor;
