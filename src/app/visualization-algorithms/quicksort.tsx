import { NodeTree } from "../components/Utils/DivideAndConquerArrayTree";
import { QuickSortArrayVisualizationAnimationInterface } from "../interfaces/QuickSortArrayVisualizationInterface";

function floorDivision(a:number,b:number) {
    return Math.floor(a / b);
}

export function deepCopy(object: any){
    if(object===undefined)
    {
        return undefined;
    }
    return JSON.parse(JSON.stringify(object));
}

export function quickSort(array: number[],map: Map<number,NodeTree>,i: number,j:number,height:number,animations: QuickSortArrayVisualizationAnimationInterface[]){
    if(array.length===0)
    {
        return [];
    }
    console.log(array);
    let nodeTree = deepCopy(map.get(j));
    if(nodeTree!==undefined)
    {
        nodeTree.value = deepCopy(array);
    animations.push({
        nodeTrees: [deepCopy(nodeTree)],
        currentLineMarkers: [],
        pivotId: nodeTree.id,
        pivotValue: "",
        pivotIndex: ""
    })
    map.set(j,nodeTree);
    if (array.length===1)
    {
        return array;
    }
    const pivot = array[array.length - 1];
    console.log(pivot);
    animations.push({
        nodeTrees: [deepCopy(nodeTree)],
        currentLineMarkers: [{startRow: 4, startCol: 0, endRow: 4, endCol: 1000, className: 'myMarker',type: 'text'}],
        pivotId: nodeTree.id,
        pivotValue: pivot.toString(),
        pivotIndex: (array.length-1).toString()
    })
    const diff = Math.pow(2,height-i-1);
    let nodeTreeLeft = deepCopy(map.get(j-diff));
    let nodeTreeRight = deepCopy(map.get(j+diff));
    let leftArr : number[] = [];
    let rightArr : number[] = [];
        for (let i = 0; i < array.length - 1; i++) {
            nodeTree.indexI = i;
            nodeTree.indexJ = i;
            nodeTree.colorI = 'yellow';
            nodeTree.colorJ = 'yellow';
            animations.push({
                nodeTrees: [deepCopy(nodeTree)],
                currentLineMarkers: [{startRow: 8, startCol: 0, endRow: 8, endCol: 1000, className: 'myMarker',type: 'text'}],
                pivotId: nodeTree.id,
                pivotValue: pivot.toString(),
                pivotIndex: (array.length-1).toString()
            })
            if (array[i] < pivot) {
                nodeTree.indexI = i;
                nodeTree.indexJ = i;
                nodeTree.colorI = 'purple';
                nodeTree.colorJ = 'purple';
                animations.push({
                    nodeTrees: [deepCopy(nodeTree)],
                    currentLineMarkers: [{ startRow: 9, startCol: 0, endRow: 9, endCol: 1000, className: 'myMarker', type: 'text' }],
                    pivotId: nodeTree.id,
                    pivotValue: pivot.toString(),
                    pivotIndex: (array.length-1).toString()
                })
                leftArr.push(array[i]);
                if(nodeTreeLeft!==undefined)
                {
                nodeTreeLeft.value = deepCopy(leftArr);
                }
                nodeTree.indexI = i;
                nodeTree.indexJ = i;
                nodeTree.colorI = 'transparent';
                nodeTree.colorJ = 'transparent';
                animations.push({
                    nodeTrees: [deepCopy(nodeTree),deepCopy(nodeTreeLeft)],
                    currentLineMarkers: [{ startRow: 10, startCol: 0, endRow: 10, endCol: 1000, className: 'myMarker', type: 'text' }],
                    pivotId: nodeTree.id,
                    pivotValue: pivot.toString(),
                    pivotIndex: (array.length-1).toString()
                })
            } else {
                nodeTree.indexI = i;
                nodeTree.indexJ = i;
                nodeTree.colorI = 'red';
                nodeTree.colorJ = 'red';
                animations.push({
                    nodeTrees: [deepCopy(nodeTree)],
                    currentLineMarkers: [{ startRow: 11, startCol: 0, endRow: 11, endCol: 1000, className: 'myMarker', type: 'text' }],
                    pivotId: nodeTree.id,
                    pivotValue: pivot.toString(),
                    pivotIndex: (array.length-1).toString()
                })
                rightArr.push(array[i]);
                if(nodeTreeRight!==undefined)
                {
                nodeTreeRight.value = deepCopy(rightArr);
                }
                nodeTree.indexI = i;
                nodeTree.indexJ = i;
                nodeTree.colorI = 'transparent';
                nodeTree.colorJ = 'transparent';
                animations.push({
                    nodeTrees: [deepCopy(nodeTree),deepCopy(nodeTreeRight)],
                    currentLineMarkers: [{ startRow: 12, startCol: 0, endRow: 12, endCol: 1000, className: 'myMarker', type: 'text' }],
                    pivotId: nodeTree.id,
                    pivotValue: pivot.toString(),
                    pivotIndex: (array.length-1).toString()
                })
            }
    }
    const leftArrSorted : number[] = quickSort(leftArr,map,i+1,j-diff,height,animations);
    animations.push({
        nodeTrees: [],
        currentLineMarkers: [{ startRow: 14, startCol: 0, endRow: 14, endCol: 1000, className: 'myMarker', type: 'text' }],
        pivotId: nodeTree.id,
        pivotValue: pivot.toString(),
        pivotIndex: (array.length-1).toString()
    })
    const rightArrSorted : number[] = quickSort(rightArr,map,i+1,j+diff,height,animations);
    animations.push({
        nodeTrees: [],
        currentLineMarkers: [{ startRow: 15, startCol: 0, endRow: 15, endCol: 1000, className: 'myMarker', type: 'text' }],
        pivotId: nodeTree.id,
        pivotValue: pivot.toString(),
        pivotIndex: (array.length-1).toString()
    })
    nodeTree.value = deepCopy([...leftArrSorted, pivot, ...rightArrSorted]);
    animations.push({
        nodeTrees: [deepCopy(nodeTree)],
        currentLineMarkers: [{ startRow: 16, startCol: 0, endRow: 16, endCol: 1000, className: 'myMarker', type: 'text' }],
        pivotId: nodeTree.id,
        pivotValue: pivot.toString(),
        pivotIndex: (array.length-1).toString()
    })
    return [...leftArrSorted, pivot, ...rightArrSorted];
    }
    return [];
}