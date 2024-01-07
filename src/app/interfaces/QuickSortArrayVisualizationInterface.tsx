import { IMarker } from "react-ace";
import { NodeTree } from "../components/Utils/DivideAndConquerArrayTree";


export interface Pivot{
    pivotID: number;
    pivotValue: string;
    pivotIndex: string;
}

export interface QuickSortArrayVisualizationInterface{
    value: number[];
    valueI: number;
    valueJ: number;
    indexI: number;
    indexJ: number;
    colorI: string;
    colorJ: string;
}


export interface QuickSortArrayVisualizationAnimationInterface{
    nodeTrees: NodeTree[];
    currentLineMarkers : IMarker[];
    pivotId: number;
    pivotValue: string;
    pivotIndex: string;
}