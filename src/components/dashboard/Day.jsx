import Tag from '../common/Tag'

function Day({ day, tags }) {
    const isToday = day.isToday;

    //TODO: example tags to translate to data folder
    

    return (
        <div className={`p-5 border border-gray-200 text-left ${isToday ? 'bg-green' : ''}`}>
            <div className={`${isToday ? 'text-white' : 'text-gray-500'}`}>{day.number}</div>
            <div className="flex flex-col h-auto w-[100%]">

            </div>
        </div>
    );
}

export default Day;