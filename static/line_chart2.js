function LineChart2(svg_elem, full_data) {
    this.svg_elem = svg_elem;
    this.width = $(this.svg_elem).width();
    this.height = $(this.svg_elem).height();
    
    this.domain_color_map = {
        "Overall":"#17a2b8",
        "Work":"#007bff",
        "Money":"#28a745",
        "Knowledge":"red",
        "Time":"#ffc107",
        "Power":"#e83e8c",
        "Health":"#6610f2"
    };

    var margin = 0.1*this.height;
    var marginX = 0.02*this.width;

    this.full_data = full_data;

    var num_years = 4;

    var xScale = d3.scaleLinear()
                    .domain([0, 4])
                    .rangeRound([0, this.width]);
                    //.paddingInner(0.05);

                    //records.map(function(d) {return d.key;})

    var yScale = d3.scaleLinear()
                    .domain([0, 100])
                    .range([margin, this.height]);

    this.render_chart = function(country, data) {

        var curr_obj = this;
        var width = curr_obj.width;
        var height = curr_obj.height;

        console.log(data)

        var col_name_mapper = {};
        col_name_mapper['EU-28'] = {column: 'eu_output'};
        col_name_mapper[country] = {column: 'country_output'};
          

        // The number of datapoints
        var n = 4;

        // 5. X scale will use the index of our data
        /*var xScale = d3.scaleLinear()
            .domain([0, n-1]) // input
            .range([0, width]); // output

        // 6. Y scale will use the randomly generate number 
        var yScale = d3.scaleLinear()
            .domain([0, 1]) // input 
            .range([height, 0]); // output */

        // 7. d3's line generator
        var line = d3.line()
            .x(function(d, i) { return marginX + xScale(i); }) // set the x values for the line generator
            .y(function(d) { return curr_obj.height - (yScale(d.y)); }) // set the y values for the line generator 
            .curve(d3.curveMonotoneX) // apply smoothing to the line

        // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number

        var dataset = [10, 20, 30, 20].map(function(d) {return {"y":d}});
        var dataset2 = [100, 60, 20, 10].map(function(d) {return {"y":d}});

        var svg = d3.select(curr_obj.svg_elem);

        // 3. Call the x axis in a group tag

        var xAxis = d3.axisBottom().scale(xScale)
                                   .tickValues(d3.range(num_years));
                                   /*.tickFormat(function(d, i) {
                                    return records[i]["key"];
                                   });*/

        var yAxis = d3.axisLeft().scale(yScale)
                                 .ticks(10)
                                 .tickFormat(function(d, i){
                                    return (10 - i)*10;
                                 });

        svg.append("g")
           .attr("class", "axis")
           .attr("transform", "translate("+marginX+"," + (curr_obj.height - margin) + ")")
           .call(xAxis);

        // 4. Call the y axis in a group tag
        svg.append("g")
           .attr("class", "axis")
           .attr("transform", "translate(" + marginX + ","+(margin - 105)+")")
           .call(yAxis);

        // 9. Append the path, bind the data, and call the line generator 
        svg.append("path")
            .datum(dataset) // 10. Binds data to the line 
            .attr("class", "line") // Assign a class for styling 
            .attr("d", line) // 11. Calls the line generator 
            .style("stroke", "red");

        svg.append("path")
            .datum(dataset2) // 10. Binds data to the line 
            .attr("class", "line2") // Assign a class for styling 
            .attr("d", line) // 11. Calls the line generator 
            .style("stroke", "gray")
            .style("stroke-dasharray", "5");

        //var focus = svg.append("g").attr("class", "focus").style("display", "none");
        //focus.append("line").attr("class", "focus line").attr("x1", 0).attr("x2", 0).attr("y1", 100).attr("y2", height).style("stroke", "black");

        var focus2 = svg.append("g").attr("class", "focus").style("display", "none");
        focus2.append("line").attr("class", "focus line").attr("x1", 0).attr("x2", 0).attr("y1", 0).attr("y2", height - margin).style("stroke", "black");

        // 12. Appends a circle for each datapoint 
        svg.selectAll(".dot")
            .data(dataset)
            .enter().append("circle") // Uses the enter().append() method
            .attr("class", "dot") // Assign a class for styling
            .attr("cx", function(d, i) { return xScale(i) + marginX })
            .attr("cy", function(d) { console.log(d.y); return curr_obj.height - (yScale(d.y))})
            .attr("r", 5)
            .style("fill", "red");

        

        svg.selectAll(".dot2")
            .data(dataset2)
            .enter().append("circle") // Uses the enter().append() method
            .attr("class", "dot2") // Assign a class for styling
            .attr("cx", function(d, i) { return xScale(i) + marginX})
            .attr("cy", function(d) { console.log(d.y); return curr_obj.height - yScale(d.y) })
            .attr("r", 5)
            .attr("fill", "gray")
            .attr("data-html", "true")
            .attr("data-toggle", function(d, i) {
                $(this).tooltip({'title': '<b>Value:</b> ' + 
                                          d.y
                                });
                return "tooltip";
            });

        svg.selectAll(".dot")
            .attr("data-html", "true")
            .attr("data-toggle", function(d, i) {
                $(this).tooltip({'title': '<b>Value:</b> ' + 
                                          d.y
                                });
                return "tooltip";
            })
            .on("mouseover", function(d, j) {

                d3.select(this)
                .style("fill", "orange");

                d3.selectAll(".dot2")
                .style("fill", function(dn, i) {
                    if (i === j) {
                        $(this).mouseover();
                        return "orange";
                    }
                    else {
                        return "gray";
                    }
                    
                });

                //var country = curr_obj.full_data['countries'][d['key']];
                $(this).tooltip({'title': '<b>Value:</b> ' + 
                                          d.y
                                });

                
                var x0 = xScale.invert(d3.mouse(this)[0]);
                var y0 = yScale.invert(d3.mouse(this)[1]);
                var yThis = dataset[j]["y"];
                var yOther = dataset2[j]["y"];
                var chosenY = Math.max(yThis, yOther);
                var endY = Math.min(yThis, yOther);
                console.log(chosenY)
                chosenY = yScale.invert(chosenY) - margin;
                endY = yScale.invert(endY);
                focus2.select(".focus.line").attr("transform", "translate(" + xScale(x0) + ")").attr("y1", yScale(chosenY));
                focus2.style("display", null);

            })
            .on("mouseout", function(d, i) {
                d3.select(this)
                .style("fill", "red");

                d3.selectAll(".dot2")
                .style("fill", function(dn, j) {
                    console.log(this)
                    if (i === j) {
                        $(this).mouseout();
                        return "gray";
                    }
                    else {
                        return "gray";
                    }
                    
                });

                focus2.style("display", "none");
            });

        svg.selectAll(".dot2")
            .on("mouseover", function(d, j) {

                d3.select(this)
                .style("fill", "orange");

                d3.selectAll(".dot")
                .style("fill", function(dn, i) {
                    if (i === j) {
                        $(this).mouseover();
                        return "orange";
                    }
                    else {
                        return "red";
                    }
                    
                });

                //var country = curr_obj.full_data['countries'][d['key']];
                $(this).tooltip({'title': '<b>Value:</b> ' + 
                                          d.y
                                });

                
                var x0 = xScale.invert(d3.mouse(this)[0]);
                var y0 = yScale.invert(d3.mouse(this)[1]);
                var yThis = dataset2[j]["y"];
                var yOther = dataset[j]["y"];
                var chosenY = Math.max(yThis, yOther);
                var endY = Math.min(yThis, yOther);
                console.log(chosenY)
                chosenY = yScale.invert(chosenY) - margin;
                endY = yScale.invert(endY);
                focus2.select(".focus.line").attr("transform", "translate(" + xScale(x0) + ")").attr("y1", yScale(chosenY));
                focus2.style("display", null);

            })
            .on("mouseout", function(d, i) {
                d3.select(this)
                .style("fill", "gray");

                d3.selectAll(".dot")
                .style("fill", function(dn, j) {
                    console.log(this)
                    if (i === j) {
                        $(this).mouseout();
                        return "red";
                    }
                    else {
                        return "red";
                    }
                    
                });

                focus2.style("display", "none");
            });

    }
}