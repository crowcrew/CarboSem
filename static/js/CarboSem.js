$(function() {
            function drawGraph() {
                var width = window.innerWidth,
                    height = window.innerHeight;
                var force = d3.layout.force()
                    .charge(-200).linkDistance(30).size([width, height]);
                d3.select("svg").remove();
                var svg = d3.select("#graph").append("svg")
                    .attr("width", width).attr("height", height)
                    .attr("pointer-events", "all");
                var query = $("#search").find("input[name=search]").val();
                d3.json("/graph?q=" + encodeURIComponent(query), function(error, graph) {
                    if (error) return;
                    force.nodes(graph.nodes).links(graph.links).start();

                    var link = svg.selectAll(".link")
                        .data(graph.links);
                    link.enter().append("line")
                        .attr("class", "link");
                    link.exit().remove();

                    var node = svg.selectAll(".node")
                        .data(graph.nodes);
                    node.enter().append("circle")
                        .attr("class", function(d) {
                            return "node " + d.label
                        })
                        .attr("r", 10)
                        .call(force.drag)
                        .append("title")
                        .text(function(d) {
                            return d.title;
                        })
                    node.exit().remove();

                    force.on("tick", function() {
                        link.attr("x1", function(d) {
                                return d.source.x;
                            })
                            .attr("y1", function(d) {
                                return d.source.y;
                            })
                            .attr("x2", function(d) {
                                return d.target.x;
                            })
                            .attr("y2", function(d) {
                                return d.target.y;
                            });

                        node.attr("cx", function(d) {
                                return d.x;
                            })
                            .attr("cy", function(d) {
                                return d.y;
                            });
                    });
                });
                return false;
            }
            $("#search").submit(drawGraph);
        })

