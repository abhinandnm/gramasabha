const socket = io();
const findBtn = document.getElementById("findstranger");
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const skipBtn = document.getElementById("skipBtn");



let peerConnection = null;
let currentRoom = null;

// Free Google STUN server (finds public IP address)
const rtcConfig = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

let localStream = null;

// 1. Camera & Mic stream
// async function startCamera() { //This function will do something that may take time
//     try {
//         localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });//await - wait until its finished
//         localVideo.srcObject = localStream;
//     } catch (err) {
//         console.error("Error accessing camera/mic:", err);
//     }
// }

// 2. Start camera on page load
// startCamera();



// 3. Socket events
findBtn.addEventListener("click", () => {
    console.log("finding stranger");
    socket.emit("join_queue");
});
skipBtn.addEventListener("click", () => {
    if (currentRoom) {
        // 1. Tell server you're leaving this room
        socket.emit("leave_chat", { room: currentRoom });

        chatBox.innerHTML += `<p style="color: gray; font-style: italic;">You left the chat.</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;

        // 3. Reset state & immediately search for a new match!
        currentRoom = null;
        messageInput.disabled = true;
        sendBtn.disabled = true;
        skipBtn.style.display = "none";
        findBtn.style.display = "inline-block";
        findBtn.disabled = true;
        findBtn.innerText = "Searching...";

        socket.emit("join_queue"); // Automatically find next stranger!
    }
});

socket.on("match found", (data) => {
    console.log("Matched in room:", data.room);
    currentRoom = data.room; // <--stores the room name!
    findBtn.style.display = "none";
    skipBtn.style.display = "inline-block";
    skipBtn.disabled = false;
    chatBox.innerHTML += `<p style="color: green; font-weight: bold;">Connected to a stranger! Say hello!</p>`;
    messageInput.disabled = false;
    sendBtn.disabled = false;
    messageInput.focus();
});


// 5. Function to Send Message (JavaScript -> Python)
function sendMessage() {
    const msg = messageInput.value.trim();//removed accidentall spaces
    if (msg && currentRoom) {
        // Send to Flask backend
        socket.emit("send_message", { room: currentRoom, message: msg });
        // Show on YOUR screen as "You"
        chatBox.innerHTML += `<p><strong>You:</strong> ${msg}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;
        messageInput.value = ""; // Clear input box
    }
}
// Send on button click or 'Enter' key press
sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});
// 6. When stranger sends a message (Python -> JavaScript)
socket.on("receive_message", (data) => {
    chatBox.innerHTML += `<p style="color: #0044cc;"><strong>Stranger:</strong> ${data.message}</p>`;
    chatBox.scrollTop = chatBox.scrollHeight;
});
socket.on("stranger_disconnected", () => {
    chatBox.innerHTML += `<p style="color: red; font-weight: bold;">Stranger has disconnected.</p>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    // Reset UI & state
    currentRoom = null;
    messageInput.disabled = true;
    sendBtn.disabled = true;
    skipBtn.disabled = true;
    skipBtn.style.display = "none";
    findBtn.style.display = "inline-block";
    findBtn.disabled = false;
    findBtn.innerText = "Find Stranger";
});


