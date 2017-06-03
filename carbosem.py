import os
import json
from bottle import route, template, redirect, run, error, request, response, static_file

@route('/')
def get_index():
    return template('index')

@route('/static/css/<filename>')
def css(filename):
    return static_file(filename, root='static/css')

@route('/static/js/<filename>')
def js(filename):
    return static_file(filename, root='static/js')

@route('/static/json/<filename>')
def json(filename):
    return static_file(filename, root='static/json')

@route('/getJSON')
def getJSON():
    return static_file('data.json', root='static/json')



if os.environ.get('APP_LOCATION') == 'heroku':
    run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
else:
    run(host='localhost', port=8080, debug=True)
