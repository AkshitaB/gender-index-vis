import json
import pandas as pd

class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if hasattr(obj,'to_json'):
            return obj.to_json()
        return json.JSONEncoder.default(self, obj)

class DataReader:
    def __init__(self, filepath):
        self.filepath = filepath
        self.years = ['2005', '2010', '2012', '2015']
        self.__init_years()

    def __init_years(self):
        year_data = {}
        for year in self.years:
            year_data[year] = pd.read_excel(self.filepath, year, index_col=None, na_values=['NA'])

        self.year_data = year_data

    def __create_dict(self):
        metadata = pd.read_excel(self.filepath, 'Metadata', index_col=None, na_values=['NA'])
        '''
        countries = self.year_data['2005'].Country[1:29].values
        domains = ['WORK', 'MONEY', 'KNOWLEDGE', 'TIME', 'POWER', 'HEALTH']
        subdomains = {}
        for idx, domain in enumerate(domains):
            if idx == len(domains) - 1:
                pass
            else:
                self.yea
        index_data = {}
        '''
        #for each year, for each country, for each domain, for each subdomain.
    def jsonify(self):
        return json.dumps(self.year_data, cls=JSONEncoder)
