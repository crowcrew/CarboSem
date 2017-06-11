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
    function indexToRGB(index) {
        var hash = ((index + 1) * 400) % 0x00FFFFFF;
        for (var i = 0; i < 3; i++) {
            hash <<= 5;
            hash += (index + 1) * 400;
        }
        var hex = (hash & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();
        return "#" + "000000".substring(0, 6 - hex.length) + hex;
    }

    /*
     * Global Variables (YUI Module Variables)
     */
    var checkboxStates,
        checkboxVals,
        checkboxColors;

    function submitQuery() {
        checkboxStates = [];
        checkboxVals = [];
        checkboxColors = [];
        /*
         * TODO
         * var query = $("#search").find("input[name=search]").val();
         * $.get("/graph?mir=" + encodeURIComponent(query));
         */
    }



    function drawGraph() {

        d3.json("/getJSON", function (error, graph) {
            if (error) {
                alert("Error, no JSON file found!");
                return;
            }

            /*
             * clean up previous svg
             */
            d3.selectAll("svg").remove();
            d3.selectAll("div #addedCheckbox").remove();
            /*
             * configure svg settings
             */
            var width = window.innerWidth,
                height = (90 * window.innerHeight) / 100;
            var force = d3.layout.force()
                .charge(-200).gravity(.1).linkDistance(30).size([width, height]);

            /*
             * checkbox
             */
            if (checkboxStates.length == 0)
                for (var i = 0; i < graph.nodes.length; i++) {
                    if (graph.nodes[i].targets)
                        for (var j = 0; j < graph.nodes[i].targets.length; j++) {
                            var pushState = checkboxVals.indexOf(graph.nodes[i].targets[j].type);
                            if (pushState == -1) {
                                checkboxVals.push(graph.nodes[i].targets[j].type);
                                checkboxColors.push(indexToRGB(checkboxStates.length));
                                checkboxStates.push(true);
                            }
                        }
                }

            var addedCheckbox = d3.select(".form-group").append("div").attr("class", "checkbox").attr("id", "addedCheckbox");
            var addedLabels = [];
            var addedBoxes = [];
            for (var i = 0; i < checkboxStates.length; i++) {
                addedLabels[i] = addedCheckbox.append("label").attr("for", checkboxVals[i]).text(checkboxVals[i])
                    .style({
                        "color": checkboxColors[i]
                    });
                addedBoxes[i] = addedCheckbox.append("input")
                    .attr("type", "checkbox")
                    .attr("name", "function")
                    .attr("value", checkboxVals[i])
                    .attr("id", checkboxVals[i])
                    .style({
                        opacity: 0
                    })
                    .property("checked", checkboxStates[i]);
            }
            addedCheckbox.on("change", function () {
                for (var i = 0; i < checkboxStates.length; i++) {
                    checkboxStates[i] = addedBoxes[i].property("checked");
                    checkboxColors[i] = checkboxStates[i] ? indexToRGB(i) : "#FFFFFF";
                }
                drawGraph();
            });

            /*
             * create new svg
             */
            var graphArea = d3.select("#graph").append("svg")
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 800 600")
                .attr("width", width).attr("height", height)
                .attr("pointer-events", "all");

            var nodes = new Array();
            var links = new Array();
            for (var i = 0, len = graph.nodes.length; i < len; i++) {
                if (graph.nodes[i].targets) {
                    nodes.push({
                        "label": graph.nodes[i].label,
                        "title": graph.nodes[i].title
                    });
                    var source = nodes.length - 1;
                    for (var j = 0, sublen = graph.nodes[i].targets.length; j < sublen; j++) {
                        var nodeValidity = 0;
                        var checkboxIndex = checkboxVals.findIndex(x => x == graph.nodes[i].targets[j].type);
                        var checkboxIndexValidity = checkboxStates[checkboxIndex];
                        if (!checkboxIndexValidity)
                            continue;
                        else
                            nodeValidity++;
                        nodeIndex = nodes.findIndex(x => x.title == graph.nodes[graph.nodes[i].targets[j].target].title);
                        var target;
                        if (nodeIndex > -1) {
                            target = nodeIndex;
                        } else {
                            nodes.push({
                                "label": graph.nodes[graph.nodes[i].targets[j].target].label,
                                "title": graph.nodes[graph.nodes[i].targets[j].target].title
                            });
                            target = nodes.length - 1;
                        }
                        links.push({
                            "source": source,
                            "target": target,
                            "type": graph.nodes[i].targets[j].type
                        });
                    }
                    if (nodeValidity == 0)
                        nodes.pop();
                }
            }

            var localGraph = {
                "nodes": nodes,
                "links": links
            };

            force.nodes(localGraph.nodes).links(localGraph.links).start();


            var link = graphArea.selectAll("link")
                .data(localGraph.links);
            link.enter().append("line")
                .attr("class", "link")
                .style({
                    "stroke": function (d) {
                        return checkboxColors[checkboxVals.findIndex(x => x == d.type)]
                    },
                    "stroke-width": 3
                });
            link.exit().remove();

            var node = graphArea.selectAll("node")
                .data(localGraph.nodes);
            node.enter().append("circle")
                .attr("class", function (d) {
                    return "node " + d.label
                })
                .attr("r", 10)
                .attr("fill", function (d) {
                    if (d.label == "microRNA") return "#112e51";
                    else if (d.label == "DNA") return "#e31c3d";
                    else if (d.label == "pathway") return "#0C9920";
                    else return "#fdb81e";
                })
                .style({
                    "stroke": "floralwhite",
                    "stroke-width": 2
                })
                .call(force.drag);
            node.exit().remove();

            var nodeText = graphArea.selectAll("text")
                .data(localGraph.nodes);
            nodeText.enter().append("text")
                .attr("font-family", "monospace")
                .attr("font-size", "10px")
                .attr("fill", "black")
                .text(function (d) {
                    return d.title
                });
            nodeText.exit().remove();

            force.on("tick", function () {
                link.attr("x1", function (d) {
                        return d.source.x;
                    })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    });

                node.attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    });

                nodeText.attr("x", function (d) {
                        return d.x + 10;
                    })
                    .attr("y", function (d) {
                        return d.y + 10;
                    });
            });
        });
        return false;
    }
    $("#search").submit(submitQuery);
    $("#search").submit(drawGraph);
    $(window).resize(drawGraph);
})
