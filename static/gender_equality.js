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
    
    this.read_overall_index(country, year) {
        var the_year = this.data['index_data'][year];
        var overall_index;
        for (var i=0; i<the_year.length; i++) {
            if (the_year[i]['Country'] == country) {
                overall_index = the_year[i]['Gender Equality Index'];
                break;
            }
        }
        return overall_index;
    }    
}


var dloader = new DataLoader();
dloader.load_all_data(data_callback);

function data_callback(data) {
    console.log('Data was loaded.');
    console.log(data);
    //var europe_map = EuropeMap(data);
    console.log(data['countries'])

}