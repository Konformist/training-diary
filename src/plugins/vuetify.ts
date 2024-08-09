/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
// import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import {
  mdiArrowLeft,
  mdiChevronLeft,
  mdiChevronRight, mdiClockTimeFourOutline,
  mdiCog, mdiContentCopy, mdiContentSave, mdiDelete, mdiDotsVertical, mdiFilterVariant,
  mdiFormatListBulleted, mdiHome,
  mdiInformation,
  mdiListBox,
  mdiMenu, mdiTriangleSmallDown, mdiWindowClose,
} from '@mdi/js'
import { VSnackbarQueue, VTimePicker } from 'vuetify/labs/components'
import { ru } from 'vuetify/locale'

const myCustomLightTheme = {
  dark: false,
  colors: {
    background: '#FFEEEE',
    surface: '#FFDDDD',
    'surface-bright': '#FFFFFF',
    'surface-light': '#221212',
    'surface-variant': '#424242',
    'on-surface-variant': '#EEEEEE',
    primary: '#A30000',
    'primary-darken-1': '#1F5592',
    secondary: '#539853',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
}
const myCustomDarkTheme = {
  dark: true,
  colors: {
    background: '#221212',
    surface: '#2D1D1D',
    'surface-bright': '#FFFFFF',
    'surface-light': '#221212',
    'surface-variant': '#424242',
    'on-surface-variant': '#EEEEEE',
    primary: '#A30000',
    'primary-darken-1': '#1F5592',
    secondary: '#1b5e20',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
}

const variant = 'solo-filled'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  blueprint: md3,
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      'chevron-right': mdiChevronRight,
      'chevron-left': mdiChevronLeft,
      menu: mdiMenu,
      'list-box': mdiListBox,
      'format-list-bulleted': mdiFormatListBulleted,
      cog: mdiCog,
      delete: mdiDelete,
      information: mdiInformation,
      'arrow-left': mdiArrowLeft,
      'clock-time-four-outline': mdiClockTimeFourOutline,
      'content-save': mdiContentSave,
      'content-copy': mdiContentCopy,
      'dots-vertical': mdiDotsVertical,
      'filter-variant': mdiFilterVariant,
      'window-close': mdiWindowClose,
      home: mdiHome,
      'triangle-small-down': mdiTriangleSmallDown,
    },
    sets: {
      mdi,
    },
  },
  components: {
    VTimePicker,
    VSnackbarQueue,
  },
  locale: {
    locale: 'ru',
    messages: { ru },
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: myCustomLightTheme,
      dark: myCustomDarkTheme,
    },
  },
  defaults: {
    VField: { variant },
    VTextField: { variant },
    VTextarea: { variant },
    VSelect: {
      variant,
      itemValue: 'id',
      itemTitle: 'name',
    },
    VAutocomplete: {
      variant,
      itemValue: 'id',
      itemTitle: 'name',
    },
  },
})
