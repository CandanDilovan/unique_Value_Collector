import pandas as pd


def test(src, dstcol):
    print(dstcol)
    table = pd.DataFrame(src)
    unique_lst = set()
    for y in range(len(table.index)):
        if table.at[table.index[y], 0] in unique_lst:
            pass
        else:
            unique_lst.add(table.at[table.index[y], 0])
    return table
