function DivergingBar(svg_elem, data) {
    this.svg_elem = svg_elem;
    this.width = $(this.svg_elem).width();
    this.height = $(this.svg_elem).height();

    // var margin = {top: this.height *.1, right: this.width*.1, bottom: this.height *.1, left: this.height*0.1},
    //     width = this.width - margin.left - margin.right,
    //     height = this.height - margin.top - margin.bottom;

    // print(width, height)    
    // var y = d3.scaleBand()
    //     .rangeRound([0, height], .3);

    // var x = d3.scaleLinear()
    //     .rangeRound([0, height]);

    // var color = d3.scaleOrdinal()
    //     .domain(["Women", "Men"])
    //     .range(["#92c6db", "#086fad"]);

    // var xAxis = d3.axisTop()
    //     .scale(x);

    // var yAxis = d3.axisLeft()
    //     .scale(y);

    var svg = d3.select(this.svg_elem);

    this.render_diverging_bar = function(power_data) {
        var margin = {top: this.height *.1, right: this.width*.1, bottom: this.height *.1, left: this.height*0.1},
            width = this.width - margin.left - margin.right,
            height = this.height - margin.top - margin.bottom;
        
        var y = d3.scaleBand()
            .rangeRound([0, height], .3);

        var x = d3.scaleLinear()
            .rangeRound([0, height]);

        var color = d3.scaleOrdinal()
            .domain(["Women", "Men"])
            .range(["#92c6db", "#086fad"]);

        var container = svg.append("g")
                           .attr("class", "diverginbarcontainer")
                           .style('transform', 'translate(15%, 15%)');



        power_data.forEach(function(d) {
                // calc percentages
                d["Men"] = +d[1];
                d["Women"] = +d[2];
                // d["Neither agree nor disagree"] = +d[3]*100/d.N;
                // d["Agree"] = +d[4]*100/d.N;
                // d["Strongly agree"] = +d[5]*100/d.N;
                var x0 = -1*(d["Women"]);
                var idx = 0;
                d.boxes = color.domain().map(function(name) { return {name: name, x0: x0, x1: x0 += +d[name], n: +d[idx += 1]}; });
                //console.log(d);
        });

        // var min_val = d3.min(data, function(d) {
        //         return d.boxes["0"].x0;
        //         });

        // var max_val = d3.max(data, function(d) {
        //         return d.boxes["1"].x1;
        //         });

        x.domain([-100, 100]).nice();
        y.domain(power_data.map(function(d) { return d.question; }));

        container.append("g")
          .attr("class","axis")
          .attr("transform", "translate(0,0)")
          .call(d3.axisTop(x))

        container.append("g")
          .attr("class","axis")
          .attr("transform","translate(0,0)")
          .call(d3.axisLeft(y));

        // var xAxis = d3.axisTop()
        //     .attr("transform","translate("+ width + ",0)")
        //     .scale(x);

        // var yAxis = d3.axisLeft()
        //     .scale(y);

        // svg.append("g")
        //     .attr("class", "x axis")
        //     .call(xAxis);

        // svg.append("g")
        //     .attr("class", "y axis")
        //     .call(yAxis)

        var vakken = container.selectAll(".question")
            .data(power_data)
            .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function(d) { return "translate(0," + y(d.question) + ")"; });

        var bars = vakken.selectAll("rect")
            .data(function(d) { return d.boxes; })
            .enter().append("g").attr("class", "subbar");

        bars.append("rect")
            .attr("height", y.bandwidth()-20)
            .attr("x", function(d) { return x(d.x0); })
            .attr("width", function(d) { return x(d.x1) - x(d.x0); })
            .style("fill", function(d) { return color(d.name); });

        bars.append("text")
            .attr("x", function(d) { 
                if(d.name == 'Women'){
                    return x(d.x1-18);
                }else{
                    return x(d.x0); 
                }
            })
            .attr("y", y.bandwidth()/2+9 )
            .attr("dy", "0.5em")
            .attr("dx", "0.5em")
            .style("font" ,"10px sans-serif")
            .style("text-anchor", "begin")
            .text(function(d) { return Math.round(100-d.n) });

        // vakken.insert("rect",":first-child")
        //     .attr("height", y.bandwidth())
        //     .attr("x", "1")
        //     .attr("width", width)
        //     .attr("fill-opacity", "0.5")
        //     .style("fill", "#F5F5F5")
        //     .attr("class", function(d,index) { return index%2==0 ? "even" : "uneven"; });


        container.append("g")
            .attr("class", "y axis")
            .append("line")
            .attr("x1", x(0))
            .attr("x2", x(0))
            .attr("y2", height);

        var startp = container.append("g").attr("class", "legendbox").attr("id", "mylegendbox");
        // this is not nice, we should calculate the bounding box and use that
        var legend_tabs = [20, 80];
        var legend = startp.selectAll(".legend")
            .data(color.domain().slice())
          .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(" + legend_tabs[i] + ",-45)"; });

        legend.append("rect")
            .attr("x", 0)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", 22)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "begin")
            .style("font" ,"10px sans-serif")
            .text(function(d) { return d; });

        d3.selectAll(".axis path")
            .style("fill", "none")
            .style("stroke", "#000")
            .style("shape-rendering", "crispEdges")

        d3.selectAll(".axis line")
            .style("fill", "none")
            .style("stroke", "#000")
            .style("shape-rendering", "crispEdges")

        var movesize = width/2 - startp.node().getBBox().width/2;
        d3.selectAll(".legendbox").attr("transform", "translate(" + (width-4*margin.right) + ","+ (margin.top + 40) + ")");
    }
}  

