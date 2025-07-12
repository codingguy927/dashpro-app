function makeCounter() {
    let count = 0;
    return function () {
        count++;
        console.log('Count is', count);
    };
}

const counterA = makeCounter();
counterA(); // Count is 1
counterA(); // count is 2

const counterB = makeCounter();
counterB(); // count is 1

// Event loop demo
console.log('Start');
setTimeout(() => console.log('Timeout callback'), 0);
Promise.resolve().then(() => console.log('Promise callback'));
console.log('End');