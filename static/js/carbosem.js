/*
MIT License

Copyright (c) 2017 Aly Shmahell

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

$(function () {

    /*
     * Global Variables (YUI Module Variables)
     */
    var checkbox = {
            "states": [],
            "vals": [],
            "colors": []
        },
        ledger = {
            "elements": [],
            "colors": []
        };

    /*
     * defining color arrays
     */
    var linkColor = d3.scaleOrdinal(d3.schemeCategory10);
    var nodeColor = d3.scaleOrdinal(d3.schemeCategory20);

    function submitQuery() {
        /*
         * resetting the checkbox area
         */
        checkbox["states"] = [];
        checkbox["vals"] = [];
        checkbox["colors"] = [];
        /*
         * TODO
         * var query = $("#search").find("input[name=search]").val();
         * $.get("/graph?mir=" + encodeURIComponent(query));
         */
    }



    function drawGraph() {
        /*
         * resetting the ledger area
         */
        ledger["elements"] = [];
        ledger["colors"] = [];

        d3.json("/getJSON", function (error, graph) {
            if (error) {
                alert("Error, no JSON file found!");
                return;
            }

            /*
             * cleaning up previously rendered checkboxes and ledger elements
             */
            d3.selectAll("div #addedCheckbox").remove();
            d3.selectAll("div #addedLedger").remove();

            /*
             * initiating checkboxes after submitting a new query
             */
            if (checkbox["states"].length == 0)
                for (var i = 0; i < graph.nodes.length; i++) {
                    if (graph.nodes[i].targets)
                        for (var j = 0; j < graph.nodes[i].targets.length; j++) {
                            var pushState = checkbox["vals"].indexOf(graph.nodes[i].targets[j].type);
                            if (pushState == -1) {
                                checkbox["vals"].push(graph.nodes[i].targets[j].type);
                                checkbox["states"].push(true);
                                checkbox["colors"].push(linkColor(checkbox["states"].length - 1));
                            }
                        }
                }
            /*
             * rendering checkboxes as per their current states
             */
            var addedCheckbox = d3.select(".form-group").append("div").attr("class", "checkbox").attr("id", "addedCheckbox");
            var addedLabels = [];
            var addedBoxes = [];
            var beginCheckbox = addedCheckbox.append("label").text("{")
                .style("color", "floralwhite").style("padding-right", "10px");
            for (var i = 0; i < checkbox["states"].length; i++) {
                addedLabels[i] = addedCheckbox.append("label").attr("for", checkbox["vals"][i]).text(checkbox["vals"][i])
                    .style("color", checkbox["colors"][i]);
                addedBoxes[i] = addedCheckbox.append("input")
                    .attr("type", "checkbox")
                    .attr("name", "function")
                    .attr("value", checkbox["vals"][i])
                    .attr("id", checkbox["vals"][i])
                    .style("opacity", 0)
                    .property("checked", checkbox["states"][i]);
            }
            var endCheckbox = addedCheckbox.append("label").text("}")
                .style("color", "floralwhite");
            addedCheckbox.on("change", function () {
                for (var i = 0; i < checkbox["states"].length; i++) {
                    checkbox["states"][i] = addedBoxes[i].property("checked");
                    checkbox["colors"][i] = checkbox["states"][i] ? linkColor(i) : "#FFFFFF";
                }
                drawGraph();
                return;
            });
            /*
             * creating local arrays according to checkbox states
             */
            var nodes = new Array();
            var links = new Array();
            for (var i = 0, len = graph.nodes.length; i < len; i++) {
                if (graph.nodes[i].targets) {
                    nodes.push({
                        "label": graph.nodes[i].label,
                        "title": graph.nodes[i].title
                    });
                    var ledgerInsertibility = false;
                    var ledgerIndex = ledger["elements"].findIndex(x => x == graph.nodes[i].label);
                    if (ledgerIndex < 0) {
                        ledger["elements"].push(graph.nodes[i].label);
                        ledger["colors"].push(nodeColor(ledger["elements"].length - 1));
                        ledgerInsertibility = true;
                    }
                    var source = nodes.length - 1;
                    var nodeValidity = 0;
                    for (var j = 0; j < graph.nodes[i].targets.length; j++) {

                        var checkboxIndex = checkbox["vals"].findIndex(x => x == graph.nodes[i].targets[j].type);
                        var checkboxIndexValidity = checkbox["states"][checkboxIndex];
                        if (!checkboxIndexValidity)
                            continue;
                        else
                            nodeValidity++;
                        var nodeIndex = nodes.findIndex(x => x.title == graph.nodes[graph.nodes[i].targets[j].target].title);
                        var target;
                        if (nodeIndex > -1) {
                            target = nodeIndex;
                        } else {
                            nodes.push({
                                "label": graph.nodes[graph.nodes[i].targets[j].target].label,
                                "title": graph.nodes[graph.nodes[i].targets[j].target].title
                            });
                            target = nodes.length - 1;
                            var ledgerIndex = ledger["elements"].findIndex(x => x == graph.nodes[graph.nodes[i].targets[j].target].label);
                            if (ledgerIndex < 0) {
                                ledger["elements"].push(graph.nodes[graph.nodes[i].targets[j].target].label);
                                ledger["colors"].push(nodeColor(ledger["elements"].length - 1));
                            }
                        }
                        links.push({
                            "source": source,
                            "target": target,
                            "type": graph.nodes[i].targets[j].type
                        });
                    }
                    if (nodeValidity == 0) {
                        nodes.pop();
                        if (ledgerInsertibility) {
                            ledger["elements"].pop();
                            ledger["colors"].pop();
                        }
                    }
                }
            }
            /*
             * pushing arrays to local graph
             */
            var localGraph = {
                "nodes": nodes,
                "links": links
            };

            /*
             * rendering ledger elements as per their current states
             */
            if (ledger["elements"].length > 0) {
                var addedLedger = d3.select(".form-group").append("div").attr("class", "checkbox").attr("id", "addedLedger").style(
                    "display", "inline");
                var beginledger = addedLedger.append("label").text("{")
                    .style("color", "floralwhite")
                    .style("padding-left", "10px");
                var addedledger = [];
                for (var i = 0; i < ledger["elements"].length; i++) {
                    addedledger[i] = addedLedger.append("label").text(ledger["elements"][i] + (i < ledger["elements"].length - 1 ? ", " : "")).style("color", ledger["colors"][i]);
                }
                var endLedger = addedLedger.append("label").text("}")
                    .style("color", "floralwhite");
            }

            /*
             * configure canvas parameters
             */
            var width = window.innerWidth,
                height = (90 * window.innerHeight) / 100;

            var canvas = document.querySelector("canvas"),
                context = canvas.getContext("2d");
            canvas.width = width;
            canvas.height = height;

            /*
             * configure simulation settings
             */
            var simulation = d3.forceSimulation()
                .force("link", d3.forceLink().distance(10).strength(1))
                .force("charge", d3.forceManyBody())
                .force("center", d3.forceCenter(width / 2, height / 2))
                .force('x', d3.forceX(width / 2).strength(width > height ? 0.1 : 0.25))
                .force('y', d3.forceY(height / 2).strength(width > height ? 0.25 : 0.1));


            /*
             * initiating the simulation renderer
             */
            simulation
                .nodes(localGraph.nodes)
                .on("tick", function () {
                    context.clearRect(0, 0, width, height);
                    localGraph.links.forEach(function (d) {
                        context.beginPath();
                        context.strokeStyle = checkbox["colors"][checkbox["vals"].findIndex(x => x == d.type)];
                        context.moveTo(d.source.x, d.source.y);
                        context.lineTo(d.target.x, d.target.y);
                        context.stroke();
                    });
                    localGraph.nodes.forEach(function (d) {
                        context.beginPath();
                        context.fillStyle = ledger["colors"][ledger["elements"].findIndex(x => x == d.label)];
                        d.x = Math.max(5, Math.min(width - 5, d.x));
                        d.y = Math.max(5, Math.min(height - 5, d.y));
                        context.moveTo(d.x, d.y);
                        context.arc(d.x, d.y, 5, 0, 2 * Math.PI);
                        context.fillText(d.renderedText != null ? d.renderedText : "", d.x + 5, d.y + 5);
                        context.fill();
                    });
                });

            simulation.force("link")
                .links(localGraph.links);

            /*
             * changing background parameters of elements as per mouse drag
             */
            d3.select(canvas)
                .call(d3.drag()
                    .container(canvas)
                    .subject(function () {
                        return simulation.find(d3.event.x, d3.event.y);
                    })
                    .on("start", function () {
                        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                        d3.event.subject.fx = d3.event.subject.x;
                        d3.event.subject.fy = d3.event.subject.y;
                        if (d3.event.subject.renderedText)
                            d3.event.subject.renderedText = null;
                        else
                            d3.event.subject.renderedText = d3.event.subject.title;
                    })
                    .on("drag", function () {
                        d3.event.subject.fx = Math.max(5, Math.min(width - 5, d3.event.x));
                        d3.event.subject.fy = Math.max(5, Math.min(height - 5, d3.event.y));
                    })
                    .on("end", function () {
                        if (!d3.event.active) simulation.alphaTarget(0);
                        d3.event.subject.fx = null;
                        d3.event.subject.fy = null;
                    }));
        });

        return false;
    }
    /*
     * calling functions according to DOM bindings
     */
    $("#search").submit(submitQuery);
    $("#search").submit(drawGraph);
    $(window).resize(drawGraph);
    return;
})
