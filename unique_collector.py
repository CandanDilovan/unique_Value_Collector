import pandas as pd


def test(src, dstcol):
    df = pd.DataFrame(src)
    table = df[dstcol]
    print(table)
    for x in range(len(table.columns)):
        unique_lst = set()
        for y in range(len(table.index)):
            if table.at[table.index[y], table.columns[x]] in unique_lst:
                table.at[table.index[y], table.columns[x]] = None
            else:
                unique_lst.add(table.at[table.index[y], table.columns[x]])
    return table
