import { IMarker } from "react-ace";
import { NodeWidthAndHeight } from "../VisualizationComponents/MergeSortArrayVisualizer";

export class NodeTree{
    id: number;
    value: number[];
    i: number;
    j: number;
    indexI : number = 0;
    indexJ: number = 0;
    colorI: string = 'transparent';
    colorJ: string = 'transparent';
    constructor(id: number,value: number[],i:number,j:number){
        this.id = id;
        this.value = value;
        this.i=i;
        this.j=j;
        this.indexI
    }
}

export class Link{
    id: string;
    sx: number;
    sy: number;
    ex: number;
    ey: number;
    isVisible: boolean;

    constructor(id: string,sx: number,sy:number,ex:number,ey:number,isVisible: boolean){
        this.id = id;
        this.sx = sx;
        this.sy = sy;
        this.ex = ex;
        this.ey = ey;
        this.isVisible = isVisible;
    }
  }
  

export class DivideAndConquerArray{
    height: number = 0;
    Map: Map<number,NodeTree>;
    distance: number = 75;
    nodes : NodeTree[] = [];
    links: Link[] = [];
    linkMap: Map<string,Link>;
    heightForQuickSort: number = 0;
    distanceQuickSort : number = 100;
    constructor(array: number[],type: "mergesort" | "quicksort"){
        this.Map = new Map<number,NodeTree>();
        this.linkMap = new Map<string,Link>();
        if(array.length>0)
        {
        if(type==="mergesort")
        {
        this.height=this.getHeight(array);
        const n = Math.pow(2,this.height+1)-1;
        this.createNodesOfArray(array,0,this.floorDivision(n-1,2));
        this.nodes[0].value = array;
        }
        else{
            this.heightForQuickSort=this.getHeightForQuickSort(array);
            const n = Math.pow(2,this.heightForQuickSort+1)-1;
            this.createNodesOfArrayQuickSort(array,0,this.floorDivision(n-1,2));
            this.nodes[0].value = array;
        }
        }
    }

    floorDivision(a:number,b:number) {
        return Math.floor(a / b);
    }

    getHeight(array: number[]) : number{
        if (array.length===1)
        {
            return 0;
        }
        const mid = this.floorDivision(array.length,2);
        return 1 + this.getHeight(array.slice(mid));
    }

    getHeightForQuickSort(array: number[]): number{
        if(array.length<=1)
        {
            return 0;
        }
        const pivot = array[array.length - 1];
        const leftArr = [];
        const rightArr = [];
    
        for (let i = 0; i < array.length - 1; i++) {
            if (array[i] < pivot) {
                leftArr.push(array[i]);
            } else {
                rightArr.push(array[i]);
            }
        }
    
        return 1+Math.max(this.getHeightForQuickSort(leftArr),this.getHeightForQuickSort(rightArr));
    }

    createNodesOfArray(array: number[],i: number,j:number){
        let nodeTree = new NodeTree(j,[],i*(this.distance+50),j*(this.distance+50));
        this.Map.set(j,nodeTree);
        this.nodes.push(nodeTree);
        if(array.length===1)
        {
            return;
        }
        const mid = this.floorDivision(array.length,2);
        const diff = Math.pow(2,this.height-i-1);
        this.createNodesOfArray(array.slice(0,mid),i+1,j-diff);
        this.createNodesOfArray(array.slice(mid),i+1,j+diff);
    }

    createNodesOfArrayQuickSort(array: number[],i: number,j:number){
        if(array.length===0)
        {
            return;
        }
        let nodeTree = new NodeTree(j,[],i*(this.distanceQuickSort+50),j*(this.distanceQuickSort+50));
        this.Map.set(j,nodeTree);
        this.nodes.push(nodeTree);
        const pivot = array[array.length - 1];
        const leftArr = [];
        const rightArr = [];
    
        for (let i = 0; i < array.length - 1; i++) {
            if (array[i] < pivot) {
                leftArr.push(array[i]);
            } else {
                rightArr.push(array[i]);
            }
        }
        const diff = Math.pow(2,this.heightForQuickSort-i-1);
        this.createNodesOfArrayQuickSort(leftArr,i+1,j-diff);
        this.createNodesOfArrayQuickSort(rightArr,i+1,j+diff);
    }



    returnHeight(){
        return (this.height+1)*(this.distance+50);
      }
  
      returnWidth(){
        return  (Math.pow(2,this.height+1) - 1)*(this.distance+50);
      }

      returnInitialJPosition(){
        const n = Math.pow(2,this.height+1) - 1;
        return this.floorDivision(n-1,2);
        
      }

      returnHeightQuickSort(){
        return (this.heightForQuickSort+1)*(this.distanceQuickSort+50);
      }
  
      returnWidthForQuickSort(){
        return  (Math.pow(2,this.heightForQuickSort+1) - 1)*(this.distanceQuickSort+50);
      }

      returnInitialJPositionQuickSort(){
        const n = Math.pow(2,this.heightForQuickSort+1) - 1;
        return this.floorDivision(n-1,2);
        
      }


}