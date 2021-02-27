const fetch = require('node-fetch');

// globals
const interval = 5 * 60 * 1000; // interval in milliseconds - {25mins x 60s x 1000}ms
const url = 'https://semblance-bot.herokuapp.com';

(function wake() {
    let handler;
    try {

        handler = setInterval(() => {

            fetch(url)
                .then(res => console.log(`response-ok: ${res.ok}, status: ${res.status}`))
                .catch(err => console.error(`Error occured: ${err}`));
        }, interval);
    } catch(err) {
        console.error('Error occured: retrying...');
        clearInterval(handler);
        return setTimeout(() => wake(), 10000);
    };
})();
