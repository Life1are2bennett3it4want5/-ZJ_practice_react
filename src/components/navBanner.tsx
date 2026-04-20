import "../index.css"
function Banner(){
    return(
       <div className="bg-black">
            <div className="flex justify-center items-center gap-10 py-2 text-white font-bold">
                <a href="/" className="hover:text-blue-600">Start workout</a>
                <a href="/page1" className="hover:text-blue-600">Measurements</a>
                <a href="/page2" className="hover:text-blue-600">Exercises</a>
                <a href="/page3" className="hover:text-blue-600">History</a>
            </div>
       </div>
    )
}

export default Banner