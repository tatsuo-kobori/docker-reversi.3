/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

const reversiTheme = {
  colors: {
    background: '#808080',
    surface: '#f0fff0',
    primary: '#4caf50',
    panel: '#f5fffa',
  }
}
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'reversiTheme',
    themes: {
      reversiTheme,
    }
  },
})
