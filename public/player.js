function playHls(hlsSource) {
    var video = document.getElementById('video');
    video.removeAttribute('src');
    video.removeAttribute('controls');
    video.removeAttribute('autoplay');
    video.load();

    if (hlsSource && hlsSource !== 'null') {
        video.style.display = '';
        video.controls = true;
        video.autolay = true;
        if (Hls.isSupported()) {
            var hls = new Hls();
            hls.loadSource(hlsSource);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                video.play();
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = hlsSource;
            video.addEventListener('loadedmetadata', function () {
                video.play();
            });
        }
    } else {
        video.style.display = 'none';
    }
}

function analyzeSource(source) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let body = this.responseText;
            var regex = /#EXT-X-STREAM-INF:RESOLUTION=\d+x(\d+),BANDWIDTH=(\d+),(FRAME-RATE=([0-9.]+),)?CODECS="[^"]+",CLOSED-CAPTIONS="[^"]+",AUDIO="[^"]+"\n(.+\.m3u8)/gm;
            var streams = [];

            var match;
            while ((match = regex.exec(body)) !== null) {
                streams.push({
                    resolution: match[1] + 'p',
                    bandwidth: match[2],
                    framerate: match[4],
                    url: source.substring(0, source.lastIndexOf('/') + 1) + match[5],
                });
            }

            createSelector(streams);
        }
    }
    xhttp.open('GET', source, true);
    xhttp.send();
}

function createSelector(streams) {
    var selector = document.getElementById('selector');
    selector.options[0] = new Option('Select stream', null);

    for (let i = 1; i < streams.length; i++) {
        let stream = streams[i];
        let streamName = stream.resolution + (stream.framerate ? (' ' + stream.framerate + 'fps') : '');
        selector.options[i] = new Option(streamName, stream.url);
    }

    selector.onchange = () => {
        playHls(selector.value);
    };
}

var cors_api_host = 'lazyguy-nhl-proxy.herokuapp.com';
var cors_api_url = 'https://' + cors_api_host + '/';
var slice = [].slice;
var origin = window.location.protocol + '//' + window.location.host;
// console.log('origin: ' + origin);
var open = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function() {
    var args = slice.call(arguments);
    var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
    // console.log('targetOrigin: ' + targetOrigin);
    // console.log('args: ' + args);
    args[1] = args[1].replace('https://mf.svc.nhl.com', 'http://178.62.203.238'); // instead of hosts file
    // console.log('new args: ' + args);
    if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
        targetOrigin[1] !== cors_api_host) {
        args[1] = cors_api_url + args[1];
    }
    return open.apply(this, args);
};


if (document.URL.includes('?')) {
    var query = document.URL.substring(document.URL.indexOf('?') + 1);

    var params = {};
    for (const param of query.split('&')) {
        let groups = /(.+)=(.+)/.exec(param);
        params[groups[1]] = groups[2];
    }

    if (params.source) {
        var source = decodeURIComponent(params.source);
        analyzeSource(source);
    }
}
