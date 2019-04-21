function DataLoader() {

    this.data = '';

    this.load_all_data = function(callback) { 
        var request = "/getpythondata"; 
        $.get(request, function(data) {
            
            this.data = $.parseJSON(data);
            if(typeof callback === "function") {
                callback(this.data);
            }
        });
    }
}

function FilterData(data) {
    this.data = data;
    
    this.read_overall_index = function(year, index_column) {
        if (index_column == 'OVERALL') {
            index_column = 'Gender Equality Index';
        }
        var the_year = this.data['index_data'][year];
        var min_index = 100;
        var max_index = 0;
        var overall_index = {};
        var index_obj;
        for (var i=0; i<the_year.length; i++) {
            index_obj = the_year[i][index_column];
            index_obj = Math.round(index_obj * 100) / 100;
            overall_index[the_year[i]['Country']] = index_obj;
            if (min_index > index_obj) {
                min_index = index_obj;
            }
            if (max_index < index_obj) {
                max_index = index_obj;
            }
        }
        overall_index['min_index'] = min_index;
        overall_index['max_index'] = max_index;
        return overall_index;
    }    
}

function add_dropdown_event(filter_obj, render_bar) {

    $("#domain_drop a").click(function(e){
        e.preventDefault(); // cancel the link behaviour
        var selText = $(this).text();
        console.log(selText);
        $("#dropdown_btn").text(selText);
        //todo: change color of button.
        var mySlider = $("#sliderElem").slider();
        var year = mySlider.slider('getValue');
        
        update_domain_year(selText, year, filter_obj, render_bar);
        $("#caption").text(selText);
    });

}

function update_domain_year(new_domain, year, filter_obj, render_bar) {
    console.log(year)
    console.log(new_domain)
    var overall_index = filter_obj.read_overall_index(year, new_domain.toUpperCase());
    console.log(overall_index);

    render_bar.update(new_domain, overall_index);
}

function data_callback(data) {
    console.log('Data was loaded.');
    console.log(data);
    var filter_obj = new FilterData(data);

    var overall_index = filter_obj.read_overall_index('2015', 'OVERALL');
    console.log(overall_index);

    var render_bar = new IndexBar("#vis1", filter_obj.data);
    render_bar.render_bar("Overall", overall_index);

    add_dropdown_event(filter_obj, render_bar);

    var mySlider = $("#sliderElem").slider();
    var value = mySlider.slider('getValue');
    console.log(value)

    mySlider.on("change", function(d) {
        var year = mySlider.slider('getValue');
        
        var domain = $("#dropdown_btn").text();

        update_domain_year(domain, year, filter_obj, render_bar);

    });

    //console.log($("#sliderElem").getValue())
}




var dloader = new DataLoader();
dloader.load_all_data(data_callback);
