/*
 * Copyright 2017 Aly Shmahell
 */
$(function () {
    /*
     * TODO
     * var query = $("#search").find("input[name=search]").val();
     * $.get("/graph?mir=" + encodeURIComponent(query));
     */

    function drawCheckBox() {

        var side = 20,
            x = 5,
            y = 5,
            checked = true,
            clickEvent;

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
                });

            var mark = g.append("circle")
                .attr("cx", x + side / 2)
                .attr("cy", y + side / 2)
                .attr("r", 5)
                .style({
                    "fill": (checked) ? "#000" : "#FFF",
                    "stroke-width": 2
                });

            g.on("click", function () {
                checked = !checked;
                mark.style("fill", (checked) ? "#000" : "#FFF");
                if (clickEvent)
                    clickEvent();
            });
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
        checkBox.clickEvent = function (val) {
            clickEvent = val;
            return checkBox;
        }
        return checkBox;
    }

    /*
     * Global Variables
     */
    var checkboxVals = ["pictar", "rna22"];
    var singleVal = true;

    function drawGraph() {
        /*
         * clean up previous svg
         */
        d3.selectAll("svg").remove();
        /*
         * configure svg settings
         */
        var width = window.innerWidth,
            height = (80 * window.innerHeight) / 100;

        var pic = d3.select("#graph").append("svg")
            .attr("width", width).attr("height", 30);
        var checkBox1 = new drawCheckBox();
        checkBox1.checked(singleVal);
        var update = function () {
            var checked1 = checkBox1.checked();
            if (checked1) {
                checkboxVals.push("rna22");
                singleVal = !singleVal;
                d3.select("svg").remove();
                drawGraph();
            } else {
                var spliceVal = checkboxVals.indexOf("rna22");
                if (spliceVal > -1)
                    checkboxVals.splice(spliceVal, 1);
                singleVal = !singleVal;
                d3.select("svg").remove();
                drawGraph();
            }
            txt.text(checked1);
        };
        checkBox1.clickEvent(update);
        pic.call(checkBox1);


        var force = d3.layout.force()
            .charge(-200).linkDistance(30).size([width, height]);
        /*
         * create new svg
         */
        var svg = d3.select("#graph").append("svg")
            .attr("width", width).attr("height", height)
            .attr("pointer-events", "all");

        d3.json("/getJSON", function (error, graph) {
            if (error) {
                alert("Error, no JSON file found!");
                return;
            }

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
                        var checkboxIncrement = 0;
                        var checkboxIndex = checkboxVals.findIndex(x => x == graph.nodes[i].targets[j].type);
                        if (checkboxIndex < 0)
                            continue;
                        else
                            checkboxIncrement++;
                        nodeIndex = nodes.findIndex(x => x.title == graph.nodes[graph.nodes[i].targets[j].target].title);
                        var target;
                        if (nodeIndex > 0) {
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
                    if (checkboxIncrement == 0)
                        nodes.pop();
                }
            }

            var localGraph = {
                "nodes": nodes,
                "links": links
            };

            force.nodes(localGraph.nodes).links(localGraph.links).start();


            var link = svg.selectAll("link")
                .data(localGraph.links);
            link.enter().append("line")
                .attr("class", "link")
                .style("stroke", "#2e8540")
                .style("stroke-width", 1);
            link.exit().remove();

            var node = svg.selectAll("node")
                .data(localGraph.nodes);
            node.enter().append("circle")
                .attr("class", function (d) {
                    return "node " + d.label
                })
                .attr("r", 10)
                .attr("fill", function (d) {
                    if (d.label == "microRNA") return "#112e51";
                    else return "#e31c3d";
                })
                .style("stroke", "#2e8540")
                .style("stroke-width", 2)
                .call(force.drag);
            node.exit().remove();

            var nodeText = svg.selectAll("text")
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
    $("#search").submit(drawGraph);
})
