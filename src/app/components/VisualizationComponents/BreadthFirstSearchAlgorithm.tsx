import { BubbleSortArrayVisualizationAnimationInterface, BubbleSortArrayVisualizationInterface } from "@/app/interfaces/BubbleSortArrayVIsualizationInterface";
import { BubbleSort } from "@/app/visualization-algorithms/bubblesort";
import { InsertionSort } from "@/app/visualization-algorithms/insertionsort";
import AppContext from "@/context";
import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import EditGraphModal, { Node, NodeStatic, PathVertex } from "../Utils/EditGraphModal";
import Xarrow, { Xwrapper } from "react-xarrows";
import { BreadthFirstSearchVisualizationInterface, GraphSearchVisualizationInterface } from "@/app/interfaces/GraphSearchVisualizationInterface";
import { depthFirstSearch } from "@/app/visualization-algorithms/DepthFirstSearch";
import { breadthFirstSearch } from "@/app/visualization-algorithms/BreadthFirstSearch";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }



const BreadthFirstSearchAlgorithmVisualizer = () =>{

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
    const [showEditGraphModal,setShowEditGraphModal] = useState<boolean>(false);
    const [nodes,setNodes] = useState<Node[]>([]);
    const [paths,setPaths] = useState<PathVertex[]>([]);
    const [graph,setGraph] = useState<Map<string,string[]>>(new Map<string,string[]>());
    const [startNode,setStartNode] = useState<string>('');
    const animationsRef = useRef<BreadthFirstSearchVisualizationInterface[]>([]);
    const [animations,setAnimations] = useState<BreadthFirstSearchVisualizationInterface[]>([]);
    const [searchValue,setSearchValues] = useState<number[]>([]);
    const [queue,setQueue] = useState<number[]>([]);

    useEffect(()=>{
        isPlayingRef.current = isPlayingValue;
    },[isPlayingValue])

    useEffect(() => {
        speedRef.current = speed;
    }, [speed]);

    useEffect(()=>{
        setIsPlayingValue(isPlaying);
   },[isPlaying])

   useEffect(()=>{
    isPlayingRef.current = isPlayingValue;
    processAnimations();
},[isPlayingValue]);

    useEffect(()=>{
        setSpeed(speedValue);
   },[speedValue])

   useEffect(()=>{
    async function rerender(){
        animationsRef.current = [...animations];
        await processAnimations();
    }
    rerender();
    },[animations]);

    useEffect(()=>{
        if(animationsRef.current.length>0)
        {
            setAnimations([]);
        }
    },[graph]);
    


   const buildGraph = (nodes: Node[],paths: PathVertex[]) =>{
    let newGraph = new Map<string,string[]>();
    let newNodes = [...nodes];
    let newPaths = [...paths];
    for(let i=0;i<newNodes.length;i++)
    {
        newNodes[i].color = 'transparent';
    }
    for(let i=0;i<newPaths.length;i++)
    {
        newPaths[i].color = 'black';
    }
    setSearchValues([]);
    setQueue([]);
    setNodes(nodes);
    setPaths(paths);
    nodes.forEach(node=>{
        newGraph.set(node.id,[]);
    })
    paths.forEach(path=>{
        for(let i=0;i<nodes.length;i++)
        {
            if(nodes[i].id===path.startNodeId)
            {
                let endNodes = newGraph.get(nodes[i].id);
                if(endNodes)
                newGraph.set(nodes[i].id,endNodes.concat(path.endNodeId));
            }
        }
    })
    setGraph(newGraph);
   }

   const handleStartNodeValue = (id:string)=>{
    setStartNode(id);
   }

   const resetNodesAndPaths = () =>{
    setSearchValues([]);
    setQueue([]);
    const newNodes = [...nodes];
    const newPaths = [...paths];
    for(let i=0;i<newNodes.length;i++)
    {
        newNodes[i].color = 'transparent';
    }
    for(let i=0;i<newPaths.length;i++)
    {
        newPaths[i].color = 'black';
    }
    setNodes(newNodes);
    setPaths(newPaths);
   }

   const visualizeGraph = () =>{
    let animations : BreadthFirstSearchVisualizationInterface[] = [];
    animations = breadthFirstSearch(graph,startNode);
    if(animationsRef.current.length>0)
    {
        setAnimations([]);
        resetNodesAndPaths();
    }
    else{
        resetNodesAndPaths();
        setAnimations(animations);
    }
    }

    const processAnimations = async ()=>{
        if(animationsRef.current.length>0)
        {
            if(isPlayingRef.current)
            {
                const animation = animationsRef.current.shift();
                let newNodes = [...nodes];
                let newPaths = [...paths];
                if(animation)
                {
                const {
                    type,
                    nodeId,
                    pathStartId,
                    pathEndId,
                    nodeColor,
                    pathColor,
                    searchValue,
                    queue,
                    currentLineMarkers
                } = animation;
                if(type==="node")
                {
                    for(let i=0;i<newNodes.length;i++)
                    {
                        if(newNodes[i].id===nodeId && nodeColor)
                        {
                            newNodes[i].color = nodeColor;
                        }
                    }
                }
                else if(type==="path")
                {
                    for(let i=0;i<newPaths.length;i++)
                    {
                        if(newPaths[i].startNodeId===pathStartId && newPaths[i].endNodeId===pathEndId && pathColor)
                        {
                            newPaths[i].color = pathColor;
                        }
                    }
                }
                let newSearchValues: number[] = [];
                searchValue.map(value=>{
                    for(let i=0;i<nodes.length;i++)
                    {
                        if(nodes[i].id===value)
                        {
                            newSearchValues.push(nodes[i].value);
                        }
                    }
                })
                let newQueueValue: number[] = [];
                queue.map(value=>{
                    for(let i=0;i<nodes.length;i++)
                    {
                        if(nodes[i].id===value)
                        {
                            newQueueValue.push(nodes[i].value);
                        }
                    }
                })
                setSearchValues(newSearchValues);
                setQueue(newQueueValue);
                setNodes(newNodes);
                setPaths(newPaths);
                setMarkers(currentLineMarkers);
                await sleep(3000/speedRef.current);
                setAnimations(animationsRef.current);
                }
            }
        }
    }





    return(
        <>
        <EditGraphModal show={showEditGraphModal} handleClose={() => {
                setShowEditGraphModal(false);
            } } 
            buildGraph={buildGraph} 
            setStartNode={handleStartNodeValue}/>
            <div style={{
                marginTop: '30px',
            }}>
                <Button onClick={ ()=>{
                   setShowEditGraphModal(true);
                }} style={{
                    marginBottom: '10px'
                }}>
                    Edit Graph
                </Button>
            </div>
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '100%',
            overflow: 'scroll',
        }}>

