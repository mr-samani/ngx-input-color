import { CMYK, HSLA, HSVA, RGBA } from './interfaces';
import { NgxColor } from '../utils/color-helper';

export type ColorInput = string | CMYK | HSLA | HSVA | RGBA | NgxColor;
