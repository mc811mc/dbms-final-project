from datasets import dataset
import numpy as np
import pandas as pd
import sqlite3
from numpy import mean
from numpy import std
from sklearn.datasets import make_regression
from sklearn.model_selection import RepeatedKFold
from keras.models import Sequential
from keras.layers import Dense

def main():
    air_dataset =  dataset.get_clean_dataset('air')
    print(air_dataset.head(2))

    # Since AIR table is already created- it's commented
    # connectAirDatabase(air_dataset)

    water_dataset = dataset.get_clean_dataset('water')
    print(water_dataset.head(2))
    # Since WATER table is already created- it's commented
    # connectWaterDatabase(water_dataset)

    # for checking the code - database creation with iris dataset
    # dataframe = dummyDatabase()
    # connectDatabase(dataframe)

    ret_val = makePrediction(air_dataset)
    print('showing ',ret_val)


def dummyDatabase():
    print("Checking toy example")
    irisData = pd.read_csv('downloaded data/iris.csv')
    # print(irisData.head())
    return irisData

# create connection object to connect to MySQL server.
def connectAirDatabase(dataframe):
    print('air database creation')
    print(dataframe.head())
    # import mysql.connector as msql
    # from mysql.connector import Error

    print("Connecting DB")
    try:
        # Create the database if it is not already there
        conn = sqlite3.connect("PollutionDatabase.db")
        print("Connected DB")
        cursor = conn.cursor()
        # cursor.execute("select database();")
        # record = cursor.fetchone()
        # print("You're connected to database: ", record)
        cursor.execute('DROP TABLE IF EXISTS AIR;')
        print('Creating table....')
        cursor.execute("""CREATE TABLE AIR (date date NOT NULL, city varchar(45), county varchar(45), state varchar(2),
                        latitude double NOT NULL, longitude double NOT NULL, o3 double, pressure double, pm25 double, 
                        humidity double, temperature double, dew double, no2 double, wind_speed double,	co double,
                        so2 double,	pm10 double, wind_gust double)""")
        print("AIR table is created....")
        for i in range(0, dataframe.shape[0]):
            each_list = dataframe.loc[i,:].values.flatten()
            print(each_list)
            row = tuple(each_list)
            print(row)
            sql = "INSERT INTO AIR VALUES (?,?,?,?,?,?, ?,?,?,?,?,?, ?,?,?,?,?,?)"
            cursor.execute(sql, row)
            # cursor.execute("""INSERT INTO iris (sepal_length, sepal_width, petal_length, petal_width, species) VALUES 
            #                 (%s,%s,%s,%s,%s)""", row)
            print("Record inserted "+str(i))
            # the connection is not autocommitted by default, so we must commit to save our changes
            conn.commit()

        # let’s query the database to make sure that our inserted data has been saved correctly.
        # Execute query
        print("Execute query")
        sql = "SELECT * FROM AIR"
        cursor.execute(sql)

        # Fetch all the records
        result = cursor.fetchall()
        for i in result:
            print(i)

    except sqlite3.Error as e:
        print("Error while connecting to SQL ", e) 


# create connection object to connect to MySQL server.
def connectWaterDatabase(dataframe):
    print('water database creation')
    print(dataframe.head())

    print("Connecting DB")
    try:
        # Create the database if it is not already there
        conn = sqlite3.connect("PollutionDatabase.db")
        print("Connected DB")
        cursor = conn.cursor()

        cursor.execute('DROP TABLE IF EXISTS WATER;')
        print('Creating table....')
        cursor.execute("""CREATE TABLE WATER (organizationIdentifier varchar(50), media varchar(50), date date NOT NULL,
                        height double, organizationText varchar(50), hydrologicCondition varchar(50), 
                        hydrologicEvent varchar(50), latitude double NOT NULL, longitude double NOT NULL,
                        characteristicName varchar(50) )""")
        print("WATER table is created....")
        for i in range(0, dataframe.shape[0]):
            each_list = dataframe.loc[i,:].values.flatten()
            print(each_list)
            row = tuple(each_list)
            print(row)
            sql = "INSERT INTO WATER VALUES (?,?,?,?,?,?,?,?,?,?)"
            cursor.execute(sql, row)

            print("Record inserted "+str(i))
            # the connection is not autocommitted by default, so we must commit to save our changes
            conn.commit()

        # let’s query the database to make sure that our inserted data has been saved correctly.
        # Execute query
        print("Execute query")
        sql = "SELECT * FROM WATER"
        cursor.execute(sql)

        # Fetch all the records
        result = cursor.fetchall()
        for i in result:
            print(i)

    except sqlite3.Error as e:
        print("Error while connecting to SQL ", e) 


