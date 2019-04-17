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

/*function EuropeMap (data) {
    this.data = data;
    this.countries = '';
    this.years = Object.keys(this.data);

}*/

function FilterData(data) {
    this.data = data;
    
    this.read_overall_index = function(year) {
        var the_year = this.data['index_data'][year];
        var overall_index = {};
        for (var i=0; i<the_year.length; i++) {
            //if (the_year[i]['Country'] == country) {
            overall_index[the_year[i]['Country']] = the_year[i]['Gender Equality Index'];
            //    break;
            //}
        }
        return overall_index;
    }    
}

var dloader = new DataLoader();
dloader.load_all_data(data_callback);

function data_callback(data) {
    console.log('Data was loaded.');
    console.log(data);
    var filter_obj = new FilterData(data);
    var overall_index = filter_obj.read_overall_index('2005');
    console.log(overall_index);
    var render = new MapRender("#vis1");
    render.render_map(overall_index);

    $("#domain_drop a").click(function(e){
        e.preventDefault(); // cancel the link behaviour
        var selText = $(this).text();
        console.log(selText);
        $("#caption").text(selText);
    });

}
