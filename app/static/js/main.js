const socket = io();
const findBtn = document.getElementById("findstranger");
const localVideo = document.getElementById("localVideo");

let localStream = null;

// 1. Camera & Mic stream
async function startCamera() { //This function will do something that may take time
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });//await - wait until its finished
        localVideo.srcObject = localStream;
    } catch (err) {
        console.error("Error accessing camera/mic:", err);
    }
}

// 2. Start camera on page load
startCamera();

// 3. Socket events
findBtn.addEventListener("click", () => {
    console.log("finding stranger");
    socket.emit("join_queue");
});

socket.on("match found", () => {
    alert("We found a stranger! Get ready!");
});
