import { IMarker } from "react-ace";

export interface DjikstraAlgorithmVisualizationInterface{
    type: 'node' | 'path';
    nodeId?: string;
    pathStartId? : string;
    pathEndId? : string;
    nodeColor?: string;
    pathColor?: string;
    queue: string[];
    currentLineMarkers : IMarker[]; 
    rowNodeID?: string;
    columnNodeID?: string;
    distance?: string;
    cellColor?: string;
}