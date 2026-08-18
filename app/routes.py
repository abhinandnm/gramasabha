from flask import Blueprint,render_template

main_routes = Blueprint('main',__name__) #blueprint named main

@main_routes.route('/') #decorator
def index():
    return render_template('index.html')




