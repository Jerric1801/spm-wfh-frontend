function NavBar() {
    return (
        <div className="w-[100%] h-[100%]" >
        <a href="/">
            <img src="src/assets/images/all-in-one_logo.png" alt="Company logo" style={{ width: '40%',  margin: 'auto' , marginTop: '20px'}}/>
            </a>
            <a href="/RequestPage">
                <img src="src/assets/images/request-page-icon.png" alt="Request page icon" style={{ width: '40%', margin: 'auto', marginTop: '40px', padding: '10px'}}/>
            </a>
        </div>
    )
}

export default NavBar