from flask import Blueprint

main_routes = Blueprint('main',__name__) #blueprint named main

@main_routes.route('/')
def index():
    return "<h1>hello from gramasabha!<h1>"

    


