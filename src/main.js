import { createApp } from 'vue'
import App from './App.vue'
import 'beercss'
import 'material-dynamic-colors'
import './form-fixes.css'
// Automatic PWA service worker registration and foreground update checks
if ('serviceWorker' in navigator) {
  let refreshing = false
  let hadController = Boolean(navigator.serviceWorker.controller)

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hadController && !refreshing) {
      refreshing = true
      window.location.reload()
    }
    hadController = true
  })

  // Proactively unregister legacy Vue CLI service worker if present
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const reg of registrations) {
      const scriptURL = reg.active?.scriptURL || reg.waiting?.scriptURL || reg.installing?.scriptURL || ''
      if (scriptURL.endsWith('/service-worker.js')) {
        reg.unregister()
      }
    }
  }).catch(() => {})

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: './' }).then((registration) => {
      // Check for updates when app is resumed or tab becomes visible
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          registration.update()
        }
      })

      // Check for updates when window gains focus
      window.addEventListener('focus', () => {
        registration.update()
      })

      // Check periodically every 30 minutes while kept open
      setInterval(() => {
        registration.update()
      }, 30 * 60 * 1000)
    }).catch((err) => {
      console.warn('PWA registration failed:', err)
    })
  })
}

createApp(App).mount('#app')
