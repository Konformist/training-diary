import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'ru.konformist.trainingdiary',
  appName: 'Training Diary',
  webDir: 'dist',
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
  backgroundColor: '#A30000',
}

export default config
