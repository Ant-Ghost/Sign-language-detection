let mediaRecorder = null;
let videoTrack = null;
let recorder = null;
let videoBlob = null;
let backend = ``;

const TurnOnCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });

    // This Object will help us recordt the stream
    mediaRecorder = new MediaRecorder(stream);

    // This object will let us control the camera permission
    videoTrack = stream.getVideoTracks()[0]
    recorder = document.getElementById("video");
    // Adding the stream to recorder(video) element so that user can view whatever the camera is capturing
    recorder.srcObject = stream;
}

const AddPreviewVideo = (videoUrl) => {
    // setting up the preview window (video - source)
    const previewVideo = document.getElementById("preview");
    previewVideo.setAttribute("controls", "");
    previewVideo.setAttribute("autoplay", "");
    previewVideo.style.display = "block";

    // remove the child (source) if exists
    if (previewVideo.hasChildNodes()) {
        previewVideo.children[0].src = videoUrl;
        previewVideo.children[0].type = "video/mp4";
        previewVideo.load();
    } else {
        // creating the source element and configuring it
        const source = document.createElement("source");
        source.src = videoUrl;
        source.type = "video/mp4";
    
        // adding source element to video
        previewVideo.appendChild(source);

        previewVideo.load();
    }
    // RemovePreviewVideo();

}

const RemovePreviewVideo = () => {
    const previewVideo = document.getElementById("preview");
    console.log("PreviewVideo Children", previewVideo.hasChildNodes(), previewVideo.children[0]);
    // remove the child (source) if exists
    if (previewVideo.hasChildNodes()) {
        previewVideo.removeChild(previewVideo.children[0]);
    }
    previewVideo.style.display = "none";
}

const StartRecording = async () => {
    
    if(!mediaRecorder || !videoTrack || !recorder){
        alert("Please Grant Permission for Camera!!!");
        await TurnOnCamera();
        return ;
    }
    
    let chunk = [];

    const body = document.getElementById("main-body");

    let waitTimer = document.getElementById("waitTimer");
    let waitTime = 3;
    const waitIntervalTimer = setInterval(()=>{
        waitTimer.innerText = `Recording starts in ${waitTime--} sec`;
    },1000);
    
    setTimeout(()=>{

        clearInterval(waitIntervalTimer);
        waitTimer.innerText = "";
        waitTime = 3;

        body.classList.add("no-pointer-events");
    
        // Starting the recording when button is clicked.
        console.log("Recording Started!!!")
        mediaRecorder.start();
        recorder.style.background = "red";
        recorder.style.color = "black";
    
        // adding timer
        let sec = 1;
        const timer = document.getElementById("timer");
        const intervalTimer = setInterval(() => {
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
        }, 8000)
    }, 4000);


    // Assembling the data chunk by chunk.
    mediaRecorder.ondataavailable = (e) => {
        console.log("Data Recieved!!!")
        chunk.push(e.data);
    }

    // Actions after stopping the recording.
    mediaRecorder.onstop = (e) => {
        console.log("Stopped!!! Saving video.")

        // Aggregating the chunks (array of blobs or binary objects) to create one binary object
        videoBlob = new Blob(chunk, { type: "video/mp4" });
        const videoUrl = URL.createObjectURL(videoBlob);

        // Storing the video locally
        window.localStorage.setItem("newVid", videoBlob);

        AddPreviewVideo(videoUrl);

        body.classList.remove("no-pointer-events");
    }
}

const SubmitVideo = async () => {
    try{
        if(!videoBlob){
            alert("Video Not Found!!!!");
            return;
        }
        const form = new FormData();
        form.append("file", videoBlob, "newProject.mp4");
        const response = await axios.post(
            `${backend}/file/upload`,
            form,
        )
        if(response.status < 300){
            const answer = document.getElementById("answer");
            answer.innerText = response.data.result;
        } else {
            alert("Internal Error!!!");
            return;
        }
    }catch(err){
        alert("An error occured!!!");
        console.log(err);
    }
}

const ResetPracticePageAccess = () => {
    if(mediaRecorder){
        mediaRecorder.stop();
        mediaRecorder = null;
    }
    if(videoTrack){
        videoTrack.stop();
        videoTrack = null;
    }
    if(recorder){
        recorder.srcObject = null;
        recorder = null;
    }
}

TurnOnCamera().then(()=> console.log("Camera Started!!!")).catch(console.error);