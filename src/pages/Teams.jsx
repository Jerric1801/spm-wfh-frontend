import TopProfileBar from '../components/dashboard/TopProfileBar'

function TeamRequest() {
    return (
        <div className="grid grid-cols-12 grid-rows-12 gap-0 h-screen">
            {/* Top Profile Bar */}
            <div className="col-span-12 row-span-1 shadow-sm">
                <TopProfileBar />
            </div>
            <div className="col-span-12 row-span-11 bg-gray-100 flex justify-center items-center">
                <h1>Teams Request Page in Progress...</h1>
            </div>
        </div>
    );
}
export default TeamRequest