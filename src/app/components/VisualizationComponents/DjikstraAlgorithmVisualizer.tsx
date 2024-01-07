import AppContext from "@/context";
import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useContext, useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import EditGraphModal, { Node, NodeStatic, PathVertex } from "../Utils/EditGraphModal";
import Xarrow, { Xwrapper } from "react-xarrows";
import { DjikstraAlgorithmVisualizationInterface } from "@/app/interfaces/ShortestPathAlgorithmVIsualizerInterface";
import { dijkstraAlgorithm } from "@/app/visualization-algorithms/DjikstraAlgorithm";
import { color } from "d3";
import { deepCopy } from "@/app/visualization-algorithms/mergesort";
import { deepCopyMap } from "./QuickSortArrayVisualizer";
import DataTable from "react-data-table-component";
import './Table.css'; 

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

interface Cell{
    id: string;
    value: string;
    color: string;
}

interface TableProps {
    data: Map<string, Cell[]>;
    nodes: Node[]
}

interface TableInterface{
    headers: Node[];
    matrix: Map<string,Cell[]>;
}

const StyledTable : React.FC<TableInterface> = ({headers,matrix}) => {
    // Define the headers for the table
  
    // Define the data for the table (excluding the header row)
    const [data,setData] = useState<Cell[][]>([]);
    const createData = () =>{
        for (const [key, value] of Object.entries(matrix)) {
            console.log(key, value);
          }
          
    }

    useEffect(()=>{
        let newData : Cell[][] = []
        for(let i=0;i<headers.length;i++)
        {
            let rowData : Cell[] = [];
            for(let i=0;i<headers.length;i++)
            {
                rowData.push({
                    id: "",
                    value: "",
                    color: ""
                });
            }
            newData.push([...rowData]);
        }
        for (const key of Array.from(matrix.keys())) {
            let values = matrix.get(key);
            if(values)
            {
                    for(const value of values)
                    {
                        for(let i=0;i<headers.length;i++)
                        {
                            if(headers[i].id===key)
                            {
            
                                for(let j=0;j<headers.length;j++)
                                {
                                    if(headers[j].id===value.id)
                                    {
                                        newData[i][j] = value;
                                    }
                                }
                            }
                        }
                    }
            }
          }
          setData(newData);
    },[matrix]);
  
    return (
      <table>
        <thead>
          <tr>
            <th></th> {/* Empty cell for the top-left corner */}
            {headers.map((header, i) => (
              <th key={i}>{header.value}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <th>{headers[i] && headers[i].value}</th> {/* Row Header */}
              {row.map((cell, j) => (
                <td key={j} style={{
                    backgroundColor: cell.color
                }}>{cell.value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  

const DjikstraAlgorithmVisualizer = () =>{

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
    const [graph,setGraph] = useState<Map<string,[string,number][]>>(new Map<string,[string,number][]>());
    const [startNode,setStartNode] = useState<string>('');
    const animationsRef = useRef<DjikstraAlgorithmVisualizationInterface[]>([]);
    const [animations,setAnimations] = useState<DjikstraAlgorithmVisualizationInterface[]>([]);
    const [queue,setQueue] = useState<number[]>([]);
    const [matrix,setMatrix] = useState<Map<string,Cell[]>>(new Map<string,Cell[]>());

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
    let newGraph = new Map<string,[string,number][]>();
    let newNodes = [...nodes];
    let newPaths = [...paths];
    let newMatrix : Map<string,Cell[]> = new Map<string,Cell[]>();
    let emptyCellRow : Cell[] = newNodes.map(node=>{
        return {
            id : node.id,
            value: '',
            color: 'transparent'
        }
    })
    for(let i=0;i<newNodes.length;i++)
    {
        newNodes[i].color = 'transparent';
        newMatrix.set(newNodes[i].id,deepCopy(emptyCellRow));
    }
    for(let i=0;i<newPaths.length;i++)
    {
        newPaths[i].color = 'black';
    }
    setQueue([]);
    setNodes(nodes);
    setPaths(paths);
    setMatrix(newMatrix);
    console.log(newMatrix);
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
                {
                    endNodes.push([path.endNodeId,path.weigth]);
                    newGraph.set(nodes[i].id,endNodes);
                }
            }
        }
    })

    console.log(newGraph);
    setGraph(newGraph);
   }

   const handleStartNodeValue = (id:string)=>{
    setStartNode(id);
   }

   const resetNodesAndPaths = () =>{
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
    let animations : DjikstraAlgorithmVisualizationInterface[] = [];
    animations = dijkstraAlgorithm(graph,startNode);
    console.log(animations);
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
                    queue,
                    currentLineMarkers,
                    rowNodeID,
                    columnNodeID,
                    distance,
                    cellColor,
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
                if(rowNodeID && columnNodeID && distance!==undefined && cellColor)
                {
                    let newMatrix = deepCopyMap(matrix);
                    let values = newMatrix.get(rowNodeID);
                    let newValue : Cell ={
                        id: columnNodeID,
                        value: distance,
                        color: cellColor
                    }
                    let indexToSet = 0;
                    values?.forEach((value,index)=>{
                        if(value.id===columnNodeID)
                        {
                            indexToSet = index;
                        }
                    })
                    if(values)
                    {
                        values[indexToSet] = newValue;
                        newMatrix.set(rowNodeID,deepCopy(values));
                    }
                    console.log(newMatrix);
                    setMatrix(newMatrix);


                }
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
                                <div key={index}>
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
                            <NodeStatic key={index} id={node.id} value={node.value} position={node.position} color={node.color}/>
                        )
                    })
                    }
                </Xwrapper>
            </div>
            <div style={{
                marginTop: '10px',
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
                    }}>Queue: </div>
                    {queue.map((value,index)=>{
                        return(<div key={index} style={{
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
                marginTop: '10px'
            }}>
                <StyledTable headers={nodes.sort((a, b) => {
    if (a.value < b.value) {
      return -1;
    }
    if (a.value > b.value) {
      return 1;
    }
    return 0;
  })} matrix={matrix}/>
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

export default DjikstraAlgorithmVisualizer;