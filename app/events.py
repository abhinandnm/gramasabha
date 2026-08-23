from flask import request
from flask_socketio import join_room,leave_room

from . import socketio

waiting_users=[] #list of waiting users
user_rooms={} # to store which user is in which room

@socketio.on("connect")
def connect():
    print(f"Stranger connected {request.sid}")

@socketio.on("disconnect")
def disconnect():
    print(f"stranger disconnected {request.sid}")
    if request.sid in waiting_users:
        waiting_users.remove(request.sid)
        #notifying the opp guy about disconnectoin
    if request.sid in user_rooms:
        room = user_rooms.pop(request.sid, None)
        if room:
            socketio.emit("stranger_disconnected", to=room, include_self=False)
            leave_room(room)
    
@socketio.on("join_queue")
def join_queue():
    print(f"stranger {request.sid} wants to join the queue")
    if request.sid not in waiting_users:
        waiting_users.append(request.sid)
    
    if len(waiting_users)==2:
        print("Match found!")
        user1=waiting_users.pop(0)
        user2=waiting_users.pop(0)
        print(f"user {user1} and user {user2} are matched")
        room_name=f"room_{user1}_{user2}" #uniqueroomnumber making
        join_room(room_name,sid=user1)#joining users in tht room
        join_room(room_name,sid=user2)
        user_rooms[user1] = room_name
        user_rooms[user2] = room_name
        print(f"room {room_name} created for {user1} and {user2}")
        socketio.emit("match found", {"room": room_name, "initiator": True}, to=user1)
        socketio.emit("match found",{"room":room_name,"initiator":False},to=user2)
        print(f"Room:{room_name}created for {user1}(caller)and{user2}(reciever)")
@socketio.on("send_message")
def handle_message(data):
    room = data.get("room")
    message = data.get("message")
    print(f"Message received in {room}: {message}")
    
    socketio.emit("receive_message", {"message": message}, to=room, include_self=False)

@socketio.on("leave_chat")
def handle_leave(data):
    room = data.get("room")
    if room:
        socketio.emit("stranger_disconnected", to=room, include_self=False)
        leave_room(room)
        user_rooms.pop(request.sid, None)
        
        