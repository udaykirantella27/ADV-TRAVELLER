import Navbar from '../components/Navbar';
import MapPage from './MapPage';

export const metadata = {
  title: 'Live Map — ADV Rider',
  description: 'Interactive adventure motorcycle map with routes, hazards, fuel stations, mechanics, and biker-friendly stays across India.',
};

export default function Map() {
  return (
    <>
      <Navbar />
      <MapPage />
    </>
  );
}
