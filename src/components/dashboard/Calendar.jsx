import Tag from '../common/Tag'

function Calendar() {
    return (
        <div className="w-[100%] h-[100%] p-10">
            <h1>Calendar Goes Here</h1>
            <h1 className='mt-5'>Example of Tag components:</h1>
            <div className='mt-5 flex gap-2'>
            <Tag text="Blue" color="blue" />
            <Tag text="Green" color="green" />
            <Tag text="Red" color="red" />
            <Tag text="Grey" color="grey" />
            <Tag text="Orange" color="orange" />
            </div>
            <div className='mt-5 flex gap-2'>
            <Tag text="Blue" color="blue" reverse={true} />
            <Tag text="Green" color="green" reverse={true} />
            <Tag text="Red" color="red" reverse={true} />
            <Tag text="Grey" color="grey" reverse={true} />
            <Tag text="Orange" color="orange" reverse={true} />
            </div>
        </div>
    )
}

export default Calendar