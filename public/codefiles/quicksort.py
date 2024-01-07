def quick_sort(arr):
    if len(arr) <= 1:
        return arr

    pivot = arr[-1]
    left_arr = []
    right_arr = []

    for i in range(len(arr) - 1):
        if arr[i] < pivot:
            left_arr.append(arr[i])
        else:
            right_arr.append(arr[i])

    leftQuickSortedArray = quick_sort(left_arr)
    rightQuickSortedArray = quick_sort(right_arr)
    return leftQuickSortedArray+[pivot]+rightQuickSortedArray