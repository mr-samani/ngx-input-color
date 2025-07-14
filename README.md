# NgxInputColor & NgxInputGradient

**NgxInputColor** and **NgxInputGradient** are powerful, customizable Angular input components for color and gradient picking. They support multiple color formats, real-time preview, inline and input modes, and seamless integration with Angular forms.

## [Demo](https://mr-samani.github.io/ngx-input-color/)

![](https://mr-samani.github.io/ngx-input-color/screenshot.png)

## Features

- 🎨 **Multiple Color Formats**: HEX, RGBA, HSLA, HSVA, CMYK (for color), and full CSS gradients (for gradient)
- 🖱️ **Interactive UI**: Drag-and-drop sliders for hue, saturation, lightness, alpha, and more
- 🧩 **Angular Forms Integration**: Works with `ngModel` and reactive forms
- 👁️ **EyeDropper API**: Pick colors from anywhere on your screen (if supported)
- 🖌️ **Live Preview**: Instantly see the selected color or gradient
- 🛠️ **Customizable**: Change button titles, show/hide close button, set input background color, and more
- 🧪 **Unit Tested**: Includes comprehensive unit tests
- 🟦 **Inline & Input Modes**: Use as a popup input or as an always-visible inline component

---

## Installation

```bash
npm install ngx-input-color
# or
yarn add ngx-input-color
# or
pnpm add ngx-input-color
```

---

## Usage

### 1. Import the Module

```typescript
import { NgxInputColorModule } from 'ngx-input-color';
```

### 2. Input Mode (Popup)

#### Color Picker Input

```html
<input ngxInputColor [(ngModel)]="color" [closeTitle]="'Cancel'" [confirmTitle]="'Select'" />
<span>Selected: {{ color }}</span>
```

#### Gradient Picker Input

```html
<input ngxInputGradient [(ngModel)]="gradient" [closeTitle]="'Cancel'" [confirmTitle]="'Select'" />
<span>Selected: {{ gradient }}</span>
```

### 3. Inline Mode (Always Visible)

#### Inline Color Picker

```html
<ngx-input-color [(ngModel)]="inlineColor" [showCloseButton]="true" [showConfirmButton]="true" [simpleMode]="false"></ngx-input-color>
<span>Selected: {{ inlineColor }}</span>
```

#### Inline Gradient Picker

```html
<ngx-input-gradient [(ngModel)]="inlineGradient" [showCloseButton]="true" [confirmTitle]="'Done'"></ngx-input-gradient>
<span>Selected: {{ inlineGradient }}</span>
```

---

## API Reference

### NgxInputColor (Input & Inline)

| Name                          | Type                   | Default   | Description                                    |
| ----------------------------- | ---------------------- | --------- | ---------------------------------------------- |
| `closeTitle`                  | `string`               | 'Close'   | Text for the close button                      |
| `confirmTitle`                | `string`               | 'Ok'      | Text for the confirm button                    |
| `showCloseButton`             | `boolean`              | `false`   | Show/hide the close button                     |
| `showConfirmButton`           | `boolean`              | `false`   | Show/hide the confirm button                   |
| `setInputBackgroundColor`     | `boolean`              | `true`    | Set input background to selected color         |
| `simpleMode`                  | `boolean`              | `false`   | Compact UI for inline use                      |
| `defaultInspector`            | `ColorInspector` enum  | Picker    | Default inspector (Picker, RGB, HSL, CMYK)     |
| `[(ngModel)]` / `formControl` | `string`               |           | Two-way binding for the selected color         |
| `change` (Output)             | `EventEmitter<string>` |           | Emits the color value on change                |
| `confirm` (Output)            | `EventEmitter<string>` |           | Emits the color value when confirmed           |
| `cancel` (Output)             | `EventEmitter<void>`   |           | Emits when the color picker is closed/canceled |

#### Supported Color Formats

- HEX (`#RRGGBB` or `#RRGGBBAA`)
- RGBA (`rgba(255,255,255,1)`)
- HSLA (`hsla(360,100%,100%,1)`)
- HSVA
- CMYK

---

### NgxInputGradient (Input & Inline)

| Name                          | Type                   | Default   | Description                                    |
| ----------------------------- | ---------------------- | --------- | ---------------------------------------------- |
| `closeTitle`                  | `string`               | 'Close'   | Text for the close button                      |
| `confirmTitle`                | `string`               | 'Ok'      | Text for the confirm button                    |
| `showCloseButton`             | `boolean`              | `true`    | Show/hide the close button                     |
| `[(ngModel)]` / `formControl` | `string`               |           | Two-way binding for the selected gradient      |
| `change` (Output)             | `EventEmitter<string>` |           | Emits the gradient value on change             |
| `confirm` (Output)            | `EventEmitter<string>` |           | Emits the gradient value when confirmed        |
| `cancel` (Output)             | `EventEmitter<void>`   |           | Emits when the gradient picker is closed       |

#### Supported Gradient Formats

- CSS Linear Gradients (e.g. `linear-gradient(90deg, #ff0000 0%, #00ff00 100%)`)
- CSS Radial Gradients (e.g. `radial-gradient(circle, #ff0000 0%, #00ff00 100%)`)

---

## License

MIT