# ngx-input-color

## Color Picker, Gradient Picker and Box Shadow

[![npm version](https://img.shields.io/npm/v/ngx-input-color.svg)](https://www.npmjs.com/package/ngx-input-color)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**ngx-input-color** and **ngx-input-gradient** are powerful, customizable Angular components for color and gradient picking. They support multiple color formats, real-time preview, inline and input modes, and seamless integration with Angular forms.

## 🚀 Live Demo

[View Demo](https://mr-samani.github.io/ngx-input-color/)

![Screenshot](https://mr-samani.github.io/ngx-input-color/screenshot.jpg)

---

## ✨ Features

- **Multiple Color Formats:** HEX, RGBA, HSLA, HSVA, CMYK (for color), and full CSS gradients (for gradient)
- **Interactive UI:** Drag-and-drop sliders for hue, saturation, lightness, alpha, and more
- **Angular Forms Integration:** Works with `ngModel` and reactive forms
- **EyeDropper API Support:** Pick colors from anywhere on your screen (if supported)
- **Live Preview:** Instantly see the selected color or gradient
- **Highly Customizable:** set input background color, Simple mode and more
- **Inline & Input Modes:** Use as a popup input or as an always-visible inline component
- **Unit Tested:** Includes comprehensive unit tests

---

## 📦 Installation

```bash
npm install ngx-input-color
# or
yarn add ngx-input-color
# or
pnpm add ngx-input-color
```

---

## 🛠️ Usage

### Import in standalone component or module

```typescript

import { NgxInputColor } from 'ngx-input-color/color-picker';

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [FormsModule, NgxInputColor,...],
})
...
```

### Input Mode (Popup)

- Color Picker Input

```html
<input ngxInputColor [(ngModel)]="color" />
<span>Selected: {{ color }}</span>
```

- Gradient Picker Input

```typescript
import { NgxInputGradient } from 'ngx-input-color/gradient-picker';

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [FormsModule, NgxInputGradient,...],
  template:`
  <input ngxInputGradient [(ngModel)]="gradient" />
  <span>Selected: {{ gradient }}</span>
  `
})
...

```

### Inline Mode (Always Visible)

- Inline Color Picker

```html
<ngx-input-color [(ngModel)]="inlineColor" [simpleMode]="false"></ngx-input-color>
<span>Selected: {{ inlineColor }}</span>
```

- Inline Gradient Picker

```html
<ngx-input-gradient [(ngModel)]="inlineGradient"></ngx-input-gradient>
<span>Selected: {{ inlineGradient }}</span>
```

---

## 📚 API Reference

### NgxInputColor (Input & Inline)

| Name                          | Type                   | Default | Description                                |
| ----------------------------- | ---------------------- | ------- | ------------------------------------------ |
| `setInputBackgroundColor`     | `boolean`              | `true`  | Set input background to selected color     |
| `simpleMode`                  | `boolean`              | `false` | Compact UI                                 |
| `useAlphaChannel`             | `boolean`              | `true`  | Use alpha channel                 |
| `defaultInspector`            | `ColorInspector` enum  | Picker  | Default inspector (Picker, RGB, HSL, CMYK) |
| `[(ngModel)]` / `formControl` | `string`               |         | Two-way binding for the selected color     |
| `change` (Output)             | `EventEmitter<string>` |         | Emits the color value on change            |

#### Supported Color Formats

- HEX (`#RRGGBB` or `#RRGGBBAA`)
- RGBA (`rgba(255,255,255,1)`)
- HSLA (`hsla(360,100%,100%,1)`)
- HSVA
- CMYK

---

### NgxInputGradient (Input & Inline)

| Name                          | Type                   | Default | Description                               |
| ----------------------------- | ---------------------- | ------- | ----------------------------------------- |
| `[(ngModel)]` / `formControl` | `string`               |         | Two-way binding for the selected gradient |
| `change` (Output)             | `EventEmitter<string>` |         | Emits the gradient value on change        |

#### Supported Gradient Formats

- CSS Linear Gradients (e.g. `linear-gradient(90deg, #ff0000 0%, #00ff00 100%)`)
- CSS Radial Gradients (e.g. `radial-gradient(circle, #ff0000 0%, #00ff00 100%)`)

---

## ⚙️ Customization

- visibility, and UI modes are fully customizable via component inputs.
- Works seamlessly with both Template-driven and Reactive Forms.

---

## 🧪 Testing & Development

- This library includes comprehensive unit tests. Run `ng test` to verify functionality.
- Contributions are welcome! Please open an issue or submit a pull request.

---

## ❓ FAQ

- **Can I programmatically set the color/gradient?**  
  Yes, simply update the variable bound to `ngModel` or your form control.

- **Is EyeDropper API supported?**  
  Yes, in modern browsers that support the EyeDropper API.

---

## 📄 License

MIT

---

## 🔗 Useful Links

- [Live Demo](https://mr-samani.github.io/ngx-input-color/)
- [Storybook Documentation](https://mr-samani.github.io/ngx-input-color/storybook/)
- [GitHub Repository](https://github.com/mr-samani/ngx-input-color)

---

> Developer: [Mohammadreza Samani](https://github.com/mr-samani)

> Made With 🧡 From IRAN
