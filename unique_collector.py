import pandas as pd


def test(src):
    table = pd.DataFrame(src)
    for x in range(len(table.columns)):
        unique_lst = set()
        for y in range(table.index):
            if table.at[y, x] in unique_lst:
                table.at[y, x] = None
            else:
                unique_lst.add(table.at[y, x])
    return table
