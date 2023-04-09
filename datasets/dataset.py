# import libraries
import pandas as pd 

class DATASETS():
    def __init__(self, type):
        super(DATASETS, self).__init__()
        self.type = type
        if(type == 'air'):
            print("Getting air dataset")
            self.inputdf = pd.read_csv('downloaded data/Air_pollution_data.csv')
            self.inputdf = self.inputdf[['Date','City', 'County', 'State', 'latitude', 'longitude',
                                'o3_median', 'pressure_median', 'pm25_median', 'humidity_median',
                                'temperature_median', 'dew_median', 'no2_median', 'wind-speed_median', 
                                'co_median', 'so2_median', 'pm10_median', 'wind-gust_median']]
            self.inputdf.to_csv('downloaded data/potential feature set for air pollution.csv')
            
            

        if(type == 'water'):
            print("Getting water dataset")
            self.inputdf = pd.read_csv('downloaded data/Water_pollution_data.csv')
            self.inputdf = self.inputdf[['OrganizationIdentifier', 'ActivityMediaSubdivisionName', 'ActivityStartDate', 'ActivityDepthHeightMeasure/MeasureValue',
                               'ActivityConductingOrganizationText', 'HydrologicCondition', 'HydrologicEvent',
                               'ActivityLocation/LatitudeMeasure', 'ActivityLocation/LongitudeMeasure', 'CharacteristicName']]
            # distance unit is feet
            self.inputdf.to_csv('downloaded data/potential feature set for water pollution.csv')

        # print(self.inputdf.head(2))
            

    def cleanDataframe(self):
        # do data cleaning here
        # delete columns with zero feature importance
        print('Cleaning dataset')
        if(self.type == 'air'):
            # just make the unavailable numerical values zero
            self.inputdf = self.inputdf.fillna(0)
            # print(self.inputdf.head(10))
        
        if(self.type == 'water'):
            # drop rows of Pandas DataFrame whose value in a certain column is NaN
            self.inputdf = self.inputdf[self.inputdf['ActivityLocation/LatitudeMeasure'].notna()]
            self.inputdf = self.inputdf[self.inputdf['ActivityLocation/LongitudeMeasure'].notna()]
            self.inputdf.to_csv('downloaded data/filtered on location for water pollution.csv')

            # just make the unavailable numerical values zero
  

        return self.inputdf
        



def get_clean_dataset(type):
    """    """
    dataObject = DATASETS(type)
    # cleanedData = dataObject.cleanDataframe()
    # return cleanedData
    return dataObject.cleanDataframe()