from flask import Flask
from flask_socketio import SocketIO

socketio= SocketIO() #object of socketio class

def create_app():
    app= Flask(__name__) #creating flask application
    app.config['SECRET_KEY']='key1234'



    socketio.init_app(app,cors_allowed_origins="*")# all orgins are allowed
    return app
    