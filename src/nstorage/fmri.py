import pandas as pd
import scipy.io
import numpy as np
import json
import codecs
import sys


def matlab():
    print('welcome to ', str(sys.argv[0]))


# def matlab():
#     mat = scipy.io.loadmat('behavior-data.mat')
#     mat = {k: v for k, v in mat.items() if k[0] != '_'}
#     # key값만 출력함
#     # https://stackoverflow.com/questions/42424338/how-to-load-mat-files-in-python-and-access-columns-individually
#     matKey = list(mat.keys())
#     matValue = []

#     # https://stackoverflow.com/questions/61120981/how-to-read-from-a-mat-file-into-a-python-list
#     for key in mat:
#         matValue.append(mat[key])

#     # matValue
#     # https://stackoverflow.com/questions/40846219/python-combine-two-lists-into-one-json-object
#     res_dict = {}
#     for key in range(len(matKey)):
#         print(matKey[key])
#         print(matValue[key])
#         res_dict.update({matKey[key]: matValue[key]})

#     return res_dict
