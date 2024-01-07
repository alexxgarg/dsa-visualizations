import AppContext from '@/context';
import { useContext } from 'react';
import Form from 'react-bootstrap/Form';

function SpeedComponent() {

    const {
        speedValue,
        setSpeedValue
    } = useContext(AppContext);

  return (
    <div style={{
      width: '80%',
    }}>
      <Form.Label>Speed</Form.Label>
      <Form.Range min={1} max={10} value={speedValue} onChange={(event)=>{
        setSpeedValue(parseInt(event.target.value));
      }}/>
    </div>
  );
}

export default SpeedComponent;