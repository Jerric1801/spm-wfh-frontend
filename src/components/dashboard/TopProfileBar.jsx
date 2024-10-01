import SettingsIcon from "../../assets/images/settings_icon.png"; 
import ProfilePicture from "../../assets/images/manager_profile.jpg"; // to make dynamic 

function TopProfileBar() {
    return (
        <div className="w-[100%] h-[100%]" style={{ display: 'flex', flexDirection:'row', justifyContent:'flex-end', }}>
            
            <img src={SettingsIcon} alt="Settings icon" style={{ alignSelf:'flex-end',marginBlock: 'auto', marginRight:'20px', width:'25px'}}/>
            <img src={ProfilePicture} alt="Your profile picture"  style={{ padding:'10px', marginRight:'10px', borderRadius: '50%'}}/>
            <h1 style={{marginBlock: 'auto', marginRight:'20px'}} className="text-tag-grey-dark"><b>Yu Junjie</b></h1>
        </div>
    )
}

export default TopProfileBar