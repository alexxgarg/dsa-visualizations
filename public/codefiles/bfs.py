def breadth_first_search(graph, start):
    visited = []
    queue = []

    # Enqueue the starting node
    queue.append(start)

    while queue:
        node = queue.pop(0)
        if node not in visited:
            visited.append(node)
            neighbors = graph.get(node, [])
            for neighbor in neighbors:
                if neighbor not in visited:
                    queue.append(neighbor)

    return visited