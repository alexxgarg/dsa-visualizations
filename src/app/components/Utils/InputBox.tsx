import AppContext from "@/context";
import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";

const InputBox = () =>{

    const [inputTextBox,setInputTextBox] = useState("");

    const {
        setInput,
        visualizationCategory,
    } = useContext(AppContext);


    const processInput = () =>{
        if(visualizationCategory===0 || visualizationCategory===1)
        {
            setInput(convertInputToArray(inputTextBox));
        }
    }

    const convertInputToArray = (input: string)=>{
        const elements = input.replace(/[\[\]]/g, '').trim().replace(" ","").split(',');
        console.log(elements);
        // Convert each element to a number and return the array
        return elements.map(element => parseFloat(element));
    }

    return (
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1" style={{
            width: '90%'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px',
                alignItems: 'center'
            }} >
            <Form.Label>Input</Form.Label>
            <Button onClick={()=>{
                processInput();
            }}>
                Run
            </Button>
            </div>
            <Form.Control as="textarea" rows={10} value={inputTextBox} onChange={(event)=>{
                setInputTextBox(event.target.value);

            }}/>
      </Form.Group>
    )
}

export default InputBox;