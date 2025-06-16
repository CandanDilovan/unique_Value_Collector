import pandas as pd


def test(src):
    col_to_drop = ["id", "gristHelper_Display", "manualSort"]
    table = pd.DataFrame(src)
    for col in table.columns:
        for drop in col_to_drop:
            if col.find(drop):
                table = table.drop(col)
    # table = table.drop(columns=[col for col in col_to_drop if col in table.columns])

    for x in range(len(table.columns)):
        unique_lst = set()
        for y in range(len(table.index)):
            if table.at[table.index[y], table.columns[x]] in unique_lst:
                table.at[table.index[y], table.columns[x]] = None
            else:
                unique_lst.add(table.at[table.index[y], table.columns[x]])
    return table
