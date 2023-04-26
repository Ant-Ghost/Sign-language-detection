// window.onload = function () {

// Using the browser's navigator api to access the camera.
navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {

    const recorder = document.getElementById("video");
    const recordingContainer=document.querySelector("recording-container");

    // This Object will help us recordt the stream
    const mediaRecorder = new MediaRecorder(stream);

    const startButton = document.getElementById("startBtn");
    let chunk = [];

    // Adding the stream to recorder(video) element so that user can view whatever the camera is capturing
    recorder.srcObject = stream;

    // Starting the recording when button is clicked.
    startButton.onclick = () => {
        console.log("Recording Started!!!")
        mediaRecorder.start();
        recorder.style.background = "red";
        recorder.style.color = "black";

        // adding timer
        let sec = 1;
        const intervalTimer = setInterval(() => {
            const timer = document.getElementById("timer");
            timer.innerHTML = `${sec++} sec.`;
        }, 1000)

        // To stop the recording after 10 sec.
        setTimeout(() => {
            console.log("Recording Stopped!!!")
            mediaRecorder.stop();
            recorder.style.background = "";
            recorder.style.color = "";
            clearInterval(intervalTimer);
            timer.innerHTML = `0 sec.`;
        }, 11000)
    }

    // Assembling the data chunk by chunk.
    mediaRecorder.ondataavailable = (e) => {
        console.log("Data Recieved!!!")
        chunk.push(e.data);
    }

    // Actions after stopping the recording.
    mediaRecorder.onstop = (e) => {
        console.log("Stopped!!! Saving video.")

        // Aggregating the chunks (array of blobs or binary objects) to create one binary object
        const videoBlob = new Blob(chunk, { type: "video/mp4" });
        const videoUrl = URL.createObjectURL(videoBlob);

        // Storing the video locally
        window.localStorage.setItem("newVid", videoBlob);

        // setting up the preview window (video - source)
        const previewVideo = document.getElementById("preview");
        previewVideo.setAttribute("controls", "");
        previewVideo.setAttribute("autoplay", "");
        previewVideo.style.display = "block";

        // remove the child (source) if exists
        if (previewVideo.hasChildNodes()) {
            previewVideo.removeChild(previewVideo.children[0]);
        }

        // creating the source element and configuring it
        const source = document.createElement("source");
        source.src = videoUrl;
        source.type = "video/mp4";

        // adding source element to video
        previewVideo.appendChild(source);
    }
})
// }