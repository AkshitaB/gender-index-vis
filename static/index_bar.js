function IndexBar(svg_elem, full_data) {
    this.svg_elem = svg_elem;
    this.width = $(this.svg_elem).width();
    this.height = $(this.svg_elem).height();

    var position = $(this.svg_elem).offset();
    this.left = position['left'];
    this.top = position['top'];

    this.domain_color_map = {
        "Overall":"#17a2b8",
        "Work":"#007bff",
        "Money":"#28a745",
        "Knowledge":"red",
        "Time":"#ffc107",
        "Power":"#e83e8c",
        "Health":"#6610f2"
    };

    this.full_data = full_data;

    var margin = 0.1*this.height;
    var marginX = 0.02*this.width;

    console.log(this.full_data["countries"])
    var num_countries = Object.keys(this.full_data["countries"]).length;
    console.log(num_countries)

    var xScale = d3.scaleBand()
                    .domain(d3.range(num_countries+1))
                    .rangeRound([0, this.width])
                    .paddingInner(0.05);

                    //records.map(function(d) {return d.key;})

    var yScale = d3.scaleLinear()
                    .domain([0, 100])
                    .range([margin, this.height]);
    
    var svg = d3.select(this.svg_elem);

    this.get_sorted_records = function(overall_index) {
        var records = [];
        for (var country in overall_index) {
            if (country != "min_index" && country != "max_index") {
                records.push({"key":country, "value":overall_index[country]});
            }
        }

        records.sort(function(first, second) {
         return first.value - second.value;
        });

        return records;
    }


    this.render_bar = function(domain, overall_index) {
        
        var curr_obj = this;

        var records = curr_obj.get_sorted_records(overall_index);

        //https://jsfiddle.net/matehu/w7h81xz2/

        svg.selectAll("rect")
           .data(records)
           .enter()
           .append("rect")
           .attr("x", function(d, i) {
                return marginX + xScale(i);
           })
           .attr("y", function(d) {
                console.log(curr_obj.height)
                return curr_obj.height - yScale(d["value"]);
           })
           .attr("width", xScale.bandwidth())
           .attr("height", function(d) {
                return yScale(d["value"]) - margin;
           })
           .attr("data-toggle", "tooltip")
           .attr("data-html", "true")
           .attr("fill", function(d) {
                var country = curr_obj.full_data['countries'][d['key']];
                $(this).tooltip({'title': '<b>Country:</b> ' + 
                                          country + '<br><b>GE Index:</b> ' + 
                                          d["value"]
                                });
                if (d["key"] == "EU-28")
                    return "gray"
                return curr_obj.domain_color_map[domain];

           })
           .on("click", function() {
                
           })
           
           .on("mouseover", function(d, j) {

                d3.select(this)
                .style("fill", "orange");

                var country = curr_obj.full_data['countries'][d['key']];
                $(this).tooltip({'title': '<b>Country:</b> ' + 
                                          country + '<br><b>GE Index:</b> ' + 
                                          d["value"]
                                });

               })
            .on("mouseout", function(d, j) {
                if (d["key"] == "EU-28") {
                    var fill_color = "gray"
                }
                else {
                    var fill_color = curr_obj.domain_color_map[domain];
                }
                d3.select(this)
                .style("fill", fill_color);
            })
           ;

        var xAxis = d3.axisBottom().scale(xScale)
                                   .tickValues(d3.range(num_countries))
                                   .tickFormat(function(d, i) {
                                    return records[i]["key"];
                                   });

        var yAxis = d3.axisLeft().scale(yScale)
                                 .ticks(10)
                                 .tickFormat(function(d, i){
                                    return (10 - i)*10;
                                 });                             

        svg.append("g")
           .attr("class", "axis")
           .attr("transform", "translate("+marginX+"," + (curr_obj.height - margin) + ")")
           .call(xAxis);

        svg.append("g")
           .attr("class", "axis")
           .attr("transform", "translate(" + marginX + ","+(margin - 105)+")")
           .call(yAxis);

    }

    this.update = function(domain, overall_index) {
        console.log("Updating");
        var curr_obj = this;
        var records = curr_obj.get_sorted_records(overall_index);

        svg.selectAll("g.axis").remove();

        svg.selectAll("rect").remove();

        var count = 0;

        
        
        svg.selectAll("rect")
           .data(records)
           .enter()
           .append("rect")
           //.transition()
           //.duration(500)
           //.ease(d3.easeLinear)
           .attr("x", function(d, i) {
                return marginX + xScale(i);
           })
           .attr("y", function(d) {
                return curr_obj.height - yScale(d["value"]);
           })
           .attr("width", xScale.bandwidth())
           .attr("height", function(d) {
                return yScale(d["value"]) - margin;
           })
           .attr("data-toggle", "tooltip")
           .attr("data-html", "true")
           .attr("fill", function(d) {
                var country = curr_obj.full_data['countries'][d['key']];
                $(this).tooltip({'title': '<b>Country:</b> ' + 
                                          country + '<br><b>GE Index:</b> ' + 
                                          d["value"]
                                });
                if (d["key"] == "EU-28") {
                    return "gray"
                }
                return curr_obj.domain_color_map[domain];
           })
           
           ;


        svg.selectAll("rect")
           .on("mouseover", function(d, j) {

                d3.select(this)
                .style("fill", "orange");
                var country = curr_obj.full_data['countries'][d['key']];
                $(this).tooltip({'title': '<b>Country:</b> ' + 
                                          country + '<br><b>GE Index:</b> ' + 
                                          d["value"]
                                });

               })
            .on("mouseout", function(d, j) {
                if (d["key"] == "EU-28") {
                    var fill_color = "gray"
                }
                else {
                    var fill_color = curr_obj.domain_color_map[domain];
                }
                d3.select(this)
                .style("fill", fill_color);
            })
           ;
        

        var xAxis = d3.axisBottom().scale(xScale)
                                   .tickValues(d3.range(num_countries))
                                   .tickFormat(function(d, i) {
                                    return records[i]["key"];
                                   });

        var yAxis = d3.axisLeft().scale(yScale)
                                 .ticks(10)
                                 .tickFormat(function(d, i){
                                    return (10 - i)*10;
                                 });                                   

        svg.append("g")
           .attr("class", "axis")
           .attr("transform", "translate("+marginX+"," + (curr_obj.height - margin) + ")")
           .call(xAxis);

        svg.append("g")
           .attr("class", "axis")
           .attr("transform", "translate(" + marginX + ","+(margin - 105)+")")
           .call(yAxis);


        console.log(count);

    }
}