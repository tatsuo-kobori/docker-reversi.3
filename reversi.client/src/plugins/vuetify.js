// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

const reversiTheme = {
  colors: {
    background: '#808080',
    surface: '#f0fff0',
    primary: '#4caf50',
    panel: '#f5fffa',
  }
}
export default createVuetify({
  theme: {
    defaultTheme: 'reversiTheme',
    themes: {
      reversiTheme,
    }
  }
})

