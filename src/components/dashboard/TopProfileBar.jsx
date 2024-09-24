function TopProfileBar() {
    return (
        <div className="w-[100%] h-[100%]" style={{ display: 'flex', flexDirection:'row', justifyContent:'flex-end', }}>
            <img src="../../src/assets/images/settings_icon.png" alt="Settings icon" style={{ alignSelf:'flex-end',marginBlock: 'auto', marginRight:'20px', width:'2%'}}/>
            <img src="../../src/assets/images/manager_profile.jpg" alt="Your profile picture"  style={{ padding:'10px', marginRight:'10px', borderRadius: '50%'}}/>
            <h1 style={{marginBlock: 'auto', marginRight:'20px'}} className="text-tag-grey-dark"><b>Yu Junjie</b></h1>
        </div>
    )
}

export default TopProfileBar