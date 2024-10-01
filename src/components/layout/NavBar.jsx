import { useLocation } from 'react-router-dom';
import CompanyLogo from "../../assets/images/all-in-one_logo.png";
import DashboardIcon from "../../assets/images/nav/dashboard.png";
import DashboardActiveIcon from "../../assets/images/nav/dashboard-active.png";
import RequestIcon from "../../assets/images/nav/request.png";
import RequestActiveIcon from "../../assets/images/nav/request-active.png";

function NavBar() {
  const location = useLocation();

  return (
    <div className="w-[100%] h-[100%] flex flex-col gap-[40px]" style={{ paddingTop: '20px' }}>
      <a href="/">
        <img src={CompanyLogo} alt="Company logo" style={{ width: '40px', margin: 'auto' }} />
      </a>
      <a href="/" className={location.pathname === '/' ? 'active-link' : ''}>
        <img 
          src={location.pathname === '/' ? DashboardActiveIcon : DashboardIcon} 
          alt="Dashboard icon" 
          style={{ width: '40px', margin: 'auto', padding: '10px' }} 
        />
      </a>
      <a href="/request" className={location.pathname === '/request' ? 'active-link' : ''}>
        <img 
          src={location.pathname === '/request' ? RequestActiveIcon : RequestIcon} 
          alt="Request page icon" 
          style={{ width: '40px', margin: 'auto', padding: '10px' }} 
        />
      </a>
    </div>
  );
}

export default NavBar;