# create connection object to connect to MySQL server.
def connectDatabase(dataframe):
    print(dataframe.head())
    # import mysql.connector as msql
    # from mysql.connector import Error

    print("Connecting DB")
    conn = sqlite3.connect("dummyIris.db")
    print("Connected DB")
    cursor = conn.cursor()
    # cursor.execute("select database();")
    # record = cursor.fetchone()
    # print("You're connected to database: ", record)
    cursor.execute('DROP TABLE IF EXISTS iris;')
    print('Creating table....')
    cursor.execute("""CREATE TABLE iris (sepal_length FLOAT(2,1)
                    NOT NULL, sepal_width FLOAT(2,1) NOT NULL,
                    petal_length FLOAT(2,1) NOT NULL,
                    petal_width FLOAT(2,1),species CHAR(11)NOT
                    NULL)""")
    print("iris table is created....")
    for i in range(0, dataframe.shape[0]):
        each_list = dataframe.loc[i,:].values.flatten()
        print(each_list)
        row = tuple(each_list)
        print(row)
        sql = "INSERT INTO iris (sepal_length, sepal_width, petal_length, petal_width, species) VALUES (?,?,?,?,?)"
        cursor.execute(sql, row)
        # cursor.execute("""INSERT INTO iris (sepal_length, sepal_width, petal_length, petal_width, species) VALUES 
        #                 (%s,%s,%s,%s,%s)""", row)
        print("Record inserted")
        # the connection is not autocommitted by default, so we must commit to save our changes
        conn.commit()

# let’s query the database to make sure that our inserted data has been saved correctly.
    # Execute query
    print("Execute query")
    sql = "SELECT * FROM iris"
    cursor.execute(sql)

    # Fetch all the records
    result = cursor.fetchall()
    for i in result:
        print(i)


#     try:
#         print("Connecting DB")
#         conn = sqlite3.connect("dummyIris.db")
#         print("Connected DB")
#         cursor = conn.cursor()
#         # cursor.execute("select database();")
#         # record = cursor.fetchone()
#         # print("You're connected to database: ", record)
#         cursor.execute('DROP TABLE IF EXISTS iris;')
#         print('Creating table....')
#         cursor.execute("""CREATE TABLE iris (sepal_length FLOAT(2,1)
#                         NOT NULL, sepal_width FLOAT(2,1) NOT NULL,
#                         petal_length FLOAT(2,1) NOT NULL,
#                         petal_width FLOAT(2,1),species CHAR(11)NOT
#                         NULL)""")
#         print("iris table is created....")
#         for i in range(dataframe.size()):
#             row = dataframe.loc[i,:].values.flatten()
#             print(row)
#             sql = "INSERT INTO iris VALUES (%s,%s,%s,%s,%s)"
#             cursor.execute(sql, tuple(row))
#             print("Record inserted")
#             # the connection is not autocommitted by default, so we must commit to save our changes
#             conn.commit()

# # let’s query the database to make sure that our inserted data has been saved correctly.
#         # Execute query
#         sql = "SELECT * FROM iris"
#         cursor.execute(sql)

#         # Fetch all the records
#         result = cursor.fetchall()
#         for i in result:
#             print(i)

#     except sqlite3.Error as e:
#         print("Error while connecting to SQL ", e) 
# 

def makePrediction(database):
    # plot for visualization
    # target_column = 'pm10_median'
    # print(database.groupby([target_column]).count())
    print(database.columns)
    database.Date = pd.to_datetime(database.Date)

    print('Splliting one column to several ones')
    database['day'] = database['Date'].dt.day
    database['month'] = database['Date'].dt.month
    database['year'] = database['Date'].dt.year
    print(database.columns)
    print(database.head())
    database.to_csv('downloaded data/filtered air pollution with date day month.csv')

    # mlp for multi-output regression
    # get the dataset
    def get_dataset():
        X, y = make_regression(n_samples=1000, n_features=10, n_informative=5, n_targets=3, random_state=42)
        print(X)
        print(y)
        return X, y

    # get the model
    def get_model(n_inputs, n_outputs):
        model = Sequential()
        model.add(Dense(20, input_dim=n_inputs, kernel_initializer='he_uniform', activation='relu'))
        model.add(Dense(n_outputs))
        model.compile(loss='mae', optimizer='adam')
        print(model)
        return model

    # evaluate a model using repeated k-fold cross-validation
    def evaluate_model(X, y):
        results = list()
        n_inputs, n_outputs = X.shape[1], y.shape[1]
        # define evaluation procedure
        cv = RepeatedKFold(n_splits=5, n_repeats=2, random_state=42)
        # enumerate folds
        count = 0
        for train_ix, test_ix in cv.split(X):
            # prepare data
            X_train, X_test = X[train_ix], X[test_ix]
            y_train, y_test = y[train_ix], y[test_ix]
            # define model
            model = get_model(n_inputs, n_outputs)
            # fit model
            model.fit(X_train, y_train, verbose=0, epochs=100)
            # evaluate model on test set
            mae = model.evaluate(X_test, y_test, verbose=0)
            # store result
            count = count+1
            print(count, '>%.3f' % mae)
            results.append(mae)
        return results

    # load dataset
    X, y = get_dataset()
    # evaluate model
    results = evaluate_model(X, y)
    # summarize performance
    print('MAE: mean %.3f std(%.3f)' % (np.mean(results), np.std(results)))
    sum = 0
    return sum

if __name__ == '__main__':
    # args = gv.args
    # if args.data_partition_type is 'normalOverAll':
    #     # args.epochs = 60
    # else:
    #     args.epochs = 50
    # args.mode = 'test'
    # main(args)

    # calling the main function
    main()

