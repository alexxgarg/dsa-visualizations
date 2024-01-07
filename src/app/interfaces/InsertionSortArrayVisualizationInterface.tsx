import { IMarker } from "react-ace";

export interface InsertionSortArrayVisualizationInterface{
    value: number;
    index: number;
    color: string;
}

export interface InsertionSortArrayVisualizationAnimationInterface{
    valueI: number;
    valueJ: number;
    indexI: number;
    indexJ: number;
    colorI: string;
    colorJ: string;
    currentLineMarkers : IMarker[]; 
    keyValue: string;
}

const BubbleSortArrayVisualizationInterfaceComponent = ()=>{
    return(
        <div></div>
    )
}

export default BubbleSortArrayVisualizationInterfaceComponent;