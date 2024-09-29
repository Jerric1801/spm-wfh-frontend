import SettingsIcon from "../../assets/images/settings_icon.png"; 
//import ProfilePicture from "../../assets/images/manager_profile.jpg"; // to make dynamic 

//async 
function TopProfileBar() {

    // to replace with dynamic credentials after login
    // not sure how to generate imgPath yet tho
    const user =  {fName: "Jack", lName: "Sim" };
    const imgPath = "lego/1";

    //const ProfilePicture = await import('../../assets/images/manager_profile.jpg');

    return (
        <div className="w-[100%] h-[100%]" style={{ display: 'flex', flexDirection:'row', justifyContent:'flex-end', }}>
            <img src={SettingsIcon} alt="Settings icon" style={{ alignSelf:'flex-end',marginBlock: 'auto', marginRight:'20px', width:'2%'}}/>
            <img src={`https://randomuser.me/api/portraits/med/${imgPath}.jpg`} alt="Your profile picture"  style={{ padding:'10px', marginRight:'10px', borderRadius: '50%'}}/> 
            <h1 style={{marginBlock: 'auto', marginRight:'20px'}} className="text-tag-grey-dark"><b>{user.fName} {user.lName}</b></h1>
        </div>
    )
}


/*
function loadComponent() {
    import('../../assets/images/manager_profile.jpg')
      .then((module) => {
        const MyComponent = module.default;
        // Use MyComponent here
      })
      .catch((error) => {
        console.error('Error loading component:', error);
      });
  }
      */


export default TopProfileBar