import TreeNode from "./TreeNode";
import '../../../../styles/TreeNode.css';
import { NodeWidthAndHeight } from "../VisualizationComponents/BinaryTreeVisualizer";
import { IMarker } from "react-ace";

export interface BinaryTreeAnimationInterface{
  type: 'node' | 'link';
  nodeId? : number;
  linkId? : string;
  currentLineMarkers : IMarker[]; 
  color: string;
  values: number[];
}

export interface Link{
  id: string;
  sx: number;
  sy: number;
  ex: number;
  ey: number;
  color: string;
}

export class Node
{

    value: number;
    left: Node | null;
    right : Node | null;
    id: number;
  constructor(value: number) {
    this.value = value
    this.left = null
    this.right = null
    this.id = 0;
  }
}

export class NodeTree{
  value: number;
  id: number;
  x: number;
  y: number;
  color: string;
  constructor(value: number) {
    this.value = value
    this.x=0;
    this.y=0;
    this.id = 0;
    this.color = 'transparent'
  }
}

export class LinkTree{
  id: number;
  sx: number;
  sy: number;
  ex: number;
  ey: number;
  color: string;
  constructor(value: number) {
    this.sx=0;
    this.sy=0;
    this.ex=0;
    this.ey =0;
    this.id = 0;
    this.color = 'transparent'
  }
}

export class BinaryTree{
    root : Node | null = null;
    path: number[] = [];
    height : number = 0;
    nodes : NodeTree[] = [];
    links: LinkTree[] = [];
    distance: number = 0;
    nodeSize: number = 0;
    nodeMap : Map<number,NodeTree> = new Map<number,NodeTree>();
    constructor() {
        this.root = null;
        this.distance = 75;
        this.nodeSize = 10;
    }

    createTree(arr: number[]){
      this.root = this.insertLevelOrder(arr,0);
      this.height = this.getHeight(this.root)-1;
      const n = Math.pow(2,this.height+1)-1;
      this.createNodesAndLinks(this.root,0,Math.round((n-1)/2),this.height);
      return this.nodes;
    }

    returnHeight(){
      return (this.height+1)*this.distance;
    }

    returnWidth(){
      return (Math.pow(2,this.height+1) - 1)*this.distance;
    }

    getHeight(root: Node | null) : number{
      if(root===null)
      {
        return 0;
      }
      return Math.max(this.getHeight(root.left),this.getHeight(root.right))+1;
    }
    
    createNodesAndLinks(root: Node|null,row: number,column: number,height: number)
    {
      if(root===null)
      {
        return;
      }
      let nodeTree: NodeTree={
        value: root.value,
        id: root.id,
        x: row*this.distance,
        y: (column*this.distance),
        color: "transparent"
      }
      this.nodeMap.set(nodeTree.id,nodeTree);
      this.nodes.push(nodeTree);
      this.createNodesAndLinks(root.left,row+1,column-Math.pow(2,height-row-1),height);
      this.createNodesAndLinks(root.right,row+1,column+Math.pow(2,height-row-1),height);
    }

    createLinks(nodesWidthAndHeight : NodeWidthAndHeight[]){
      let links  : Link[] = [];
      let nodesWidthAndHeightMap : Map<number,NodeWidthAndHeight> = new Map<number,NodeWidthAndHeight>();
      nodesWidthAndHeight.forEach(nodeWidthAndHeight=>{
        nodesWidthAndHeightMap.set(nodeWidthAndHeight.id,nodeWidthAndHeight);
      })
      this.createLinkTrees(this.root,null,links,nodesWidthAndHeightMap);
      return links;
    }

    createLinkTrees(root: Node|null,parent: Node|null,links: Link[],nodesWidthAndHeightMap : Map<number,NodeWidthAndHeight>){
      if (root===null)
      {
        return;
      }
      const positionX = this.nodeMap.get(root.id)?.x;
      const positionY = this.nodeMap.get(root.id)?.y;
      const height = nodesWidthAndHeightMap.get(root.id)?.height;
      const width = nodesWidthAndHeightMap.get(root.id)?.width;


      if(positionX!==undefined && positionY!==undefined && height!==undefined && width!==undefined){
        console.log(true);
        if(root.left)
        {
          const positionLeftX = this.nodeMap.get(root.left.id)?.x;
          const positionLeftY = this.nodeMap.get(root.left.id)?.y;
          const leftHeight = nodesWidthAndHeightMap.get(root.left.id)?.height;
          const leftWidth = nodesWidthAndHeightMap.get(root.left.id)?.width;
          if(positionLeftX!==undefined && positionLeftY!==undefined && leftWidth!==undefined && leftHeight!==undefined)
          {
            links.push({
              id: root.id+'-'+root.left.id,
              sx: positionX+height,
              sy: positionY+(width/2),
              ex: positionLeftX,
              ey: positionLeftY + (leftWidth/2),
              color: "black"
            })
          }
          this.createLinkTrees(root.left,root,links,nodesWidthAndHeightMap);
        }
        if(root.right)
        {
          const positionRightX = this.nodeMap.get(root.right.id)?.x;
          const positionRightY = this.nodeMap.get(root.right.id)?.y;
          const rightHeight = nodesWidthAndHeightMap.get(root.right.id)?.height;
          const rightWidth = nodesWidthAndHeightMap.get(root.right.id)?.width;
          if(positionRightX!==undefined && positionRightY!==undefined && rightHeight!==undefined && rightWidth!==undefined)
          {
            links.push({
              id: root.id+'-'+root.right.id,
              sx: positionX+height,
              sy: positionY+(width/2),
              ex: positionRightX,
              ey: positionRightY + (rightWidth/2),
              color: "black"
            })
          }
          this.createLinkTrees(root.right,root,links,nodesWidthAndHeightMap);
        }
      }
    }

     
    insertLevelOrder(arr : number[], i: number) : Node | null
    {
        let root : Node | null = null;
        // Base case for recursion
        if (i < arr.length) {
            root = new Node(arr[i]);

            root.id = i;
            // insert left child
            root.left = this.insertLevelOrder(arr, 2 * i + 1);
   
            // insert right child
            root.right = this.insertLevelOrder(arr, 2 * i + 2);
        }
        return root;
    }

    inorder(node : Node | null, initial = false) : any {
        if(initial) {
          this.path = []
        }
        if(node === null) {
          return null
        }
        this.inorder(node.left);
        this.path.push(node.id);
        this.inorder(node.right);
      }
      
      getPath() {
        return this.path
      }
      
      getinOrderPath() {
        this.inorder(this.root, true)
         return this.getPath()
      }
}

const BinaryTreeComponent = () =>{
    return (
        <div className="binary-tree">
          <TreeNode value="Root" hasChildren={true}>
            <div className="children">
              <TreeNode value="Left" hasChildren={false} />
              <TreeNode value="Right" hasChildren={false} />
            </div>
          </TreeNode>
        </div>
      );
}

export default BinaryTreeComponent;