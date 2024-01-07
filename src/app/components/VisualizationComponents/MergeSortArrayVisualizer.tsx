import AppContext from "@/context";
import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { MergeSortArrayVisualizationAnimationInterface } from "@/app/interfaces/MergeSortArrayVisualizationInterface";
import { DivideAndConquerArray, Link, NodeTree } from "../Utils/DivideAndConquerArrayTree";
import { mergeSort } from "@/app/visualization-algorithms/mergesort";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

export interface NodeWidthAndHeight{
    id: number;
    width: number;
    height: number
}


const MergeSortVisualizer = () =>{


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
    const [barHeight,setBarHeight] = useState(0);

    const animationsRef = useRef<MergeSortArrayVisualizationAnimationInterface[]>([]);

    const [animations,setAnimations] = useState<MergeSortArrayVisualizationAnimationInterface[]>([]);

    const initialCreateRef = useRef<boolean>(false);

    const divideAndConquerTree = useRef<DivideAndConquerArray>();


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


    const createTree = (arr:number[])=>{
        if(animationsRef.current.length>0)
        {
            setAnimations([]);
        }
        initialCreateRef.current = true;
        const arrayTree = new DivideAndConquerArray(arr,"mergesort");
        setHeight(arrayTree.returnHeight());
        setWidth(arrayTree.returnWidth());
        console.log(arrayTree.nodes);
        setNodes(arrayTree.nodes);
        setBarHeight(arrayTree.distance/Math.max(...arr));
        divideAndConquerTree.current = arrayTree;
    }

    const visualizeTree = async (array: number[]) =>{
        console.log(array);
        let animations : MergeSortArrayVisualizationAnimationInterface[] = [];
        if(divideAndConquerTree.current!==undefined)
        {
            mergeSort(array,divideAndConquerTree.current?.Map,0,divideAndConquerTree.current.returnInitialJPosition(),divideAndConquerTree.current.height,animations);
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
                console.log(newNodes);
                if(animation)
                {
                const {
                    nodeTrees,
                    currentLineMarkers
                } = animation;
                console.log(nodeTrees);
                for(let i=0;i<newNodes.length;i++)
                {
                    for(let j=0;j<nodeTrees.length;j++)
                    {
                        if(newNodes[i].id===nodeTrees[j].id)
                        {
                            newNodes[i].colorI = nodeTrees[j].colorI;
                            newNodes[i].colorJ = nodeTrees[j].colorJ;
                            newNodes[i].value = nodeTrees[j].value;
                            newNodes[i].indexI = nodeTrees[j].indexI;
                            newNodes[i].indexJ = nodeTrees[j].indexJ;
                            console.log(newNodes[i].value);
                        }
                    }
                }
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
                            height: (Number(divideAndConquerTree.current?.distance)+50)
                        }} id={"node"+node.id}>
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
                            </div>
                    )
                })
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

export default MergeSortVisualizer;