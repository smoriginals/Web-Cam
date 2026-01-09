const video = document.querySelector(".web-cam");
const canvas = document.querySelector(".web-area");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".screenshot-area");
const snap = document.querySelector(".snap");

function takeUserVideo() {
    navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then(stream => {
            video.srcObject = stream;
            video.play();
        })
        .catch(err => console.error("Camera access denied", err));
}

function paintToCanvas() {
    if (!video.videoWidth || !video.videoHeight) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0);
        let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
        pixels = greenScreenFilter(pixels);
        ctx.putImageData(pixels, 0, 0);
    }, 16);
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();

    const data = canvas.toDataURL("image/jpeg");
    const link = document.createElement("a");
    link.href = data;
    link.download = "snapshot";
    link.innerHTML = `<img src="${data}" alt="Snapshot" />`;
    strip.prepend(link);
}

function greenScreenFilter(pixels) {
    const levels = {};
    document.querySelectorAll(".controls input").forEach(input => {
        levels[input.name] = Number(input.value);
    });

    for (let i = 0; i < pixels.data.length; i += 4) {
        const red = pixels.data[i];
        const green = pixels.data[i + 1];
        const blue = pixels.data[i + 2];

        if (
            red >= levels.redMin &&
            green >= levels.greenMin &&
            blue >= levels.blueMin &&
            red <= levels.redMax &&
            green <= levels.greenMax &&
            blue <= levels.blueMax
        ) {
            pixels.data[i + 3] = 0;
        }
    }
    return pixels;
}

takeUserVideo();
video.addEventListener("loadeddata", paintToCanvas);
document.querySelector(".takePhoto").addEventListener("click", takePhoto);
