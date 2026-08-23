from flask import Blueprint,render_template

main_routes = Blueprint('main',__name__) #blueprint named main

@main_routes.route('/') #decorator
def home():
    return render_template('home.html')
@main_routes.route('/chat')
def chat():
    return render_template('chat.html')





