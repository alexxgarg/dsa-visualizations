import { IMarker } from "react-ace";

export interface GraphSearchVisualizationInterface{
    type: 'node' | 'path';
    nodeId?: string;
    pathStartId? : string;
    pathEndId? : string;
    nodeColor?: string;
    pathColor?: string;
    searchValue: string[];
    currentLineMarkers : IMarker[]; 
}

export interface BreadthFirstSearchVisualizationInterface{
    type: 'node' | 'path';
    nodeId?: string;
    pathStartId? : string;
    pathEndId? : string;
    nodeColor?: string;
    pathColor?: string;
    searchValue: string[];
    queue: string[];
    currentLineMarkers : IMarker[]; 
}