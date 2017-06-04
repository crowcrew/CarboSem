/*
 * Copyright 2017 Aly Shmahell
 */
$(function () {

    /*
     * Global Variables (YUI Module Variables)
     */
    var checkboxVals,
        checkboxStates,
        checkboxValsAll;

    function submitQuery() {
        checkboxVals = [];
        checkboxStates = [];
        checkboxValsAll = [];
        /*
         * TODO
         * var query = $("#search").find("input[name=search]").val();
         * $.get("/graph?mir=" + encodeURIComponent(query));
         */
    }

    function drawCheckBox() {

        var side = 20,
            x = 5,
            y = 7,
            checkboxVal,
            checked = true,
            checkboxText = "",
            checkboxNumber;

        function checkBox(parent) {

            var g = parent.append("g"),
                box = g.append("rect")
                .attr("width", side)
                .attr("height", side)
                .attr("x", x)
                .attr("y", y)
                .attr("rx", 6)
                .attr("ry", 6)
                .style({
                    "fill-opacity": 0,
                    "stroke-width": 5,
                    "stroke": "black"
                }),
                mark = g.append("circle")
                .attr("cx", x + side / 2)
                .attr("cy", y + side / 2)
                .attr("r", 5)
                .style({
                    "fill": (checked) ? "#000" : "#FFF",
                    "stroke-width": 2
                }),
                checkboxTextArea = g.append("text")
                .attr("x", x + side + 5)
                .attr("y", y + side / 2 + 5)
                .attr("font-family", "monospace")
                .attr("font-size", "10px")
                .attr("fill", "black")
                .text(checkboxText);

            g.on("click", function () {
                checked = !checked;
                mark.style("fill", (checked) ? "#000" : "#FFF");
                if (checked) {
                    checkboxVals.push(checkboxVal);
                    checkboxStates[checkboxNumber] = !checkboxStates[checkboxNumber];
                    drawGraph();
                } else {
                    var spliceVal = checkboxVals.indexOf(checkboxVal);
                    if (spliceVal > -1)
                        checkboxVals.splice(spliceVal, 1);
                    checkboxStates[checkboxNumber] = !checkboxStates[checkboxNumber];
                    drawGraph();
                }
            });
        }
        checkBox.checkboxText = function (val) {
            checkboxText = val;
            return checkBox;
        }
        checkBox.checkboxVal = function (val) {
            checkboxVal = val;
            return checkBox;
        }
        checkBox.checkboxNumber = function (val) {
            checkboxNumber = val;
            return checkBox;
        }
        checkBox.x = function (val) {
            x = val;
            return checkBox;
        }
        checkBox.y = function (val) {
            y = val;
            return checkBox;
        }
        checkBox.checked = function (val) {
            if (val === undefined) {
                return checked;
            } else {
                checked = val;
                return checkBox;
            }
        }
        return checkBox;
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
            /*
             * configure svg settings
             */
            var width = window.innerWidth,
                height = (80 * window.innerHeight) / 100;

            var checkboxArea = d3.select("#graph").append("svg")
                .attr("width", width).attr("height", 30);

            if (checkboxStates.length == 0)
                for (var i = 0; i < graph.nodes.length; i++) {
                    if (graph.nodes[i].targets)
                        for (var j = 0; j < graph.nodes[i].targets.length; j++) {
                            var pushState = checkboxValsAll.indexOf(graph.nodes[i].targets[j].type);
                            if (pushState == -1) {
                                checkboxValsAll.push(graph.nodes[i].targets[j].type);
                                checkboxVals.push(graph.nodes[i].targets[j].type);
                                checkboxStates.push(true);
                            }
                        }
                }

            var checkboxArray = new Array();
            for (var i = 0; i < checkboxStates.length; i++) {
                checkboxArray.push(new drawCheckBox());
                checkboxArray[i].x((width - (35 * checkboxStates.length)) / 2 + i * 70).checkboxVal(checkboxValsAll[i]).checkboxText(checkboxValsAll[i]).checkboxNumber(i).checked(checkboxStates[i]);
                checkboxArea.call(checkboxArray[i]);
            }

            var force = d3.layout.force()
                .charge(-200).linkDistance(30).size([width, height]);
            /*
             * create new svg
             */
            var graphArea = d3.select("#graph").append("svg")
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
                        if (checkboxIndex < 0)
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
                            "target": target
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
                    "stroke": "#2e8540",
                    "stroke-width": 1
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
                    else return "#fdb81e";
                })
                .style({
                    "stroke": "#2e8540",
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
})
