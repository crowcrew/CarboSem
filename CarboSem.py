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


@get("/graph")
def get_graph():
    q = request.query["q"]
    print q
    results = graph.run(
        "MATCH (a:DNA)<-[:rna22]-(m:microRNA) WHERE m.title =~ {title}"
        "RETURN m.title as microRNA, collect(a.name) as cast "
        "LIMIT {limit}",{"title": "(?i).*" + q + ".*", "limit": 100})
    print results
    nodes = []
    rels = []
    i = 0
    for movie, cast in results:
        nodes.append({"title": movie, "label": "movie"})
        target = i
        i += 1
        for name in cast:
            actor = {"title": name, "label": "actor"}
            try:
                source = nodes.index(actor)
            except ValueError:
                nodes.append(actor)
                source = i
                i += 1
            rels.append({"source": source, "target": target})
    return {"nodes": nodes, "links": rels}


if __name__ == "__main__":
    run(port=8080)
