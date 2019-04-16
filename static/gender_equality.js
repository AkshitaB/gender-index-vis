function DataLoader() {

    this.data = '';

    this.load_all_data = function() { 
        var request = "/getpythondata"; 
        $.get(request, function(data) {
            this.data = $.parseJSON(data);
            //console.log(this.data);
            data_callback();
        });
    }
}

function EuropeMap (data) {
    this.data = data;
    this.countries = '';
    this.years = Object.keys(this.data);

}


var dloader = new DataLoader();
dloader.load_all_data();

function data_callback() {
    console.log('Data was loaded.');
    var europe_map = EuropeMap(dloader.data);
}