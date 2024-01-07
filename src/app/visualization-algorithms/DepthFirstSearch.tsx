import { GraphSearchVisualizationInterface } from "../interfaces/GraphSearchVisualizationInterface";
import { deepCopy } from "./mergesort";

export function depthFirstSearch(graph: Map<string,string[]>, start: string): GraphSearchVisualizationInterface[] {
    let visited: string[] = [];
    let animations : GraphSearchVisualizationInterface[] = [];
    function dfs(node: string) {
        animations.push({
            type: 'node',
            nodeId: node,
            nodeColor: 'yellow',
            searchValue: deepCopy(visited),
            currentLineMarkers: [{startRow: 0, startCol: 0, endRow: 0, endCol: 1000, className: 'myMarker',type: 'text'}]
        })
        if (!visited.includes(node)) {
            animations.push({
                type: 'node',
                nodeId: node,
                nodeColor: 'red',
                searchValue: deepCopy(visited),
                currentLineMarkers: [{startRow: 1, startCol: 0, endRow: 1, endCol: 1000, className: 'myMarker',type: 'text'}]
            })
            visited.push(node);
            animations.push({
                type: 'node',
                nodeId: node,
                nodeColor: 'green',
                searchValue: deepCopy(visited),
                currentLineMarkers: [{startRow: 2, startCol: 0, endRow: 2, endCol: 1000, className: 'myMarker',type: 'text'}]
            })
            const neighbors = graph.get(node);
            if (neighbors) {
                neighbors.forEach(neighbor => {
                    animations.push({
                        type: 'path',
                        pathStartId: node,
                        pathEndId: neighbor,
                        pathColor: 'green',
                        searchValue: deepCopy(visited),
                        currentLineMarkers: [{startRow: 4, startCol: 0, endRow: 4, endCol: 1000, className: 'myMarker',type: 'text'}]
                    })
                    dfs(neighbor)
                    animations.push({
                        type: 'path',
                        pathStartId: node,
                        pathEndId: neighbor,
                        pathColor: 'black',
                        searchValue: deepCopy(visited),
                        currentLineMarkers: []
                    })
                });
            }
        }
        animations.push({
            type: 'node',
            nodeId: node,
            nodeColor: 'transparent',
            searchValue: deepCopy(visited),
            currentLineMarkers: []
        })
    }

    dfs(start);
    return animations;
}