import { BubbleSortArrayVisualizationAnimationInterface } from "../interfaces/BubbleSortArrayVIsualizationInterface";

export const BubbleSort = (array: number[])=>{
    let animations : BubbleSortArrayVisualizationAnimationInterface[] = [];
    const n = array.length;
    let swapped = false;
    for (let i=0;i<n;i++)
    {
        swapped = false;
        for(let j=0;j<n-i-1;j++)
        {
            animations.push({
                'colorI': 'yellow',
                'colorJ': 'yellow',
                valueI: array[j],
                valueJ: array[j+1],
                indexI: j,
                indexJ: j+1,
                currentLineMarkers: [{startRow: 8, startCol: 0, endRow: 8, endCol: 1000, className: 'myMarker',type: 'text'}]
            })
            if (array[j] > array[j + 1]) 
            {
                // Swap arr[j] and arr[j+1]
                animations.push({
                    'colorI': 'purple',
                    'colorJ': 'purple',
                    valueI: array[j],
                    valueJ: array[j+1],
                    indexI: j,
                    indexJ: j+1,
                    currentLineMarkers: [{startRow: 13, startCol: 0, endRow: 13, endCol: 1000, className: 'myMarker',type: 'text'}]
                })
                let temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
                animations.push({
                    'colorI': 'red',
                    'colorJ': 'red',
                    valueI: array[j],
                    valueJ: array[j+1],
                    indexI: j,
                    indexJ: j+1,
                    currentLineMarkers: [{startRow: 14, startCol: 0, endRow: 14, endCol: 1000, className: 'myMarker',type: 'text'}]
                })
                swapped = true;
            }
            animations.push({
                'colorI': 'transparent',
                'colorJ': 'transparent',
                valueI: array[j],
                valueJ: array[j+1],
                indexI: j,
                indexJ: j+1,
                currentLineMarkers: [{startRow: 8, startCol: 0, endRow: 8, endCol: 1000, className: 'myMarker',type: 'text'}]
            })
        }
        if(swapped==false)
        {
            break;
        }
    }

    return animations;
}

const BubbleSortComponent = ()=>{
    return(
        <div></div>
    )
}

export default BubbleSortComponent;