<div style={{
                position: 'relative',
                width: 800,
                height: 800,
                borderStyle: 'solid',
            }}>
                <Xwrapper>
                    {
                        paths.map((path,index)=>{
                            return(
                                <div>
                                <Xarrow start={'node'+path.startNodeId} end={'node'+path.endNodeId} color={path.color} strokeWidth={5} path="straight" labels={{
                                    middle: (visualizationOption !==0 && visualizationOption!==1) ? <div style={
                                        {
                                            position: 'absolute',
                                            margin: '10px'
                                        }
                                    }>{path.weigth}</div>
                                    : <></>
                                }} />
                                </div>
                            )
                        })
                    }
                    {
                    nodes && nodes.map((node,index)=>{
                        return(
                            <NodeStatic id={node.id} value={node.value} position={node.position} color={node.color}/>
                        )
                    })
                    }
                </Xwrapper>
            </div>
            <div style={{
                marginTop: '10px'
            }}>
            <div style={{
                display: 'flex',
                alignSelf: 'flex-start',
                alignItems: 'center'
            }}>
                {
                    <>
                    <div style={{
                        fontSize: '35px',
                        marginRight: '10px'
                    }}>Nodes: </div>
                    {searchValue.map(value=>{
                        return(<div style={{
                            padding: '20px',
                            borderStyle: 'solid',
                            borderWidth: '2px',
                            fontSize: '35px',
                            width: 'fit-content'
                        }}>
                            {value}
                            </div>
                        )
                    })}
                    </>
                }
            </div>
            <div style={{
                display: 'flex',
                alignSelf: 'flex-start',
                alignItems: 'center'
            }}>
                {
                    <>
                    <div style={{
                        fontSize: '35px',
                        marginRight: '10px'
                    }}>Queue: </div>
                    {queue.map(value=>{
                        return(<div style={{
                            padding: '20px',
                            borderStyle: 'solid',
                            borderWidth: '2px',
                            fontSize: '35px',
                            width: 'fit-content'
                        }}>
                            {value}
                            </div>
                        )
                    })}
                    </>
                }
            </div>
            </div>
            <div style={{
                marginTop: '30px',
                marginBottom: '30px'
            }}>
                <Button onClick={async ()=>{
                        visualizeGraph();
                }}>
                    {
                        animationsRef.current.length >0  ? <FontAwesomeIcon icon={faStop}/> :
                        <FontAwesomeIcon icon={faPlay}/>
                        }
                </Button>
            </div>
        </div>
        </>
    )
}

export default BreadthFirstSearchAlgorithmVisualizer;