import pandas as pd


def test(src, dst):
    table = pd.DataFrame(src)
    dsttable = pd.DataFrame(dst)
    dsttable = table.drop_duplicates()
    print(dsttable.to_string())
