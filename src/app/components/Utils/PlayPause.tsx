import AppContext from "@/context";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { Button, Form } from "react-bootstrap";

const PlayPauseComponent = () =>{
    const {
        isPlaying,
        setIsPlaying
    } = useContext(AppContext);
    return(
        <div style={{
            display: 'flex',
            flexDirection: 'column'
        }}>
        <Form.Label>Play</Form.Label>
        <Button onClick={()=>{
            setIsPlaying(!isPlaying);
        }}>
            {
                isPlaying ? <FontAwesomeIcon icon={faPause}/> : <FontAwesomeIcon icon={faPlay}/>
            }
        </Button>
        </div>
    )
}

export default PlayPauseComponent;