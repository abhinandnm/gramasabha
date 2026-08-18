from flask import request
from flask_socketio import join_room

from . import socketio

waiting_users=[] #list of waiting users

@socketio.on("connect")
def connect():
    print(f"Stranger connected {request.sid}")

@socketio.on("disconnect")
def disconnect():
    print(f"stranger disconnected {request.sid}")
    
@socketio.on("join_queue")
def join_queue():
    print(f"stranger {request.sid} wants to join the queue")
    waiting_users.append(request.sid)
    if len(waiting_users)==2:
        print("Match found!")
        user1=waiting_users.pop(0)
        user2=waiting_users.pop(0)
        print(f"user {user1} and user {user2} are matched")
        room_name=f"room_{user1}_{user2}" #uniqueroomnumber making
        join_room(room_name,sid=user1)#joining users in tht room
        join_room(room_name,sid=user2)
        socketio.emit("match found",room=room_name)#private message for tht room only
        print(f"room {room_name} created for {user1} and {user2}")
        