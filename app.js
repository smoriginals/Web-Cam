const video = document.querySelector(".web-cam");
const canvas = document.querySelector(".web-area");
const ctx = canvas.getContext('2d');
const strip = document.querySelector(".screenshot-area");
const snap = document.querySelector(".snap");


function TakeUserVideo() {
    navigator.mediaDevices.getUserMedia(
        { video: true, audio: true })
        .then(showUserCam => {
            video.srcObject = showUserCam;
            video.play();
        })
        .catch(err => {
            console.log("Cam Access Denied!!", err);
        })
}

function PaintToCanvas() {
    const height = video.videoHeight;
    const width = video.videoWidth;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        let pixels = ctx.getImageData(0, 0, width, height);

        pixels = RedEffect(pixels);  //Red Effect
        pixels = RgbSplit(pixels);  //RGB Effect
        ctx.globalAlpha = 0.1;      //Blur Amt
        ctx.putImageData(pixels, 0, 0);
    }, 16);
}

function TakePhoto() {
    snap.currentTime = 0;
    snap.play();
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'UGLY');
    link.innerHTML = `<img src="${data}" alt="UGLY Man" height="150px" width="150px"/>`;
    strip.insertBefore(link, strip.firstChild);
}

function RedEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100; //Red
        pixels.data[i + 1] = pixels.data[i + 1] - 50; //Green
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //Blue
    }
    return pixels;
}

function RgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 150] = pixels.data[i + 0]; //Red
        pixels.data[i + 100] = pixels.data[i + 1]; //Green
        pixels.data[i - 150] = pixels.data[i + 2]; //Blue
    }
    return pixels;
}
TakeUserVideo();

video.addEventListener('canplay', PaintToCanvas);