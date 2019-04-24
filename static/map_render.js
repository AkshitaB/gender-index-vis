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

    this.scale_factor = 500;

    this.num_countries = 28;

    this.config = {"color1":"#d3e5ff", "color2":"#08306B"};

    this.COLOR_COUNTS = 9;

    this.COLOR_FIRST = this.config.color1
    this.COLOR_LAST = this.config.color2;

    this.setup_colors = function() {
      var curr_obj = this;

      var rgb = hexToRgb(curr_obj.COLOR_FIRST);
        
      var COLOR_START = new Color(rgb.r, rgb.g, rgb.b);
      
      rgb = hexToRgb(curr_obj.COLOR_LAST);
      var COLOR_END = new Color(rgb.r, rgb.g, rgb.b);
      

      curr_obj.startColors = COLOR_START.getColors()
      curr_obj.endColors = COLOR_END.getColors();

      var colors = [];

      for (var i = 0; i < curr_obj.COLOR_COUNTS; i++) {
        var r = Interpolate(curr_obj.startColors.r, curr_obj.endColors.r, curr_obj.COLOR_COUNTS, i);
        var g = Interpolate(curr_obj.startColors.g, curr_obj.endColors.g, curr_obj.COLOR_COUNTS, i);
        var b = Interpolate(curr_obj.startColors.b, curr_obj.endColors.b, curr_obj.COLOR_COUNTS, i);
        colors.push(new Color(r, g, b));
      }

      curr_obj.colors = colors;
    }

    this.get_index_color = function(overall_index, country_id) {
      var curr_obj = this;
      var quantize = d3.scaleQuantize()
        .domain([0, 1.0])
        .range(d3.range(curr_obj.COLOR_COUNTS).map(function(i) { return i }));

      var range_diff = overall_index['max_index'] - overall_index['min_index'];
      var scaled = (overall_index[country_id] - overall_index['min_index'])/range_diff;
      var i = quantize(scaled);
      var color = curr_obj.colors[i].getColors();
      return "rgb(" + color.r + "," + color.g +
          "," + color.b + ")";
    }



    this.render_map = function(overall_index) {      

        var curr_obj = this;

        curr_obj.setup_colors();

        //Define map projection
        var projection = d3.geoAzimuthalEquidistant()
                               //.translate([this.width/2, this.height/2])
                               //.transform("translate(0,0)")
                               .scale([this.scale_factor]);

        //Define path generator
        var path = d3.geoPath()
                         .projection(projection);

        var svg = d3.select(svg_elem);

        console.log(overall_index)
        var dataset = d3.range(this.num_countries);
        console.log(dataset)

        console.log(curr_obj.width)
        console.log(curr_obj.height)

        var map_x = curr_obj.width/12;

        //Load in GeoJSON data
        d3.json("static/europe.json", function(json) {
            //Bind data and create one path per GeoJSON feature
            svg.selectAll("path")
               .data(json.features)
               .enter()
               .append("path")
               .attr("d", path)
               .attr("data-toggle", "tooltip")
               .attr("data-html", "true")
               .attr("transform", "translate("+(map_x)+", "+(curr_obj.height)+")")
               .style("fill", function(d, j) {
                      var country_id = json['features'][j]['id'];
                      return curr_obj.get_index_color(overall_index, country_id);
                })
               .on("mouseover", function(d, j) {

                var country_id = json['features'][j]['id'];
                var country_name = json['features'][j]['properties']['name'];

                var country_index = Math.round(overall_index[country_id] * 100) / 100;

                d3.select(this)
                .style("fill","orange");

                $(this).tooltip({'title': '<b>Country:</b> ' + 
                                          country_name + '<br><b>GE Index:</b> ' + 
                                          country_index
                                });

               })
               .on("mouseout", function(d, j) {
                 var country_id = json['features'][j]['id'];

                 var new_color = curr_obj.get_index_color(overall_index, country_id);
                 d3.select(this)
                 .style("fill", new_color);

               })
              .on("click", function() {
                  console.log("Hello.");
               });

        });

        svg.selectAll("path")



    }
}