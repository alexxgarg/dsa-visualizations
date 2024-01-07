def dfs(node):
    if node not in visited:
        visited.append(node)
        neighbors = graph.get(node, [])
        for neighbor in neighbors:
            dfs(neighbor)
