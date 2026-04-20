import { useRef, useState } from 'react';
import Banner from '../components/navBanner.tsx';
import '../index.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Workout() {
    const [start, setStart] = useState(false);
    const [end, setEnd] = useState(false);
    const [timeStart, setTimeStart] = useState(0.0);
    const [timeEnd, setTimeEnd] = useState(0.0);
    const [duration, setDuration] = useState(0.0);
    const intervalRef = useRef(0.0);
    const navigate = useNavigate();

    function HandleStartButton(){
        setStart(true);
        setEnd(false);
        setTimeStart(Date.now());
        intervalRef.current = setInterval(HandleInterval);
    }

    function HandleEndButton(){

        setDuration((timeEnd - timeStart)/1000);
        axios.get("http://localhost:8000/Workout-Complete", {params:{workoutDuration: }});
        setEnd(true);
        setStart(false);
    }

    function HandleInterval(){
        setTimeEnd(Date.now())
    }

    return(
        <div>
            <Banner />
            {!start && <button onClick={HandleStartButton}>Start Workout</button>}
            {end && <p>your workout took {duration.toFixed(0)}s</p>}
            {
                start &&
                <div>
                    <p>Time: {((timeEnd-timeStart)/1000).toFixed(0)}</p>
                    <div>Enjoy your workout!</div>
                    <button onClick={HandleEndButton}>End workout</button>
                </div>
            }
        </div>
        
    )
}

export default Workout