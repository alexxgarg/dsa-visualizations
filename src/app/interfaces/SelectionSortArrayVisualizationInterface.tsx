import { IMarker } from "react-ace";

export interface SelectionSortArrayVisualizationInterface{
    value: number;
    index: number;
    color: string;
}

export interface SelectionSortArrayVisualizationAnimationInterface{
    valueI: number;
    valueJ: number;
    indexI: number;
    indexJ: number;
    colorI: string;
    colorJ: string;
    currentLineMarkers : IMarker[]; 
    minValue: string;
    minIndex: string
}

const SelectionSortArrayVisualizationInterfaceComponent = ()=>{
    return(
        <div></div>
    )
}

export default SelectionSortArrayVisualizationInterfaceComponent;