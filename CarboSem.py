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
    func = request.query["func"]
    print func
    print mir
    results = graph.run(
        "MATCH (a:DNA)<-[function:rna22|pictar]-(m:microRNA) WHERE m.title =~ {title} AND type(function) =~ {func} "
        "RETURN m.title as microRNA, collect(a.name) as cast "
        "LIMIT {limit}",{"func": "(?i).*" + func + ".*","title": "(?i).*" + mir + ".*", "limit": 100})
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
