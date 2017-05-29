#!/usr/bin/env python


import json

from bottle import get, run, request, response, static_file
from py2neo import Graph

graph = Graph(password = "toor", bolt=True)


@get("/")
def get_index():
    return static_file("html/index.html", root="static")

@get("/static/css/<filepath:re:.*\.css>")
def css(filepath):
    return static_file(filepath, root="static/css")

@get("/static/js/<filepath:re:.*\.js>")
def js(filepath):
    return static_file(filepath, root="static/js")

@get("/static/json/<filepath:re:.*\.json>")
def js(filepath):
    return static_file(filepath, root="static/json")

@get("/getJSON")
def getJSON():
    with open('static/json/data.json') as data_file:    
        data = json.load(data_file)
    return data

@get("/graph")
def get_graph():
    # TODO
    return

if __name__ == "__main__":
    run(port=8080)
