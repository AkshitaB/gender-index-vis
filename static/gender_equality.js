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

    this.read_country_index_over_years = function(country, index_column) {
        var curr_obj = this;
        if (index_column == 'OVERALL') {
            index_column = 'Gender Equality Index';
        }

        //var country_output = {};
        //var eu_output = {};
        var country_output;
        var eu_output;
        var output = [];
        for (var year in curr_obj.data['index_data']) {
            var this_year = curr_obj.data['index_data'][year];
            for (var j=0; j<29; j++) {
                if (this_year[j]['Country'] === country) {
                    country_output = this_year[j][index_column];
                }
                else if(this_year[j]['Country'] === 'EU-28') {
                    eu_output = this_year[j][index_column];
                }
            }
            output.push({'year':year, 'country_output':country_output, 'eu_output':eu_output});
        }
        return output;
    }

    this.read_household_leisure_career_data = function(year) {
        console.log(this.data)
        console.log(this.data['household_data'])
        var household = [];
        var rel_data = this.data['household_data'][year]
        for (var i=0; i<rel_data.length; i++) {
            var female_tuple = {};
            var male_tuple = {};
            female_tuple['country'] = rel_data[i]['Country']
            female_tuple['career'] = rel_data[i]['Career Prospects Index (points, 0-100) W']
            female_tuple['household_duties'] = rel_data[i]['People doing cooking and/or household, every day (%) W']
            female_tuple['leisure'] = rel_data[i]['Workers doing sporting, cultural or leisure activities outside of their home, at least daily or several times a week (%) W']
            female_tuple['gender'] = 'female';

            male_tuple['country'] = rel_data[i]['Country']
            male_tuple['career'] = rel_data[i]['Career Prospects Index (points, 0-100) M']
            male_tuple['household_duties'] = rel_data[i]['People doing cooking and/or household, every day (%) M']
            male_tuple['leisure'] = rel_data[i]['Workers doing sporting, cultural or leisure activities outside of their home, at least daily or several times a week (%) M']
            male_tuple['gender'] = 'male';

            household.push(female_tuple)
            household.push(male_tuple)
        }
        return household;
    }

    this.read_sub_domains = function(year, domain){
        if(domain == 'OVERALL'){
            return null;
        }
        var sub_domains = this.data['domains'][domain];
        return sub_domains;
    }

    this.read_sub_domain_data =  function(year, domain){
        if(domain == 'OVERALL'){
            return null;
        }
        var sub_domains = this.data['domains'][domain];

        sub_domain_data = []

        var the_year = this.data['index_data'][year];
        for(var i = 0; i<the_year.length; i++){
            for(var j = 0; j<sub_domains.length; j++){
                sub_domain_data.push({"country" : the_year[i]['Country'], "sub_domain" : sub_domains[j], "value" : the_year[i][sub_domains[j]]});
            }
        }
        return sub_domain_data;
    }
}

var year_mapper = {"1":"2005", "2":"2010", "3":"2012", "4":"2015"};

function add_dropdown_event(filter_obj, render_bar) {

    $("#domain_drop a").click(function(e){
        e.preventDefault(); // cancel the link behaviour

        var selText = $(this).text();
        console.log(selText);
        $("#dropdown_btn").text(selText);
        $("#caption").text(selText);
        change_vis1(filter_obj);
        change_vis2(filter_obj);
        change_vis3(filter_obj);
    });

}

function change_vis3(filter_obj){

    $("#vis3").empty();
    var mySlider = $("#sliderElem").slider();
    var year = mySlider.slider('getValue');
    year = year_mapper[year];

    var domain = $("#dropdown_btn").text();

    if(domain != 'Overall'){
        var sub_domains = filter_obj.read_sub_domains(year, domain.toUpperCase());
        var sub_domain_data = filter_obj.read_sub_domain_data(year, domain.toUpperCase());

        var render_map = new HeatMap("#vis3", filter_obj.data);
        render_map.render_heat_map(domain, sub_domains, sub_domain_data);
    }else{
        render_map.remove();
    }
    

}

/*function update_domain_year(new_domain, year, filter_obj, render_bar) {
    console.log(year)
    console.log(new_domain)
    var overall_index = filter_obj.read_overall_index(year, new_domain.toUpperCase());
    console.log(overall_index);

    render_bar.update(new_domain, overall_index);
}*/

function change_vis2(filter_obj) {
    var country_code = $("#chosen_country").text();
    $("#vis2").empty();
    if (country_code === "EU-28") {

    }
    else {
        var domain = $("#dropdown_btn").text(); //TODO: This is the dropdown from first vis.

        var per_country = filter_obj.read_country_index_over_years(country_code, domain.toUpperCase());
        console.log(per_country);

        var country_name = filter_obj.data['countries'][country_code];

        var render_chart = new LineChart2("#vis2", filter_obj.data);
        render_chart.render_chart(country_name, domain, per_country);
    }

}

function change_vis1(filter_obj) {

    var mySlider = $("#sliderElem").slider();
    var value = mySlider.slider('getValue');
    console.log(value)

    $("#vis1").empty();
    var year = mySlider.slider('getValue');

    year = year_mapper[year];
    var domain = $("#dropdown_btn").text();

    var overall_index = filter_obj.read_overall_index(year, domain.toUpperCase());
    console.log(overall_index);

    var render_bar = new IndexBar("#vis1", filter_obj.data);
    render_bar.render_bar(domain, overall_index);

}

function add_time_slider_event(filter_obj) {

    var mySlider = $("#sliderElem").slider();

    mySlider.on("change", function(d) {
        change_vis1(filter_obj);
        change_vis3(filter_obj);
    });

}

function add_country_selection_event(filter_obj) {
    $("#chosen_country").change(function() {
        change_vis2(filter_obj);
    });
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

    add_time_slider_event(filter_obj);

    add_country_selection_event(filter_obj);

    

    //var household = filter_obj.read_household_leisure_career_data('2015');
    //console.log(household)
}




var dloader = new DataLoader();
dloader.load_all_data(data_callback);
