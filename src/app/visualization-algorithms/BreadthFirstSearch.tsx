import { BreadthFirstSearchVisualizationInterface, GraphSearchVisualizationInterface } from "../interfaces/GraphSearchVisualizationInterface";
import { deepCopy } from "./mergesort";

export function breadthFirstSearch(graph: Map<string, string[]>, start: string): BreadthFirstSearchVisualizationInterface[] {
    let visited: string[] = [];
    let queue: string[] = [];
    let animations: BreadthFirstSearchVisualizationInterface[] = [];

    // Enqueue the starting node
    queue.push(start);

    animations.push({
        type: 'node',
        nodeId: start,
        nodeColor: 'green',
        searchValue: deepCopy(visited),
        queue: deepCopy(queue),
        currentLineMarkers: [{startRow: 5, startCol: 0, endRow: 5, endCol: 1000, className: 'myMarker',type: 'text'}]
    });

    while (queue.length > 0) {
        const node = queue.shift();
        animations.push({
            type: 'node',
            nodeId: node,
            nodeColor: 'yellow',
            searchValue: deepCopy(visited),
            queue: deepCopy(queue),
            currentLineMarkers: [{startRow: 8, startCol: 0, endRow: 8, endCol: 1000, className: 'myMarker',type: 'text'}]
        });
        if (!node) continue;
        // Visit the node if it's not already visited
        if (!visited.includes(node)) {
            animations.push({
                type: 'node',
                nodeId: node,
                nodeColor: 'yellow',
                searchValue: deepCopy(visited),
                queue: deepCopy(queue),
                currentLineMarkers: [{startRow: 9, startCol: 0, endRow: 9, endCol: 1000, className: 'myMarker',type: 'text'}]
            });
            visited.push(node);
            animations.push({
                type: 'node',
                nodeId: node,
                nodeColor: 'green',
                searchValue: deepCopy(visited),
                queue: deepCopy(queue),
                currentLineMarkers: [{startRow: 10, startCol: 0, endRow: 10, endCol: 1000, className: 'myMarker',type: 'text'}]
            });

            // Get the neighbors of the node
            const neighbors = graph.get(node);
            animations.push({
                type: 'node',
                nodeId: node,
                nodeColor: 'green',
                searchValue: deepCopy(visited),
                queue: deepCopy(queue),
                currentLineMarkers: [{startRow: 11, startCol: 0, endRow: 11, endCol: 1000, className: 'myMarker',type: 'text'}]
            });
            if (neighbors) {
                neighbors.forEach(neighbor => {
                    animations.push({
                        type: 'path',
                        pathStartId: node,
                        pathEndId: neighbor,
                        pathColor: 'yellow',
                        searchValue: deepCopy(visited),
                        queue: deepCopy(queue),
                        currentLineMarkers: [{startRow: 12, startCol: 0, endRow: 12, endCol: 1000, className: 'myMarker',type: 'text'}]
                    })
                    if (!visited.includes(neighbor)) {
                        animations.push({
                            type: 'path',
                            pathStartId: node,
                            pathEndId: neighbor,
                            pathColor: 'green',
                            searchValue: deepCopy(visited),
                            queue: deepCopy(queue),
                            currentLineMarkers: [{startRow: 13, startCol: 0, endRow: 13, endCol: 1000, className: 'myMarker',type: 'text'}]
                        })
                        animations.push({
                            type: 'node',
                            nodeId: neighbor,
                            nodeColor: 'yellow',
                            searchValue: deepCopy(visited),
                            queue: deepCopy(queue),
                            currentLineMarkers: [{startRow: 13, startCol: 0, endRow: 13, endCol: 1000, className: 'myMarker',type: 'text'}]
                        });
                        queue.push(neighbor);
                        animations.push({
                            type: 'node',
                            nodeId: neighbor,
                            nodeColor: 'red',
                            searchValue: deepCopy(visited),
                            queue: deepCopy(queue),
                            currentLineMarkers: [{startRow: 14, startCol: 0, endRow: 14, endCol: 1000, className: 'myMarker',type: 'text'}]
                        });
                        animations.push({
                            type: 'node',
                            nodeId: neighbor,
                            nodeColor: 'transparent',
                            searchValue: deepCopy(visited),
                            queue: deepCopy(queue),
                            currentLineMarkers: [{startRow: 14, startCol: 0, endRow: 14, endCol: 1000, className: 'myMarker',type: 'text'}]
                        });
                        animations.push({
                            type: 'path',
                            pathStartId: node,
                            pathEndId: neighbor,
                            pathColor: 'black',
                            searchValue: deepCopy(visited),
                            queue: deepCopy(queue),
                            currentLineMarkers: [{startRow: 14, startCol: 0, endRow: 14, endCol: 1000, className: 'myMarker',type: 'text'}]
                        })
                    }
                });
            }
        }
        animations.push({
            type: 'node',
            nodeId: node,
            nodeColor: 'transparent',
            searchValue: deepCopy(visited),
            queue: deepCopy(queue),
            currentLineMarkers: [{startRow: 7, startCol: 0, endRow: 7, endCol: 1000, className: 'myMarker',type: 'text'}]
        });
    }

    return animations;
}
