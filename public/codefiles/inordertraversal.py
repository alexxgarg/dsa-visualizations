def printInorder(root):
 
    if root:
 
        # First recur on left child
        printInorder(root.left)
 
        # Then print the data of node
        print(root.val, end=" "),
 
        # Now recur on right child
        printInorder(root.right)