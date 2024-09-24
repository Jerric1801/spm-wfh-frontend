import CompanyLogo from "../../assets/images/all-in-one_logo.png";
import RequestPageIcon from "../../assets/images/request-page-icon.png";

function NavBar() {
    return (
        <div className="w-[100%] h-[100%]" style={{paddingTop:'20px'}}>
            <img src={CompanyLogo} alt="Company logo" style={{ width: '40%',  margin: 'auto' }}/>
            <img src={RequestPageIcon} alt="Request page icon" style={{ width: '40%', margin: 'auto', marginTop: '40px', padding: '10px'}}/>
            
        </div>
    )
}

export default NavBar