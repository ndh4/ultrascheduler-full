import 'react-big-calendar/lib/css/react-big-calendar.css'
import { ToastProvider } from 'react-toast-notifications'

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <ToastProvider>
      <Component {...pageProps} />
    </ToastProvider>
  )
}