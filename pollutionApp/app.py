from flask import Flask, render_template
import pandas as pd

app = Flask(__name__)

@app.route('/')
def show_map():
    # Read CSV data into a DataFrame
    file_path = "airPollution30.csv"
    airData = pd.read_csv(file_path)

    # Create a list of (latitude, longitude) tuples
    # locations = data[["latitude", "longitude"]].values.tolist()
    locations = airData.to_dict('records') # list of dictionaries

    # Get a list of attribute names from air dataset(excluding latitude and longitude)
    attribute_names = [col for col in airData.columns if col not in ['latitude', 'longitude']]

    return render_template('index.html', api_key="AIzaSyDc2dv55pUQZVIRZMzhGDKZg_0rcejd_s0", locations=locations, attribute_names=attribute_names)

if __name__ == '__main__':
    app.run(debug=True)
