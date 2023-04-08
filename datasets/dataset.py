# import libraries

class DATASETS():
    def __init__(self, type):
        super(DATASETS, self).__init__()
        if(type == 'air'):
            print("Getting air dataset")

        if(type == 'water'):
            print("Getting water dataset")


    def clean(self):
        # do data cleaning here
        # delete columns with zero feature importance
        print('Cleaning dataset')
        



def get_clean_dataset(type):
    """
    Returns the model.
    """
    data = DATASETS(type)
    data.clean()
    return data