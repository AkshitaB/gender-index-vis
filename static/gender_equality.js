function DataLoader() {

    this.data = '';

    this.load_all_data = function(callback) { 
        var request = "/getpythondata"; 
        $.get(request, function(data) {
            
            this.data = $.parseJSON(data);
            //console.log(this.data);
            if(typeof callback === "function") {
                callback(this.data);
            }
        });
    }
}

function EuropeMap (data) {
    this.data = data;
    this.countries = '';
    this.years = Object.keys(this.data);

}


var dloader = new DataLoader();
dloader.load_all_data(data_callback);

function data_callback(data) {
    console.log('Data was loaded.');
    console.log(data);
    var europe_map = EuropeMap(data);
}