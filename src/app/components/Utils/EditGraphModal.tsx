'use client';
import AppContext from "@/context";
import { faArrowDown, faArrowLeft, faArrowRight, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Konva from "konva";
import dynamic from "next/dynamic";
import React, { ForwardedRef, useContext, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Circle, Layer, Rect, Stage, Text } from "react-konva";
import Xarrow, {useXarrow, Xwrapper} from 'react-xarrows';
import { v4 as uuidv4 } from 'uuid';

interface PathInterface{
    x1: string;
    y1: string;
    x2: string;
    y2: string;
}

function clamp(min: number, max: number,value: number) {
    return Math.min(Math.max(value, min), max);
  };

const Path : React.FC<PathInterface> = ({x1,y1,x2,y2}) =>{
    return(
        <>
            <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
            <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="black"
            marker-end="url(#arrow)" 
            strokeWidth={5}/>
        </>
    )
}

export interface Node{
    id: string;
    value: number;
    position: { x: number, y: number },
    color: string;
}

interface NodeInterface{
    id: string,
    value: number;
    position: { x: number, y: number },
    handleDrag: (e: DraggableEvent, data: DraggableData,id: string) => void,
    handleDragEnd: (e: DraggableEvent, data: DraggableData,id: string) => void,
    index: number;
    handleSetPath: (value: boolean,leftCoordinate: string,topCoordinate: string)=>void;
    graphRef : React.RefObject<HTMLDivElement>;
    path: boolean;
    handleValueOfInitialVertex: (value: string) => void;
    handleValueOfFinalVertex: (value: string) => void;
    handleFinalNode: (value: string) => void;
    changeValueOfVertex: (value: number, id: string) => void;
    deleteNode: (id: string) => void;
    cursor: 'crosshair' | 'pointer'
}

export interface PathVertex{
    startNodeId: string;
    endNodeId: string;
    weigth: number;
    color: string;
}
const Node: React.FC<NodeInterface> = ({ 
    id,
    value, 
    position,
    handleDrag,
    handleDragEnd,
    index,
    handleSetPath,
    graphRef,
    path,
    handleValueOfInitialVertex,
    handleValueOfFinalVertex,
    handleFinalNode,
    changeValueOfVertex,
    deleteNode,
    cursor
}) => {
    // State to manage the position of the node


    const getElementWidth = (id: string)=>{
        const width = document.getElementById(id)?.offsetWidth;
        if(width){
            return width;
        }
        return 0;
    }

    const getElementHeight = (id: string)=>{
        const height = document.getElementById(id)?.offsetHeight;
        if(height){
            return height;
        }
        return 0;
    }

    return (
        <>
        <Button  style={{
            position: 'absolute',
            top: position.y- getElementHeight("button-1-"+id),
            left: position.x+ ((getElementWidth(id)/2)-(getElementWidth("button-1-"+id)/2)) ,
            pointerEvents: 'all',
            color: 'black',
            backgroundColor: 'transparent',
            borderStyle: 'none',
        }} onMouseDown={(e)=>{
            if(graphRef.current)
            {
            var bounds = graphRef.current.getBoundingClientRect();
            var x = e.clientX - bounds.left;
            var y = e.clientY - bounds.top;
            handleSetPath(true,x.toString(),y.toString());
            handleValueOfInitialVertex(id);
            }
        }} onMouseUp={(e)=>{
            if(path && graphRef.current){
                var bounds = graphRef.current.getBoundingClientRect();
                var x = e.clientX - bounds.left;
                var y = e.clientY - bounds.top;
                handleValueOfFinalVertex(id);
            }
            handleSetPath(false,"","");
        }} id={"button-1-"+id}><FontAwesomeIcon icon={faArrowUp}/></Button>
        <Button style={{
            position: 'absolute',
            top: position.y+  ((getElementHeight(id)/2)-(getElementHeight("button-2-"+id)/2)),
            left: position.x+ getElementWidth(id),
            pointerEvents: 'all',
            color: 'black',
            backgroundColor: 'transparent',
            borderStyle: 'none',
        }} onMouseDown={(e)=>{
            if(graphRef.current)
            {
            var bounds = graphRef.current.getBoundingClientRect();
            var x = e.clientX - bounds.left;
            var y = e.clientY - bounds.top;
            handleSetPath(true,x.toString(),y.toString());
            handleValueOfInitialVertex(id);
            }
        }} onMouseUp={(e)=>{
            if(path && graphRef.current){
                var bounds = graphRef.current.getBoundingClientRect();
                var x = e.clientX - bounds.left;
                var y = e.clientY - bounds.top;
                handleValueOfFinalVertex(id);
            }
            handleSetPath(false,"","");
        }} id={"button-2-"+id}><FontAwesomeIcon icon={faArrowRight}/></Button>
        <Button  style={{
            position: 'absolute',
            top: position.y+ getElementHeight(id),
            left: position.x+ ((getElementWidth(id)/2)-(getElementWidth("button-3-"+id)/2)),
            pointerEvents: 'all',
            color: 'black',
            backgroundColor: 'transparent',
            borderStyle: 'none',
        }} onMouseDown={(e)=>{
            if(graphRef.current)
            {
            var bounds = graphRef.current.getBoundingClientRect();
            var x = e.clientX - bounds.left;
            var y = e.clientY - bounds.top;
            handleSetPath(true,x.toString(),y.toString());
            handleValueOfInitialVertex(id);
            }
        }} onMouseUp={(e)=>{
            if(path && graphRef.current){
                var bounds = graphRef.current.getBoundingClientRect();
                var x = e.clientX - bounds.left;
                var y = e.clientY - bounds.top;
                handleValueOfFinalVertex(id);
            }
            handleSetPath(false,"","");
        }} id={"button-3-"+id}><FontAwesomeIcon icon={faArrowDown}/></Button>
                <Button  style={{
            position: 'absolute',
            top: position.y+ ((getElementHeight(id)/2)-(getElementHeight("button-4-"+id)/2)),
            left: position.x- getElementWidth("button-4-"+id) ,
            pointerEvents: 'all',
            color: 'black',
            backgroundColor: 'transparent',
            borderStyle: 'none',
        }} onMouseDown={(e)=>{
            if(graphRef.current)
            {
            var bounds = graphRef.current.getBoundingClientRect();
            var x = e.clientX - bounds.left;
            var y = e.clientY - bounds.top;
            handleSetPath(true,x.toString(),y.toString());
            handleValueOfInitialVertex(id);
            }
        }} onMouseUp={(e)=>{
            if(path && graphRef.current){
                var bounds = graphRef.current.getBoundingClientRect();
                var x = e.clientX - bounds.left;
                var y = e.clientY - bounds.top;
                handleValueOfFinalVertex(id);
            }
            handleSetPath(false,"","");
        }} id={"button-4-"+id}><FontAwesomeIcon icon={faArrowLeft}/></Button>
        <Draggable position={position} onDrag={(e,data)=>{
            console.log("Mouse Released");
            handleDrag(e,data,id);
        }} onStop={(e,data)=>{
            console.log("Mouse Released");
            handleDragEnd(e,data,id)
        }} disabled={path}>
            <div style={{
                padding: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderRadius: '100%',
                borderStyle: 'solid',
                width: 'fit-content',
                cursor: 'pointer',
                position: 'absolute',
                pointerEvents: 'all'
            }} id={id}  onMouseUp={(e)=>{
                console.log(true);
                if(path && graphRef.current){
                    var bounds = graphRef.current.getBoundingClientRect();
                    var x = e.clientX - bounds.left;
                    var y = e.clientY - bounds.top;
                    handleValueOfFinalVertex(id);
                }
                handleSetPath(false,"","");
            }} onMouseEnter={(e)=>{
                handleFinalNode(id);
            }} onMouseOut={(e)=>{
                handleFinalNode("");
            }} onMouseDown={(e)=>{
                if(cursor==='crosshair')
                {
                    deleteNode(id);
                }
            }}>
                <input type="number" value={value} onChange={(e)=>{
                    changeValueOfVertex(Number(e.target.value),id);
                }} style={{
                    backgroundColor: 'transparent',
                    textAlign: 'center',
                    borderWidth: 0,
                    color: 'black'
                }} onMouseUp={(e)=>{
                    console.log(true);
                    if(path && graphRef.current){
                        var bounds = graphRef.current.getBoundingClientRect();
                        var x = e.clientX - bounds.left;
                        var y = e.clientY - bounds.top;
                        handleValueOfFinalVertex(id);
                    }
                    handleSetPath(false,"","");
                }} onMouseDown={(e)=>{
                    if(cursor==='crosshair')
                    {
                        deleteNode(id);
                    }
                }}/>
            </div>
        </Draggable>
        </>
    );
};

interface StaticNodeInterface{
    id: string,
    value: number;
    position: { x: number, y: number },
    color: string;
}

export const NodeStatic: React.FC<StaticNodeInterface> = ({ 
    id,
    value, 
    position,
    color
}) => {



    return (
        <div style={{
            padding: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderRadius: '100%',
            borderStyle: 'solid',
            width: 'fit-content',
            cursor: 'pointer',
            position: 'absolute',
            pointerEvents: 'all',
            backgroundColor: color,
            textAlign: 'center',
            color: 'black',
            top: position.y,
            left: position.x
        }} id={'node'+id}>
            <input type="number" value={value} style={{
                    backgroundColor: 'transparent',
                    textAlign: 'center',
                    borderWidth: 0,
                    color: 'black'
                }} disabled={true}/>
            </div>
    );
};


interface EditGraphModalInterface{
    show: boolean;
    handleClose: ()=>void;
    buildGraph: (nodes: Node[], paths: PathVertex[]) => void;
    setStartNode : (value: string)=>void
}

const EditGraphModal : React.FC<EditGraphModalInterface> = ({
    show,
    handleClose,
    buildGraph,
    setStartNode
})=>{

    const {
        visualizationOption,
    }  = useContext(AppContext);
    
    const [nodes,setNodes] = useState<Node[]>([]);
    const [path,setPath] = useState<boolean>(false);
    const [currentPath,setCurrentPath] = useState<PathInterface|undefined>();
    const [currentPathInitialCoordiantes,setCurrentPathInitialCoordinates] = useState<{x: string,y:string}>({
        x: "",
        y: ""
    });

    const [finalNode,setFinalNode] = useState<string>("");
    const [initialVertex,setInitialVertex] = useState("");
    const [finalVertex,setFinalVertex] = useState("");

    const [cursor, setCursor] = useState<'crosshair' | 'pointer'>('pointer');

    const nodeMap = useRef<Map<string,Node>>(new Map<string,Node>());

    const graphRef = useRef<HTMLDivElement>(null);

    const [paths,setPaths] = useState<PathVertex[]>([]);

    const [startNodeValue,setStartNodeValue] = useState(0);


  const changeCursor = () => {
    setCursor(prevState => {
      if(prevState === 'crosshair'){
        return 'pointer';
      }
      return 'crosshair';
    });
  }

    
    
    const handleValueOfInitialVertex = (id: string)=>{
        setInitialVertex(id);
    }

    const handleValueOfFinalVertex = (id: string)=>{
        setFinalVertex(id);
        const newPath : PathVertex ={
            startNodeId: initialVertex,
            endNodeId: id,
            weigth: 0,
            color: 'black'
        };
        let foundNewPath = false;
        for(let i=0;i<paths.length;i++)
        {
            if(paths[i].startNodeId===newPath.startNodeId && paths[i].endNodeId===newPath.endNodeId){
                foundNewPath = true;
            }
        }
        if(!foundNewPath)
        setPaths(paths.concat(newPath));

    }

    const handleFinalNode = (id: string)=>{
        setFinalVertex(id);
    }

    const changeValueOfVertex = (value: number,id: string)=>{
        const node = nodeMap.current.get(id);
        if(node!==undefined)
        {
        const newNodes : Node[]  = nodes.map(node=>{
            if(node.id===id)
            {
                return {
                    id: node.id,
                    value: value,
                    position:{
                        x: node.position.x,
                        y: node.position.y
                    },
                    color: node.color
                }
            }
            else{
                return  node;
            }
        })
        nodeMap.current.set(id,{
            id: node.id,
            value: value,
            position:{
                x: node.position.x,
                y: node.position.y
            },
            color: node.color
        })
        console.log(nodeMap.current);
        setNodes(newNodes);
        }
    }
    
    // Update position state when dragging stops
    const handleDrag = (e: DraggableEvent, data: DraggableData,id: string) => {
        const node = nodeMap.current.get(id);
        if(node!==undefined)
        {
        const newNodes : Node[]  = nodes.map(node=>{
            if(node.id===id)
            {
                return {
                    id: node.id,
                    value: node.value,
                    position:{
                        x: data.x,
                        y: data.y
                    },
                    color: node.color
                }
            }
            else{
                return  node;
            }
        })
        nodeMap.current.set(id,{
            id: node.id,
            value: node.value,
            position:{
                x: data.x,
                y: data.y
            },
            color: node.color
        })
        setNodes(newNodes);
        }
    };

    const handleDragEnd = (e: DraggableEvent, data: DraggableData,id: string) => {
        const nodeWidth = document.getElementById(id)?.clientWidth;
        const nodeHeight = document.getElementById(id)?.clientHeight;
        const node = nodeMap.current.get(id);
        if(node!==undefined && nodeWidth!==undefined && nodeHeight!==undefined)
        {
        const newNodes : Node[]  = nodes.map(node=>{
            if(node.id===id)
            {
                return {
                    id: node.id,
                    value: node.value,
                    position:{
                        x: clamp(0,800-nodeWidth-10,data.x),
                        y: clamp(0,800-nodeHeight-10,data.y)
                    },
                    color: node.color
                }
            }
            else{
                return  node;
            }
        })
        nodeMap.current.set(id,{
            id: node.id,
            value: node.value,
            position:{
                x: clamp(0,800-nodeWidth-10,data.x),
                y: clamp(0,800-nodeHeight-10,data.y)
            },
            color: node.color
        })
        console.log(nodeMap.current);
        setNodes(newNodes);
        }
    };

    const handleSetPath = (value: boolean,leftCoordinate: string,topCoordinate: string)=>{
        setPath(value);
        let newInitialCoordinates = {...currentPathInitialCoordiantes};
        newInitialCoordinates.x = leftCoordinate;
        newInitialCoordinates.y = topCoordinate;
        setCurrentPathInitialCoordinates(newInitialCoordinates);
    }

    function getRandomBetween(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const addNode = ()=>{

        const value = nodes.length;
        const id = uuidv4();
        const newNode : Node ={
            id: id,
            value: value,
            position: {
                x: getRandomBetween(100,700),
                y: getRandomBetween(100,700)
            },
            color: 'transparent'
        }
        const newNodes = [...nodes,newNode];
        nodeMap.current.set(id,newNode);
        setNodes(newNodes);
    }

    const deletePath = (index: number) =>{
    const newPaths = [...paths];
    newPaths.splice(index,1);
    setPaths(newPaths);
    }

    const deleteNode = (id: string) =>{
        const node = nodeMap.current.get(id);
        if(node!==undefined)
        {
            nodeMap.current.delete(id);
            const newNodes : Node[]  = nodes.filter(node=>{
                return node.id!==id;
            })
            const newPaths: PathVertex[] = paths.filter(path=>(path.startNodeId!==id && path.endNodeId!==id));
            setNodes(newNodes);
            setPaths(newPaths);
        }
    }

    const hanldeSave = () =>{
        buildGraph(nodes,paths);
        for(let i=0;i<nodes.length;i++)
        {
            if(nodes[i].value===startNodeValue)
            {
                setStartNode(nodes[i].id);
            }
        }
        handleClose();
    }


    return(
        <Modal show={show} onHide={handleClose} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>Edit Graph</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div style={{
                display: 'flex',
                width: '300px',
                justifyContent: 'space-between',
                marginBottom: '10px',
                flexDirection: 'column',
                marginRight: '40px'
            }}>
                      <div style={{
                display: 'flex',
                width: '300px',
                justifyContent: 'space-between',
                marginBottom: '10px',
            }}>
            <Button onClick={addNode}>
                Add Node
            </Button>
            <Button onClick={changeCursor}>
                {cursor === "pointer" ? "Set Delete Mode" : "Unset Delete Mode"}
            </Button>
            </div>
            <Form.Group style={{
                width: '100%'
            }}>
                <Form.Control type="number" placeholder="Set Start Node" value={startNodeValue} onChange={(e)=>{
                    setStartNodeValue(Number(e.target.value));
                }}/>
            </Form.Group>
            </div>
            <div ref={graphRef} style={{
                position: 'relative',
                width: 800,
                height: 800,
                borderStyle: 'solid',
                cursor: cursor
            }} onMouseMove={(e)=>{
                if(path && graphRef.current)
                {
                    var bounds = graphRef.current.getBoundingClientRect();
                    var x = e.clientX - bounds.left;
                    var y = e.clientY - bounds.top;
                   let newPath : PathInterface ={
                       x1: currentPathInitialCoordiantes.x,
                       y1: currentPathInitialCoordiantes.y,
                       x2: x.toString(),
                       y2: y.toString()
                   }
                   setCurrentPath(newPath);
                   console.log(x,y);
                }
            }} onMouseUp={(e)=>{
                console.log(path,finalNode);
                if(path)
                {
                    if(finalVertex!=="")
                    {
                        handleValueOfFinalVertex(finalVertex);
                    }
                }
                handleSetPath(false,"","");
                setCurrentPath({
                    x1: "",
                    x2: "",
                    y1: "",
                    y2: "",
                })
            }} >
            <svg width={800} height={800} style={{
                position: 'absolute',
            }}>
                {

                    (path && currentPath!==undefined) && <Path x1={currentPath.x1} y1={currentPath.y1} x2={currentPath.x2} y2={currentPath.y2} />
                }
            </svg>
                <Xwrapper>
                    {
                        paths.map((path,index)=>{
                            return(
                                <div onMouseDown={(e)=>{
                                    console.log("path clicked");
                                    if(cursor==="crosshair")
                                    {
                                        deletePath(index);
                                    }
                                }} id={index.toString()}>
                                <Xarrow start={path.startNodeId} end={path.endNodeId} color="black" strokeWidth={5} path="straight" labels={{
                                    middle: (visualizationOption !==0 && visualizationOption!==1) ? <div style={
                                        {
                                            position: 'absolute',
                                            margin: '10px'
                                        }
                                    }><input  type="number" style={{
                                        backgroundColor: 'transparent',
                                        color: 'black',
                                        width: 'fit-content',
                                        borderStyle: 'none',
                                    }} onChange={(e)=>{
                                        let newPath = {...path};
                                        newPath.weigth = Number(e.target.value);
                                        let newPaths = [...paths];
                                        newPaths[index] = newPath;
                                        setPaths(newPaths);
                                    }} value={path.weigth}/></div>
                                    : <></> 
                                }} />
                                </div>
                            )
                        })
                    }
                                        {
                                        nodes.map((node,index)=>{
                                            return(
                                                <Node 
                                                id={node.id}
                                                value={node.value} 
                                                position={node.position} 
                                                handleDrag={handleDrag} 
                                                handleDragEnd={handleDragEnd} 
                                                index={index} 
                                                handleSetPath={handleSetPath} 
                                                graphRef={graphRef} 
                                                path={path} 
                                                handleValueOfInitialVertex={handleValueOfInitialVertex}
                                                handleValueOfFinalVertex={handleValueOfFinalVertex}
                                                handleFinalNode={handleFinalNode}
                                                changeValueOfVertex={changeValueOfVertex}
                                                cursor={cursor}
                                                deleteNode={deleteNode}/>
                                            )
                                        })
                    }
                </Xwrapper>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={hanldeSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    )
}

export default EditGraphModal;