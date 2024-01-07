import { BinaryTreeAnimationInterface, Node } from "../components/Utils/BinaryTree";
import { deepCopy } from "./mergesort";


export const traverseTreeInorder = (root : Node | null,animations: BinaryTreeAnimationInterface[],values: number[])=>
{
    if(root===null)
    {
        return;
    }
    if(root.left!==null)
    {
    animations.push(
        {
            type: "link",
            currentLineMarkers: [{startRow: 5, startCol: 0, endRow: 5, endCol: 1000, className: 'myMarker',type: 'text'}],
            color: "red",
            linkId: root.id+'-'+root.left.id,
            values : deepCopy(values)
        }
    );
    traverseTreeInorder(root.left,animations,values);
    }
    values.push(root.value);
    animations.push(
        {
            type: "node",
            currentLineMarkers: [{startRow: 8, startCol: 0, endRow: 8, endCol: 1000, className: 'myMarker',type: 'text'}],
            color: "red",
            nodeId: root.id,
            values : deepCopy(values)
        }
    );
    if(root.right!==null)
    {
    animations.push(
        {
            type: "link",
            currentLineMarkers: [{startRow: 11, startCol: 0, endRow: 11, endCol: 1000, className: 'myMarker',type: 'text'}],
            color: "red",
            linkId: root.id+'-'+root.right.id,
            values : deepCopy(values)
        }
    );
    traverseTreeInorder(root.right,animations,values);
    }

}

const InorderTraversalComponent = ()=>{
    return(
        <div></div>
    )
}

export default InorderTraversalComponent;