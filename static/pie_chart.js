function PieChart(svg_elem, data) {
    this.svg_elem = svg_elem;
    this.width = $(this.svg_elem).width();
    this.height = $(this.svg_elem).height();

    var svg = d3.select(this.svg_elem);

    
    this.render_pie = function(awareness_data) {

            console.log("render")
            console.log(awareness_data)
                var w = this.width;
                var h = this.height;

                //var dataset = [ 5, 10, 50, 6];
                var dataset = [];
                var labels = ["Don’t Know", "Not at all common", "Not very common", "Fairly common", "Very common"];
                for (var lab in labels) {
                    dataset.push(awareness_data[labels[lab]]);
                };
                console.log("nn")
                console.log(dataset)

                var outerRadius = w / 4;
                var innerRadius = w / 6;
                var arc = d3.arc()
                            .innerRadius(innerRadius)
                            .outerRadius(outerRadius);
                
                var pie = d3.pie();
                
                //Easy colors accessible via a 10-step ordinal scale
                //var color = d3.scaleOrdinal(d3.schemeCategory10);
                  var colors = [];
                  colors[0] = d3.color("white");
                  colors[1] = d3.color("lightblue");
                  colors[2] = d3.color("lightgreen");
                  colors[3] = d3.color("lightpink");
                  colors[4] = d3.color("lightyellow");


                //Create SVG element
                var svg = d3.select(this.svg_elem);
                
                //Set up groups
                var arcs = svg.selectAll("g.arc")
                              .data(pie(dataset))
                              .enter()
                              .append("g")
                              .attr("class", "arc")
                              
                              .attr("transform", "translate(" + 2*outerRadius + "," + 2*outerRadius + ")");
                
                //Draw arc paths
                arcs.append("path")
                    .attr("fill", function(d, i) {
                        return colors[i];
                    })
                    .attr("data-html", "true")
                   .attr("data-toggle", function(d, j) {

                      $(this).tooltip({'title': '<b>'+labels[j]+'</b> '
                                      });
                      return "tooltip";
                  })
                    .attr("d", arc)
                      .style('stroke-width', 2)
                      .style('stroke-linejoin','round')
                      .style('stroke', "black");
                
                //Labels
                arcs.append("text")
                    .attr("transform", function(d) {
                        return "translate(" + arc.centroid(d) + ")";
                    })
                    .attr("text-anchor", "middle")
                    .text(function(d) {
                        return d.value + "%";
                    });

          totalValue = 10;

          arcs.append("text")
              .attr("text-anchor", "middle")
              .style('font-size', '15px')
              .attr('y', 20)
              .style("fill",'black')
              .text("Awareness about violence")
              .on("click",function() {
                          console.log("Hello.");
              });
        }
}

