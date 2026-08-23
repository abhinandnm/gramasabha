# GramaSabha — Real-Time Stranger Chat Platform

> An anonymous, real-time stranger chat web application built with **Python (Flask)**, **Flask-SocketIO (WebSockets)**, and a **Dark Neumorphic (Soft UI)** frontend.

---

## Features

- **Instant Matchmaking Queue**: Pairs random online strangers into unique, isolated chat rooms using an event-driven FIFO queue.
- **Bidirectional Real-Time Messaging**: Lag-free messaging powered by WebSockets (`Flask-SocketIO`), with distinct chat bubbles for sender and receiver.
- **Skip & Disconnect Lifecycle**: Skip to the next stranger in real time, with automatic room cleanups and partner disconnect alerts.
- **Dark Neumorphic UI**: Custom Soft UI design system featuring soft dual shadows, inset message containers, tactile button press effects, and a pulsing live connection status badge.
- **100% Anonymous & Ephemeral**: Zero account creation or personal data collection. Chat sessions disappear the moment you leave.

---

## Tech Stack

### **Backend**
- **Language**: Python 3.10+
- **Framework**: Flask (Application Factory Pattern with Blueprints)
- **Real-Time Communication**: Flask-SocketIO (WebSockets)

### **Frontend**
- **Structure**: Semantic HTML5 (Multi-page routing with Jinja2 templates)
- **Styling**: Vanilla CSS3 (Custom Dark Neumorphic / Glassmorphic Design System)
- **Logic**: Vanilla JavaScript (ES6+ with Socket.IO Client)

---

## Project Structure

```
gramasabha/
├── app/
│   ├── __init__.py           # Flask Application Factory & SocketIO init
│   ├── events.py             # WebSocket event handlers (queue, rooms, chat, disconnect)
│   ├── routes.py             # HTTP Blueprint routes (/ and /chat)
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css     # Neumorphic design system & typography
│   │   └── js/
│   │       └── main.js       # Client-side WebSocket & UI interaction logic
│   └── templates/
│       ├── home.html         # Landing page with hero section & feature cards
│       └── chat.html         # Real-time chat room interface
├── project phases.txt        # Development roadmap and milestone checklist
├── run.py                    # Server entrypoint
└── README.md                 # Project documentation
```

---

## Getting Started

### 1. Prerequisites
Ensure you have **Python 3.10+** installed on your system.

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/gramasabha.git
cd gramasabha
```

### 3. Install Dependencies
```bash
pip install flask flask-socketio
```

### 4. Run the Development Server
```bash
python run.py
```

The application will start live at:
**`http://127.0.0.1:5000`**

---

## How to Test Locally

1. Open **two separate browser windows** (or one normal window and one Incognito window) at `http://127.0.0.1:5000`.
2. Click **"Start Text Chat"** on both windows to enter the `/chat` room.
3. Click **"Find Stranger"** in both tabs:
   - The queue pairs them instantly into a shared room.
   - The button flips to **"Skip"** and the input field unlocks.
4. Type messages back and forth in real-time.
5. Click **"Skip"** or close a tab to test the disconnection handling and immediate re-queueing.

---



## License
This project is open-source and available under the [MIT License](LICENSE).
