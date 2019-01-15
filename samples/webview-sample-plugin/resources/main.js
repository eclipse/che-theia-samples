// This script will be run within the webview itself
// It cannot access the main Theia APIs directly.
(function () {
    if (typeof acquireTheiaApi === 'undefined') {
        return
    }
    const api = acquireTheiaApi();
    const oldState = api.getState();
    const counter = document.getElementById('lines-of-code-counter');
    console.log(oldState);
    var currentCount = (oldState && oldState.count) || 0;
    counter.textContent = currentCount;

    setInterval(function () {
        counter.textContent = currentCount++;

        // Update state
        api.setState({ count: currentCount });

        // Alert the extension when the cat introduces a bug
        if (Math.random() < Math.min(0.001 * currentCount, 0.05)) {
            // Send a message back to the extension
            api.postMessage({
                command: 'alert',
                text: 'A typo at line ' + currentCount
            });
        }
    }, 200);

    // Handle messages sent from the extension to the webview
    window.addEventListener('message', function (event) {
        const message = event.data; // The json data that the extension sent
        if (message.command ==='refactor') {
                currentCount = Math.ceil(currentCount * 0.5);
                counter.textContent = currentCount;
        }
    })
}());
