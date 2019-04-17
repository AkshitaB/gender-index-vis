function Color(_r, _g, _b) {
    var r, g, b;
    var setColors = function(_r, _g, _b) {
        r = _r;
        g = _g;
        b = _b;
    };

    setColors(_r, _g, _b);
    this.getColors = function() {
        var colors = {
            r: r,
            g: g,
            b: b
        };
        return colors;
    };
}

function hexToRgb (hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function Interpolate(start, end, steps, count) {
    var s = start,
        e = end,
        final = s + (((e - s) / steps) * count);
    return Math.floor(final);
}

function MapRender(svg_elem) {

    this.svg_elem = svg_elem;
    this.width = $(this.svg_elem).width();
    this.height = $(this.svg_elem).height();

    var position = $(this.svg_elem).offset();
    this.left = position['left'];
    this.top = position['top'];

    this.scale_factor = 700;

    this.num_countries = 28;

    this.config = {"color1":"#d3e5ff", "color2":"#08306B"};

    this.render_map = function(overall_index) {      

        var curr_obj = this;
        var COLOR_COUNTS = 9;

        //Define map projection
        var projection = d3.geo.azimuthalEquidistant()
                               .translate([this.width/2, this.height/2])
                               .scale([this.scale_factor]);

        //Define path generator
        var path = d3.geo.path()
                         .projection(projection);

        var svg = d3.select(svg_elem);

        var dataset = d3.range(this.num_countries);

        var COLOR_FIRST = this.config.color1, COLOR_LAST = this.config.color2;

        var rgb = hexToRgb(COLOR_FIRST);
        
        var COLOR_START = new Color(rgb.r, rgb.g, rgb.b);
        
        rgb = hexToRgb(COLOR_LAST);
        var COLOR_END = new Color(rgb.r, rgb.g, rgb.b);
        

        var startColors = COLOR_START.getColors(),
        endColors = COLOR_END.getColors();


        var colors = [];

        for (var i = 0; i < COLOR_COUNTS; i++) {
          var r = Interpolate(startColors.r, endColors.r, COLOR_COUNTS, i);
          var g = Interpolate(startColors.g, endColors.g, COLOR_COUNTS, i);
          var b = Interpolate(startColors.b, endColors.b, COLOR_COUNTS, i);
          colors.push(new Color(r, g, b));
        }

        var quantize = d3.scale.quantize()
        .domain([0, 1.0])
        .range(d3.range(COLOR_COUNTS).map(function(i) { return i }));

        //Load in GeoJSON data
        d3.json("static/europe.json", function(json) {
            //Bind data and create one path per GeoJSON feature
            console.log(json)
            svg.selectAll("path")
               .data(json.features)
               .enter()
               .append("path")
               .attr("d", path)
               .attr("transform", "translate("+(curr_obj.left-curr_obj.width/2)+", "+(curr_obj.top+curr_obj.height)+")")
               .style("fill", function(d, j) {
                      var i = quantize(dataset[j]/curr_obj.num_countries);
                      //console.log("style" + j + " " + d.id);
                      var color = colors[i].getColors();
                      return "rgb(" + color.r + "," + color.g +
                          "," + color.b + ")";
                })
               .on("mouseover", function(d) {
                d3.select(this)
                .style("fill","orange");

               })
               .on("mouseout", function() {
                 d3.select(this)
                .style("fill", function(d,j) {
                      var i = quantize(dataset[j]/curr_obj.num_countries);
                      //console.log("mouseover" + j + " " + d.id);
                      var color = colors[i].getColors();
                      return "rgb(" + color.r + "," + color.g +
                          "," + color.b + ")";})
               })
              .on("click", function() {
                  console.log("Hello.");
               });

        });


    }
}