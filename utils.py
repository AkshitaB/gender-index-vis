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
        self.__init_metadata()
        self.__init_years()
        self.__init_countries()
        self.__simplify()
        self.__household_data()

    def __init_metadata(self):
        self.domains = ['WORK', 'MONEY', 'KNOWLEDGE', 'TIME', 'POWER', 'HEALTH']
        self.subdomains = {}
        self.subdomains['WORK'] = ['Participation', 'Segregation and quality of work']
        self.subdomains['MONEY'] = ['Financial resources', 'Economic situation']
        self.subdomains['KNOWLEDGE'] = ['Attainment and participation', 'Segregation']
        self.subdomains['TIME'] = ['Care activities', 'Social activities']
        self.subdomains['POWER'] = ['Political', 'Economic', 'Social']
        self.subdomains['HEALTH'] = ['Status', 'Behaviour', 'Access']

    def __init_years(self):
        year_data = {}
        for year in self.years:
            year_data[year] = pd.read_excel(self.filepath, year, index_col=None, na_values=['NA'])

        self.year_data = year_data

    def __init_countries(self):
        countries = pd.read_excel(self.filepath, 'CountryCodes', index_col=None, header=None, na_values=['NA'])
        self.countries = {}
        for idx, row in countries.iterrows():
            self.countries[row[0]] = row[1]

        #self.countries = list(self.year_data['2005'].Country[0:29].values) #first row is EU-28

    def __simplify(self):
        cols_of_interest = ['Country', 'Gender Equality Index']
        for dom in self.domains:
            cols_of_interest += [dom]
            cols_of_interest += self.subdomains[dom]

        self.index_data = {}
        for year in self.year_data:
            tmp = self.year_data[year][cols_of_interest].dropna()
            tmp = json.loads(tmp.to_json(orient='records'))
            self.index_data[year] = tmp

    def __household_data(self):
        cols_of_interest = ['Country',
                            'Career Prospects Index (points, 0-100) W', 'Career Prospects Index (points, 0-100) M', \
                            'People doing cooking and/or household, every day (%) W', 'People doing cooking and/or household, every day (%) M', \
                            'Workers doing sporting, cultural or leisure activities outside of their home, at least daily or several times a week (%) W',\
                            'Workers doing sporting, cultural or leisure activities outside of their home, at least daily or several times a week (%) M']
        self.household_data = {}
        for year in self.year_data:
            tmp = self.year_data[year][cols_of_interest].dropna()
            tmp = json.loads(tmp.to_json(orient='records'))
            self.household_data[year] = tmp



    def construct_data(self):
        self.simple_data = {}
        self.simple_data['index_data'] = self.index_data
        self.simple_data['countries'] = self.countries
        self.simple_data['domains'] = self.subdomains
        self.simple_data['household_data'] = self.household_data

    def jsonify(self):
        self.construct_data()
        return json.dumps(self.simple_data, cls=JSONEncoder)
