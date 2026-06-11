import './globals.css';
import 'leaflet/dist/leaflet.css';

export const metadata = {
  title: 'ADV Rider — The Adventure Motorcycle App',
  description: 'The first adventure bike app built by riders. Offline navigation, SOS, crash detection, and 29 survival features. Works at 0 bars.',
  themeColor: '#080808',
  openGraph: {
    title: 'ADV Rider — Ride Without Limits',
    description: 'Offline maps, SOS, crash detection, route builder — built by riders who know what it means to be stranded at 3am.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              const theme = localStorage.getItem('theme') || 'dark';
              document.documentElement.setAttribute('data-theme', theme);
            } catch (e) {}
          })();
        `}} />
      </head>
      <body>
        <div id="scroll-progress"></div>
        <div className="fire-cursor" id="cursor"></div>
        {children}
      </body>
    </html>
  );
}
