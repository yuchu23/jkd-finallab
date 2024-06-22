let delay = 100; // 默认延迟
let generatedArray = [];
let bubbleSortTime, quickSortTime, insertionSortTime, selectionSortTime;

function generateRandomArray(size) {
    generatedArray = Array.from({ length: size }, () => Math.floor(Math.random() * 200) - 100);
    visualizeArray('bubbleArrayContainer', generatedArray, size);
    visualizeArray('quickArrayContainer', generatedArray, size);
    visualizeArray('insertionArrayContainer', generatedArray, size);
    visualizeArray('selectionArrayContainer', generatedArray, size);
    document.getElementById('startButton').style.display = 'block';
}

function visualizeArray(containerId, array, size) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // 清空
    const containerWidth = container.clientWidth;
    const barWidth = Math.max(5, Math.floor(containerWidth / size) - 2);
    array.forEach(num => {
        const bar = document.createElement('div');
        bar.style.height = `${(num + 100) * 2}px`;
        bar.style.width = `${barWidth}px`;
        bar.classList.add('bar');
        container.appendChild(bar);
    });
}

async function startSort() {
    if (generatedArray.length === 0) return;
    // 获取选择的速度
    const speed = parseFloat(document.getElementById('speedSelector').value);
    delay = 100 / speed; // 根据选择的速度调整延迟
    const promises = [];
    promises.push(bubbleSort([...generatedArray]));
    promises.push(quickSort([...generatedArray], 0, generatedArray.length - 1, 'quickArrayContainer'));
    promises.push(insertionSort([...generatedArray]));
    promises.push(selectionSort([...generatedArray]));
    await Promise.all(promises);
    determineFastestSort();
}

async function bubbleSort(array) {
    const sortStartTime = performance.now();
    const bars = document.querySelectorAll('#bubbleArrayContainer .bar');
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                bars[j].style.height = `${(array[j] + 100) * 2}px`;
                bars[j + 1].style.height = `${(array[j + 1] + 100) * 2}px`;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    bubbleSortTime = performance.now() - sortStartTime;
    document.getElementById('bubbleSortTime').innerText = `冒泡排序时间：${bubbleSortTime.toFixed(2)} 毫秒`;
}

async function quickSort(array, low, high, containerId) {
    const sortStartTime = performance.now();
    await quickSortHelper(array, low, high, containerId);
    quickSortTime = performance.now() - sortStartTime;
    document.getElementById('quickSortTime').innerText = `快速排序时间：${quickSortTime.toFixed(2)} 毫秒`;
}

async function quickSortHelper(array, low, high, containerId) {
    if (low < high) {
        const pi = await partition(array, low, high, containerId);
        await quickSortHelper(array, low, pi - 1, containerId);
        await quickSortHelper(array, pi + 1, high, containerId);
    }
}

async function partition(array, low, high, containerId) {
    let pivot = array[high];
    let i = low - 1;
    const bars = document.querySelectorAll(`#${containerId} .bar`);
    for (let j = low; j < high; j++) {
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            bars[i].style.height = `${(array[i] + 100) * 2}px`;
            bars[j].style.height = `${(array[j] + 100) * 2}px`;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    bars[i + 1].style.height = `${(array[i + 1] + 100) * 2}px`;
    bars[high].style.height = `${(array[high] + 100) * 2}px`;
    await new Promise(resolve => setTimeout(resolve, delay));
    return i + 1;
}

async function insertionSort(array) {
    const sortStartTime = performance.now();
    const bars = document.querySelectorAll('#insertionArrayContainer .bar');
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            bars[j + 1].style.height = `${(array[j + 1] + 100) * 2}px`;
            j--;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        array[j + 1] = key;
        bars[j + 1].style.height = `${(array[j + 1] + 100) * 2}px`;
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    insertionSortTime = performance.now() - sortStartTime;
    document.getElementById('insertionSortTime').innerText = `插入排序时间：${insertionSortTime.toFixed(2)} 毫秒`;
}

async function selectionSort(array) {
    const sortStartTime = performance.now();
    const bars = document.querySelectorAll('#selectionArrayContainer .bar');
    for (let i = 0; i < array.length - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < array.length; j++) {
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        [array[i], array[minIdx]] = [array[minIdx], array[i]];
        bars[i].style.height = `${(array[i] + 100) * 2}px`;
        bars[minIdx].style.height = `${(array[minIdx] + 100) * 2}px`;
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    selectionSortTime = performance.now() - sortStartTime;
    document.getElementById('selectionSortTime').innerText = `选择排序时间：${selectionSortTime.toFixed(2)} 毫秒`;
}

function generateCustomArray() {
    const size = document.getElementById('customArraySize').value;
    if (size && size > 0) {
        generateRandomArray(parseInt(size));
    } else {
        alert("请输入一个正整数");
    }
}

function determineFastestSort() {
    const times = {
        '冒泡排序': bubbleSortTime,
        '快速排序': quickSortTime,
        '插入排序': insertionSortTime,
        '选择排序': selectionSortTime
    };

    const fastest = Object.keys(times).reduce((a, b) => times[a] < times[b] ? a : b);
    document.getElementById('fastestSort').innerText = `最快的排序是：${fastest}，用时 ${times[fastest].toFixed(2)} 毫秒`;
}
