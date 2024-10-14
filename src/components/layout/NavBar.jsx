import CompanyLogo from "../../assets/images/all-in-one_logo.png";
import RequestPageIcon from "../../assets/images/request-page-icon.png";
import TeamsListIcon from "../../assets/images/teamslist.png";

function NavBar() {
    return (
        <div className="w-[100%] h-[100%]" style={{ paddingTop: '20px' }}>
            <a href="/">
                <img src={CompanyLogo} alt="Company logo" style={{ width: '40%', margin: 'auto' }} />
            </a>
            <a href="/request">
                <img src={RequestPageIcon} alt="Request page icon" style={{ width: '40%', margin: 'auto', marginTop: '40px', padding: '10px' }} />
            </a>
            <a href="/teams">
                <img src={TeamsListIcon} alt="Teams list icon" style={{ width: '40%', margin: 'auto', marginTop: '40px', padding: '10px' }} />
            </a>
        </div>
    )
}

export default NavBar