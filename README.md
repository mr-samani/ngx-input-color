# NgxInputColor

**NgxInputColor** is a powerful, customizable Angular color picker input component. It supports multiple color formats, real-time preview, and seamless integration with Angular forms.

## Features

- 🎨 **Multiple Color Formats**: Supports HEX, RGBA, HSLA, HSVA, and CMYK.
- 🖱️ **Interactive UI**: Drag-and-drop sliders for hue, saturation, lightness, alpha, and more.
- 🧩 **Angular Forms Integration**: Works with `ngModel` and reactive forms.
- 👁️ **EyeDropper API**: Pick colors directly from anywhere on your screen (if supported by the browser).
- 🖌️ **Live Preview**: Instantly see the selected color in HEX and RGBA.
- 🛠️ **Customizable**: Change button titles, show/hide close button, and set input background color.
- 🧪 **Unit Tested**: Includes comprehensive unit tests.

## Installation

With **npm**:

```bash
npm install ngx-input-color
```

With **yarn**:

```bash
yarn add ngx-input-color
```

With **pnpm**:

```bash
pnpm add ngx-input-color
```

## Usage

1. **Import the Module:**

   ```typescript
   import { NgxInputColorModule } from 'ngx-input-color';
   ```

2. **Add to Your Template:**

   ```html
   <input ngxInputColor [(ngModel)]="color" name="myColor" />
   ```

3. **Use in Reactive Forms:**

   ```html
   <input ngxInputColor formControlName="color" />
   ```

## Inputs & Outputs

| Name                          | Type                   | Default | Description                                    |
| ----------------------------- | ---------------------- | ------- | ---------------------------------------------- |
| `closeTitle`                  | `string`               | 'Close' | Text for the close button                      |
| `confirmTitle`                | `string`               | 'Ok'    | Text for the confirm button                    |
| `showCloseButton`             | `boolean`              | `false` | Show/hide the close button                     |
| `setInputBackgroundColor`     | `boolean`              | `true`  | Set input background to selected color         |
| `[(ngModel)]` / `formControl` | `string`               |         | Two-way binding for the selected color         |
| `change` (Output)             | `EventEmitter<string>` |         | Emits the color value on change                |
| `confirm` (Output)            | `EventEmitter<string>` |         | Emits the color value when confirmed           |
| `cancel` (Output)             | `EventEmitter<void>`   |         | Emits when the color picker is closed/canceled |

### Supported Color Formats

- HEX (`#RRGGBB` or `#RRGGBBAA`)
- RGBA (`rgba(255,255,255,1)`)
- HSLA (`hsla(360,100%,100%,1)`)
- HSVA
- CMYK

## Example

```html
<input ngxInputColor [(ngModel)]="color" [closeTitle]="'Cancel'" [confirmTitle]="'Select'" />
<span>Selected: {{ color }}</span>
```

## License

MIT
