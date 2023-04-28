from flask import Flask, render_template
import pandas as pd

app = Flask(__name__)

@app.route('/')
def show_map():
    # Read CSV data into a DataFrame
    file_path = "airPollutionCleaned.csv"
    airData = pd.read_csv(file_path)

    # Create a list of (latitude, longitude) tuples
    # locations = data[["latitude", "longitude"]].values.tolist()
    locations = airData.to_dict('records') # list of dictionaries

    # Get a list of attribute names from air dataset(excluding latitude and longitude)
    attribute_names = [col for col in airData.columns if col not in ['latitude', 'longitude']]

    # computing a set of city names from the dataset, to be used in dropdown menu of control panel
    unique_cities = airData['City'].unique().tolist()

    # Assuming you have loaded your dataset into a pandas DataFrame called 'df'
    unique_years = sorted(pd.to_datetime(airData['Date']).dt.year.unique(), reverse=True)

    return render_template('index.html', locations=locations, attribute_names=attribute_names, unique_cities=unique_cities, unique_years=unique_years)

if __name__ == '__main__':
    app.run(debug=True)
