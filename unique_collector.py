import pandas as pd


def test(src):
    table = pd.DataFrame(src)
    for x in range(len(table.columns)):
        loc = table.loc[:, table.columns[x]]
        unique_lst = []
        unique_lst.append(loc[0])
        for y in range(1, len(loc)):
            if find_dupe(loc[y], unique_lst):
                table.loc[:, table.columns[x]].loc[y] = None
            else:
                unique_lst.append(loc[y])
    return table


def find_dupe(loc: str, unique_lst: list) -> bool:
    for unique in unique_lst:
        if loc == unique:
            return True
    return False
