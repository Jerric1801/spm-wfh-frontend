//Dashboard Components
import Calendar from '../components/dashboard/Calendar'
import LeftFilterPanel from '../components/dashboard/LeftFilterPanel'
import TopFilterPanel from '../components/dashboard/TopFilterPanel'
import TopProfileBar from '../components/dashboard/TopProfileBar'

function Dashboard() {
    return (
        <div className="grid grid-cols-12 grid-rows-12 gap-0 h-screen">
            {/* Top Profile Bar */}
            <div className="col-span-12 row-span-1 shadow-sm">
                <TopProfileBar />
            </div>

            {/* Left Filter Panel */}
            <div className="col-span-3 row-span-11 shadow-md">
                <LeftFilterPanel />
            </div>

            {/* Calendar */}
            <div className="col-span-9 row-span-2 shadow-md">
                <TopFilterPanel />
            </div>

            <div className="col-span-9 row-span-9 shadow-md">
                <Calendar />
            </div>


        </div>
    );
}

export default Dashboard