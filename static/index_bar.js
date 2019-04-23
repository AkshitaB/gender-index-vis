function IndexBar(svg_elem, full_data) {
    this.svg_elem = svg_elem;
    this.width = $(this.svg_elem).width();
    this.height = $(this.svg_elem).height();

    this.domain_color_map = {
        "Overall":"#17a2b8",
        "Work":"#017EDA",
        "Money":"#28a745",
        "Knowledge":"#B40E00",
        "Time":"#ffc107",
        "Power":"#e83e8c",
        "Health":"#6610f2"
    };

    this.full_data = full_data;

    //var margin = 0.1*this.height;
    var margin = 0.1*this.height;
    var marginX = 0.0*this.width;

    var within_margin = 0.01*this.height;

    var num_countries = Object.keys(this.full_data["countries"]).length;

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

        var selected = null;

        svg.selectAll("rect")
           .data(records)
           .enter()
           .append("rect")
           .attr("class","bar_chart")
           .attr("x", function(d, i) {
                return marginX + xScale(i);
           })
           .attr("y", function(d) {
                return curr_obj.height - yScale(d["value"]) + within_margin;
           })
           .attr("width", xScale.bandwidth())
           .attr("height", function(d) {
                return yScale(d["value"]) - margin;
           })
           .attr("data-toggle", "tooltip")
           .attr("data-html", "true")
           .attr("my_color", function(d){
                if(d.key=="EU-28") return "gray";
                return curr_obj.domain_color_map[domain];
           })
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
           .attr("selected", "false")
           .on("click", function(d) {

                 if(d3.select(this).attr("selected") == "false"){

                    if(selected){
                      selected.style("fill", selected.attr("my_color"))
                              .attr("selected", "false")
                    }

                    selected = d3.select(this);

                    d3.select(this).style("fill","black")
                      .attr("selected","true");

                    $("#chosen_country").text(d["key"]);
                    $("#chosen_country").change();


                 }else{
                    //console.log("In else statement")
                    
                    d3.select(this).style("fill", selected.attr("my_color"))
                      .attr("selected","false");
                    selected = null;
                    $("#chosen_country").text("");
                    $("#chosen_country").change();
                 }
                    

                /*var is_clicked = d3.select(this).attr("selected");
                console.log(is_clicked)
                if (is_clicked === "false") {
                    console.log("in")
                    d3.select(this)
                    .attr("selected", "true");
                    $("#chosen_country").text(d["key"]);
                    $("#chosen_country").change();



                    //d3.select(this)
                    //.style("fill", "orange");
                }
                else {
                    d3.select(this)
                    .attr("selected", "false")
                    /*.style("fill", function(d) {
                        if (d["key"] == "EU-28")
                            return "gray"
                        return curr_obj.domain_color_map[domain];
                    });
                }*/
                
           })
           
           .on("mouseover", function(d, j) {
                if(d3.select(this).attr("selected") != "true"){
                d3.select(this)
                .style("fill", "orange");}

                var country = curr_obj.full_data['countries'][d['key']];
                $(this).tooltip({'title': '<b>Country:</b> ' + 
                                          country + '<br><b>GE Index:</b> ' + 
                                          d["value"]
                                });

               })
            .on("mouseout", function(d, j) {
                if(d3.select(this).attr("selected") != "true")
                {if (d["key"] == "EU-28") {
                                    var fill_color = "gray"
                                }
                                else {
                                    var fill_color = curr_obj.domain_color_map[domain];
                                }
                                //if (d3.select(this).attr("selected") === "false") {
                                    d3.select(this)
                                    .style("fill", fill_color);
                                //}
                }
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
           .attr("transform", "translate("+marginX+"," + (curr_obj.height - margin + within_margin) + ")")
           .call(xAxis);

        svg.append("g")
           .attr("class", "axis")
           .attr("transform", "translate(" + 2*marginX + ","+(0 - margin + within_margin)+")")
           .call(yAxis);

    }
}