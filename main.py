from datasets import dataset
import numpy as np
import pandas as pd

def main():
    print('We are in main fn')
    air_dataset = dataset.get_clean_dataset('air')
    dummyDatabase()


def dummyDatabase():
    print("Checking toy example")
    irisData = pd.read_csv('downloaded data/iris.csv')
    print(irisData.head())

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

