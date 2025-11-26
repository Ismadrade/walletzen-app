import SideNav from './components/sidenav/SideNav';
import Navbar from './components/navbar/Navbar';
import Home from './pages/Home/Home';

export default function App() {
  return (
    <div style={{ display: 'flex' }}>
      <SideNav />
      <div style={{ flex: 1 }}>
        <Navbar />
        <Home />
      </div>
    </div>
  );
}
