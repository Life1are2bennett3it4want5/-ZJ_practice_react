import "../index.css"
function Banner(){
    return(
       <div className="bg-black">
            <div className="flex justify-center space-x-10 space-y-2 text-black font-bold">
                <button className="bg-white"><a href="/">Start workout</a></button>
                <button className="bg-white"><a href="/page1">Measurements</a></button>
                <button className="bg-white"><a href="/page2">Exercises</a></button>
                <button className="bg-white"><a href="/page3">History</a></button>
            </div>
       </div>
    )
}

export default Banner