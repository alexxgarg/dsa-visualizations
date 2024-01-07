import { DjikstraAlgorithmVisualizationInterface } from "../interfaces/ShortestPathAlgorithmVIsualizerInterface";
import { deepCopy } from "./mergesort";

type Edge = [string, number];
type Graph = Map<string, Edge[]>;

class PriorityQueue {
    private elements: { node: string; priority: number }[];

    constructor() {
        this.elements = [];
    }

    isEmpty(): boolean {
        return this.elements.length === 0;
    }

    enqueue(node: string, priority: number): void {
        this.elements.push({ node, priority });
        this.elements.sort((a, b) => a.priority - b.priority);
    }

    dequeue(): string | undefined {
        return this.elements.shift()?.node;
    }

    getQueue(): string[]{
        return this.elements.map(elem=>elem.node);
    }
}

export function dijkstraAlgorithm(graph: Graph, start: string): DjikstraAlgorithmVisualizationInterface[] {
    const distances: Map<string, number> = new Map();
    const predecessors: Map<string, string | null> = new Map();
    const priorityQueue = new PriorityQueue();
    let animations : DjikstraAlgorithmVisualizationInterface[] = [];

    // Initialize distances and predecessors
    graph.forEach((_, node) => {
        animations.push({
            type: 'node',
            nodeId: node,
            nodeColor: 'yellow',
            queue: deepCopy(priorityQueue.getQueue()),
            currentLineMarkers: [],
            rowNodeID: node,
            columnNodeID: node,
            distance: '',
            cellColor: 'transparent'
        })
        distances.set(node, Infinity);
        animations.push({
            type: 'node',
            nodeId: node,
            nodeColor: 'green',
            queue: deepCopy(priorityQueue.getQueue()),
            currentLineMarkers: [],
            rowNodeID: node,
            columnNodeID: node,
            distance: Infinity.toString(),
            cellColor: 'red'
        })
        animations.push({
            type: 'node',
            nodeId: node,
            nodeColor: 'transparent',
            queue: deepCopy(priorityQueue.getQueue()),
            currentLineMarkers: [],
            rowNodeID: node,
            columnNodeID: node,
            distance: Infinity.toString(),
            cellColor: 'transparent'
        })
        predecessors.set(node, null);
    });
    animations.push({
        type: 'node',
        nodeId: start,
        nodeColor: 'yellow',
        queue: deepCopy(priorityQueue.getQueue()),
        currentLineMarkers: [],
        rowNodeID: start,
        columnNodeID: start,
        distance: Infinity.toString(),
        cellColor: 'transparent'
    })
    distances.set(start, 0);
    
    priorityQueue.enqueue(start, 0);
    animations.push({
        type: 'node',
        nodeId: start,
        nodeColor: 'green',
        queue: deepCopy(priorityQueue.getQueue()),
        currentLineMarkers: [],
        rowNodeID: start,
        columnNodeID: start,
        distance: (0).toString(),
        cellColor: 'transparent'
    })
    while (!priorityQueue.isEmpty()) {
        let current = priorityQueue.dequeue();
        if (current === undefined) break;
        const currentDistance = distances.get(current);
        if (currentDistance === undefined) continue;

        animations.push({
            type: 'node',
            nodeId: current,
            nodeColor: 'green',
            queue: deepCopy(priorityQueue.getQueue()),
            currentLineMarkers: [],
            rowNodeID: current,
            columnNodeID: current,
            distance: currentDistance.toString(),
            cellColor: 'yellow'
        })

        const neighbors = graph.get(current) || [];
        for (const [neighbor, weight] of neighbors) {
            animations.push({
                type: 'path',
                pathStartId: current,
                pathEndId: neighbor,
                pathColor: 'green',
                queue: deepCopy(priorityQueue.getQueue()),
                currentLineMarkers: [],
            })
            const distanceThroughCurrent = currentDistance + weight;
            const neighborDistance = distances.get(neighbor) || Infinity;

            animations.push({
                type: 'node',
                nodeId: neighbor,
                nodeColor: 'purple',
                queue: deepCopy(priorityQueue.getQueue()),
                currentLineMarkers: [],
                rowNodeID: current,
                columnNodeID: neighbor,
                distance: neighborDistance.toString(),
                cellColor: 'purple'
            })

            if (distanceThroughCurrent < neighborDistance) {
                distances.set(neighbor, distanceThroughCurrent);
                predecessors.set(neighbor, current);
                priorityQueue.enqueue(neighbor, distanceThroughCurrent);
                animations.push({
                    type: 'node',
                    nodeId: neighbor,
                    nodeColor: 'red',
                    queue: deepCopy(priorityQueue.getQueue()),
                    currentLineMarkers: [],
                    rowNodeID: current,
                    columnNodeID: neighbor,
                    distance: distanceThroughCurrent.toString(),
                    cellColor: 'red'
                })
            }

            animations.push({
                type: 'node',
                nodeId: neighbor,
                nodeColor: 'transparent',
                queue: deepCopy(priorityQueue.getQueue()),
                currentLineMarkers: [],
                rowNodeID: current,
                columnNodeID: neighbor,
                distance: distances.get(neighbor)?.toString(),
                cellColor: 'transparent'
            })
            animations.push({
                type: 'path',
                pathStartId: current,
                pathEndId: neighbor,
                pathColor: 'black',
                queue: deepCopy(priorityQueue.getQueue()),
                currentLineMarkers: []
            })
        }

        animations.push({
            type: 'node',
            nodeId: current,
            nodeColor: 'transparent',
            queue: deepCopy(priorityQueue.getQueue()),
            currentLineMarkers: [],
            rowNodeID: current,
            columnNodeID: current,
            distance: currentDistance.toString(),
            cellColor: 'transparent'
        })
    }

    return animations;
}

function reconstructPath(predecessors: Map<string, string|null>, start: string, end: string): string[] {
    const path: string[] = [];
    let currentNode : string | null | undefined = end;

    while (currentNode !== start) {
        if(currentNode)
        {
        path.unshift(currentNode);
        currentNode = predecessors.get(currentNode);
        if (currentNode === null) return []; // No path exists
        }
    }

    path.unshift(start);
    return path;
}