import { IMarker } from "react-ace";

export interface BubbleSortArrayVisualizationInterface{
    value: number;
    index: number;
    color: string;
}

export interface BubbleSortArrayVisualizationAnimationInterface{
    valueI: number;
    valueJ: number;
    indexI: number;
    indexJ: number;
    colorI: string;
    colorJ: string;
    currentLineMarkers : IMarker[]; 
}

const BubbleSortArrayVisualizationInterfaceComponent = ()=>{
    return(
        <div></div>
    )
}

export default BubbleSortArrayVisualizationInterfaceComponent;