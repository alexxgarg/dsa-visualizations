def printPreorder(root):
 
    if root:
 
        # First print the data of node
        print(root.val, end=" "),
 
        # Then recur on left child
        printPreorder(root.left)
 
        # Finally recur on right child
        printPreorder(root.right)