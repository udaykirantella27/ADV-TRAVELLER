import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TrackerPage from './TrackerPage';

export const metadata = {
  title: 'Ride Tracker — ADV Rider',
  description: 'Track your rides, mileage, and service reminders. Know exactly when your bike needs attention.',
};

export default function Tracker() {
  return (
    <>
      <Navbar />
      <TrackerPage />
      <Footer />
    </>
  );
}
