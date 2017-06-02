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
            y = 7,
            checked = true,
            checkboxText = "",
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
                if (clickEvent)
                    clickEvent();
            });
        }
        checkBox.checkboxText = function (val) {
            checkboxText = val;
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
        checkBox.clickEvent = function (val) {
            clickEvent = val;
            return checkBox;
        }
        return checkBox;
    }

    /*
     * Global Variables
     */
    var checkboxVals = ["rna22", "pictar"];
    var checkboxStates = [true, true];

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

        var checkboxArea = d3.select("#graph").append("svg")
            .attr("width", width).attr("height", 30);

        var rna22Checkbox = new drawCheckBox();
        rna22Checkbox.x(5).checkboxText("RNA22").checked(checkboxStates[0]);
        var rna22Update = function () {
            var rna22Checked = rna22Checkbox.checked();
            if (rna22Checked) {
                checkboxVals.push("rna22");
                checkboxStates[0] = !checkboxStates[0];
                drawGraph();
            } else {
                var spliceVal = checkboxVals.indexOf("rna22");
                if (spliceVal > -1)
                    checkboxVals.splice(spliceVal, 1);
                checkboxStates[0] = !checkboxStates[0];
                drawGraph();
            }
        };
        rna22Checkbox.clickEvent(rna22Update);

        var pictarCheckbox = new drawCheckBox();
        pictarCheckbox.x(75).checkboxText("PicTar").checked(checkboxStates[1]);
        var pictarUpdate = function () {
            var pictarChecked = pictarCheckbox.checked();
            if (pictarChecked) {
                checkboxVals.push("pictar");
                checkboxStates[1] = !checkboxStates[1];
                d3.select("svg").remove();
                drawGraph();
            } else {
                var spliceVal = checkboxVals.indexOf("pictar");
                if (spliceVal > -1)
                    checkboxVals.splice(spliceVal, 1);
                checkboxStates[1] = !checkboxStates[1];
                d3.select("svg").remove();
                drawGraph();
            }
        };
        pictarCheckbox.clickEvent(pictarUpdate);

        checkboxArea.call(rna22Checkbox);
        checkboxArea.call(pictarCheckbox);


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
                .style({
                    "stroke": "#2e8540",
                    "stroke-width": 1
                });
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
                .style({
                    "stroke": "#2e8540",
                    "stroke-width": 2
                })
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
