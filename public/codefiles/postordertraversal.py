def printPostorder(root):
 
    if root:
 
        # First recur on left child
        printPostorder(root.left)
 
        # The recur on right child
        printPostorder(root.right)
 
        # Now print the data of node
        print(root.val, end=" "),