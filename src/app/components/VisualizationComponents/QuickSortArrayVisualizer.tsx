import AppContext from "@/context";
import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { traverseTreeInorder } from "@/app/visualization-algorithms/inordertraversal";
import { traverseTreePreorder } from "@/app/visualization-algorithms/preordertraversal";
import { traverseTreePostOrder } from "@/app/visualization-algorithms/postorder";
import { MergeSortArrayVisualizationAnimationInterface } from "@/app/interfaces/MergeSortArrayVisualizationInterface";
import { DivideAndConquerArray, Link, NodeTree } from "../Utils/DivideAndConquerArrayTree";
import { mergeSort } from "@/app/visualization-algorithms/mergesort";
import { Pivot, QuickSortArrayVisualizationAnimationInterface } from "@/app/interfaces/QuickSortArrayVisualizationInterface";
import { quickSort } from "@/app/visualization-algorithms/quicksort";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

export function deepCopyMap<K, V>(original: Map<K, V>): Map<K, V> {
    const newMap = new Map<K, V>();
    original.forEach((value, key) => {
      // Assuming the values are objects, you might need to adjust this
      // for other deep copy logic based on your use case
      newMap.set(key, JSON.parse(JSON.stringify(value)));
    });
    return newMap;
  }

const QuickSortVisualizer = () =>{


    const {
        visualizationOption,
        speedValue,
        isPlaying,
        input,
        setMarkers
    }  = useContext(AppContext);

    const [speed, setSpeed] = useState<number>(1);
    const [isPlayingValue,setIsPlayingValue] = useState<boolean>(true);
    const speedRef = useRef<number>(speed);
    const isPlayingRef = useRef<boolean>(isPlayingValue);
    const [nodes,setNodes] = useState<NodeTree[]>([]);
    const [links,setLinks] = useState<Link[]>([]);


    const [height,setHeight] = useState<number>(300);
    const [width,setWidth] = useState<number>(300);

    const animationsRef = useRef<QuickSortArrayVisualizationAnimationInterface[]>([]);

    const [animations,setAnimations] = useState<QuickSortArrayVisualizationAnimationInterface[]>([]);

    const initialCreateRef = useRef<boolean>(false);

    const divideAndConquerTree = useRef<DivideAndConquerArray>();

    const [pivotMap,setPivotMap] = useState<Map<number,Pivot>>(new Map<number,Pivot>());
    const [barHeight,setBarHeight] = useState(0);


    useEffect(()=>{
        isPlayingRef.current = isPlayingValue;
        processAnimations();
    },[isPlayingValue]);

    useEffect(() => {
        speedRef.current = speed;
    }, [speed]);

    useEffect(()=>{
        setIsPlayingValue(isPlaying);

   },[isPlaying])

    useEffect(()=>{
        setSpeed(speedValue);
   },[speedValue])

    useEffect(()=>{
        createTree(input);
    },[input]);

    useEffect(()=>{
        async function rerender(){
            animationsRef.current = [...animations];
            await processAnimations();
        }
        rerender();
    },[animations]);

    useEffect(()=>{
        createPivots(nodes);
    },[nodes]);

    const createPivots = (nodes: NodeTree[])=>{
        let pivotMap : Map<number,Pivot> =  new Map<number,Pivot>();
        nodes.forEach(node=>{
            pivotMap.set(node.id,{
                pivotID: node.id,
                pivotValue: "",
                pivotIndex: "",
            })
        })
    }


    const createTree = (arr:number[])=>{
        if(animationsRef.current.length>0)
        {
            setAnimations([]);
        }
        initialCreateRef.current = true;
        const arrayTree = new DivideAndConquerArray(arr,"quicksort");
        setHeight(arrayTree.returnHeightQuickSort());
        setWidth(arrayTree.returnWidthForQuickSort());
        setNodes(arrayTree.nodes);
        setPivotMap(new Map<number,Pivot>());
        setBarHeight(arrayTree.distanceQuickSort/Math.max(...arr));
        divideAndConquerTree.current = arrayTree;
    }

    const visualizeTree = async (array: number[]) =>{
        let animations : QuickSortArrayVisualizationAnimationInterface[] = [];
        if(divideAndConquerTree.current!==undefined)
        {
            quickSort(array,divideAndConquerTree.current?.Map,0,divideAndConquerTree.current.returnInitialJPositionQuickSort(),divideAndConquerTree.current.heightForQuickSort,animations);
        }
        console.log(animations);
        if(animationsRef.current.length>0)
        {
            setAnimations([]);
            createTree(input);
        }
        else{
            createTree(input);
            setAnimations(animations);
        }
    }

    const processAnimations = async ()=>{
        initialCreateRef.current = false;
        if(animationsRef.current.length>0)
        {
            if(isPlayingRef.current)
            {
                const animation = animationsRef.current.shift();
                let newNodes = [...nodes];
                let newMap = deepCopyMap(pivotMap);
                if(animation)
                {
                const {
                    nodeTrees,
                    currentLineMarkers,
                    pivotId,
                    pivotIndex,
                    pivotValue
                } = animation;
                for(let i=0;i<newNodes.length;i++)
                {
                    for(let j=0;j<nodeTrees.length;j++)
                    {
                        if(nodeTrees[j]!==undefined && newNodes[i].id===nodeTrees[j].id)
                        {
                            newNodes[i].colorI = nodeTrees[j].colorI;
                            newNodes[i].colorJ = nodeTrees[j].colorJ;
                            newNodes[i].value = nodeTrees[j].value;
                            newNodes[i].indexI = nodeTrees[j].indexI;
                            newNodes[i].indexJ = nodeTrees[j].indexJ;
                        }
                    }
                }
                const newPivot : Pivot ={
                    pivotID: pivotId,
                    pivotValue: pivotValue,
                    pivotIndex: pivotIndex
                }
                newMap.set(pivotId,newPivot);
                console.log(newMap);
                setPivotMap(newMap);
                setMarkers(currentLineMarkers);
                setNodes(newNodes);
                await sleep(3000/speedRef.current);
                setAnimations(animationsRef.current);
                }
            }
        }
        else{
            initialCreateRef.current = true;
        }
    }

    return(
        <>
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '100%',
            overflow: 'scroll',
            padding: '10px'
        }}>
            <div style={{
                position: 'relative',
                width: width,
                height: height,
                alignSelf: 'flex-start',
            }}>
            {
               nodes.map(node=>{
                    return(
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            top: node.i,
                            left: node.j,
                            position: 'absolute',
                            height: divideAndConquerTree.current && (divideAndConquerTree.current?.distanceQuickSort+50),
                        }} id={"node"+node.id}>
                            {
                                <>
                                {
                               node.value.map((value,index)=>{
                                    return(
                                        <div style={{
                                            margin: '10px',
                                            alignSelf: 'flex-end'
                                        }}>
                                                <div style={{
                                                width: '100%',
                                                height: value*barHeight,
                                                backgroundColor: 'green',
                                            }}>
                
                                            </div>
                                        <div style={{
                                            padding: '10px',
                                            borderWidth: '1px',
                                            borderStyle: 'solid',
                                            backgroundColor: index === node.indexI ? node.colorI : index === node.indexJ ? node.colorJ : 'transparent'
                                        }}>
                                            {value}
                                        </div>
                                        </div>
                                    )
                                }) 
                                }
                                {
                                node.value.length >0 &&
                                <div style={{
                                    margin: '10px',
                                    alignSelf: 'flex-end',
                                }}>
                                            <div style={{
                                                width: '100%',
                                                height: pivotMap.get(node.id) ? Number(pivotMap.get(node.id)?.pivotValue) * barHeight : 0,
                                                backgroundColor: 'green',
                                            }}>
                
                                            </div>
                                <div style={{
                                    padding: '10px',
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    whiteSpace: 'nowrap'
                                }}>
                                    Pivot Value: {pivotMap.get(node.id)?.pivotValue}
                                </div>
                                </div>
                                }
                                </>
                                
                            }
                            </div>
                    )
                })
            }
            {

            }
            </div>
        </div>
        <div style={{
                marginTop: '30px',
            }}>
                <Button onClick={async ()=>{
                    await visualizeTree(input);
                }}>
                    {
                        animationsRef.current.length >0  ? <FontAwesomeIcon icon={faStop}/> :
                        <FontAwesomeIcon icon={faPlay}/>
}
                </Button>
            </div>
        </>
    )
}

export default QuickSortVisualizer;