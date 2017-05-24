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
    mir = request.query["mir"]
    func = []
    func = request.query["func"].split(",")
    print func
    print mir
    query = "MATCH (a:DNA)<-[function:"+func[0]
    if(len(func)>1):
        for val in func[1:]:
            query+="|"
            query+=val
    query+="]-(m:microRNA {title:\""+mir+"\"}) "
    query+=" RETURN m.title as microRNA, collect(a.name) as cast LIMIT 100"
    print query
    results = graph.run(query)
    print results
    nodes = []
    rels = []
    i = 0
    for mir, dna in results:
        nodes.append({"title": mir, "label": "movie"})
        target = i
        i += 1
        for name in dna:
            actor = {"title": name, "label": "actor"}
            try:
                source = nodes.index(actor)
            except ValueError:
                nodes.append(actor)
                source = i
                i += 1
            rels.append({"source": source, "target": target})
    with open('static/json/data.json', 'w') as outfile:
        json.dump({"nodes": nodes, "links": rels}, outfile)


if __name__ == "__main__":
    run(port=8080)
