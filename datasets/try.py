import pandas as pd 
error_df = pd.read_csv('../downloaded data/error_df.csv', names = ["attr", "errorvalue"])
maxValues = pd.read_csv('../downloaded data/maxValues.csv', names = ["attr", "maxvalue"])
minValues = pd.read_csv('../downloaded data/minValues.csv', names = ["attr", "minvalue"])
print(error_df.head())
# maxValues = maxValues.set_index('attr').combine_first(minValues.set_index('attr'))
# print(maxValues.head())
maxValues = pd.concat([maxValues, error_df], axis=1, join="inner")
print(maxValues.head())
maxValues = pd.concat([maxValues, minValues], axis=1, join="inner")
print(maxValues)
# remove rows
maxValues = maxValues.drop([0])
# remove columns
# maxValues = maxValues.drop(columns=['attr'])
print(maxValues)
