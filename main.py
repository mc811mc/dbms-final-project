from datasets import dataset
import numpy as np
import pandas as pd
import sqlite3

def main():
    air_dataset =  dataset.get_clean_dataset('air')
    print(air_dataset.head(2))

    connectAirDatabase(air_dataset)
    # air_dataset = pd.DataFrame(data = air_dataset)
    # print(air_dataset.head(2))
    water_dataset = dataset.get_clean_dataset('water')
    print(water_dataset.head(2))

    # dataframe = dummyDatabase()
    # connectDatabase(dataframe)


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
        conn = sqlite3.connect("AirDatabase.db")
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

if __name__ == '__main__':
    # args = gv.args
    print('hello')
    # if args.data_partition_type is 'normalOverAll':
    #     # args.epochs = 60
    # else:
    #     args.epochs = 50
    # args.mode = 'test'
    # main(args)

    # calling the main function
    main()

