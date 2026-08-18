from flask import Flask
from flask_socketio import SocketIO


socketio= SocketIO() #object of socketio class

def create_app():
    
    app= Flask(__name__) #creating flask application
    app.config['SECRET_KEY']='key1234'
    from .routes import main_routes
    app.register_blueprint(main_routes)
    from .import events
    socketio.init_app(app,cors_allowed_origins="*")# all orgins are allowed
    print("live at: http://127.0.0.1:5000")
    return app
    