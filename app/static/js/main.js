const socket = io();
const findBtn = document.getElementById("findstranger");
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const skipBtn = document.getElementById("skipBtn");
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");

let peerConnection = null;
let currentRoom = null;

// Free Google STUN server (saved for WebRTC video phase)
const rtcConfig = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

let localStream = null;

// Status helper
function setStatus(state, text) {
    if (statusDot && statusText) {
        statusDot.className = `status-dot ${state}`;
        statusText.innerText = text;
    }
}

// Helper to escape HTML characters in messages
function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

// 1. Join Queue on Find Stranger click
findBtn.addEventListener("click", () => {
    console.log("Finding stranger...");
    findBtn.disabled = true;
    findBtn.innerText = "Searching...";
    setStatus("searching", "Searching...");
    chatBox.innerHTML = `<div class="msg-system">Looking for a match...</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
    socket.emit("join_queue");
});

// 2. Skip Stranger click
skipBtn.addEventListener("click", () => {
    if (currentRoom) {
        // Tell server we are leaving
        socket.emit("leave_chat", { room: currentRoom });

        // Reset state
        currentRoom = null;
        messageInput.disabled = true;
        sendBtn.disabled = true;

        // Toggle buttons to searching state
        skipBtn.style.display = "none";
        findBtn.style.display = "inline-block";
        findBtn.disabled = true;
        findBtn.innerText = "Searching...";
        setStatus("searching", "Searching...");

        chatBox.innerHTML = `<div class="msg-system">Looking for a match...</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;

        socket.emit("join_queue"); // Automatically find next stranger!
    }
});

// 3. Match Found
socket.on("match found", (data) => {
    console.log("Matched in room:", data.room);
    currentRoom = data.room; // Store room name

    findBtn.style.display = "none";
    skipBtn.style.display = "inline-block";
    skipBtn.disabled = false;

    setStatus("connected", "Connected");
    // Clear old search notices and show connected badge
    chatBox.innerHTML = `<div class="msg-system success">Connected to a stranger! Say hello!</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    messageInput.disabled = false;
    sendBtn.disabled = false;
    messageInput.focus();
});

// 4. Send Message function
function sendMessage() {
    const msg = messageInput.value.trim();
    if (msg && currentRoom) {
        // Send to Flask backend
        socket.emit("send_message", { room: currentRoom, message: msg });

        // Show on screen as "You" bubble
        chatBox.innerHTML += `
            <div class="msg-row you">
                <div class="bubble">${escapeHtml(msg)}</div>
            </div>
        `;
        chatBox.scrollTop = chatBox.scrollHeight;
        messageInput.value = "";
    }
}

// Send on button click or 'Enter' key press
sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

// 5. Receive message from stranger
socket.on("receive_message", (data) => {
    chatBox.innerHTML += `
        <div class="msg-row stranger">
            <div class="bubble">${escapeHtml(data.message)}</div>
        </div>
    `;
    chatBox.scrollTop = chatBox.scrollHeight;
});

// 6. Stranger disconnected
socket.on("stranger_disconnected", () => {
    chatBox.innerHTML += `<div class="msg-system danger">Stranger has disconnected.</div>`;
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
    setStatus("disconnected", "Disconnected");
});


