import EM from 'EventEmitter';
export let em;
var audioCtx, canvas, canvasCtx, mediaRecorder;
var WIDTH, HEIGHT;

export function Init(el) {
    em = new EM();
    var constraints = {
        audio: true
    };
    var chunks = [];

    canvas = el.querySelector('canvas');
    audioCtx = new AudioContext();
    canvasCtx = canvas.getContext("2d");

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {

            mediaRecorder = new MediaRecorder(stream);

            visualize(stream);

            mediaRecorder.onstop = function () {
                console.log("data available after MediaRecorder.stop() called.");
                var blob = new Blob(chunks, {
                    'type': 'audio/ogg; codecs=opus'
                });
                chunks = [];

                em.emit("recorded", blob);
                console.log("recorder stopped");
            }

            mediaRecorder.ondataavailable = function (e) {
                chunks.push(e.data);
            }
        })
        .catch(function (err) {
            console.log('The following error occurred: ' + err);
        })
}

export function record(){
    mediaRecorder.start();
}

export function stop(){
    mediaRecorder.stop();
}

function visualize(stream) {
    var source = audioCtx.createMediaStreamSource(stream);

    var analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
    //analyser.connect(audioCtx.destination);

    draw()

    function draw() {
        WIDTH = canvas.width
        HEIGHT = canvas.height;

        requestAnimationFrame(draw);

        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

        canvasCtx.beginPath();

        var sliceWidth = WIDTH * 1.0 / bufferLength;
        var x = 0;


        for (var i = 0; i < bufferLength; i++) {

            var v = dataArray[i] / 128.0;
            var y = v * HEIGHT / 2;

            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();

    }
}