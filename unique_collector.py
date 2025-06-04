import pandas as pd


def test(src):
    col_to_drop = ["id", "gristHelper_Display", "manualSort"]
    table = pd.DataFrame(src)
    for x in range(len(table.columns)):
        if check_cols(col_to_drop, table.columns[x]):
            table.drop(table.columns[x], axis=1, inplace=True)
        else:
            unique_lst = set()
            for y in range(len(table.index)):
                if table.at[table.index[y], table.columns[x]] in unique_lst:
                    table.at[table.index[y], table.columns[x]] = None
                else:
                    unique_lst.add(table.at[table.index[y], table.columns[x]])
    return table


def check_cols(lst: list, df: pd.DataFrame) -> bool:
    for element in lst:
        if element in df:
            return True
    return False
