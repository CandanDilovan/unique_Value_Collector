import pandas as pd


def test(src, dstcol):
    df = pd.DataFrame(src)
    table = df[dstcol]
    print(table)
    unique_lst = {dstcol: []}
    for row in table:
        if row in unique_lst[dstcol]:
            pass
        else:
            unique_lst[dstcol].append(row)
    new_df = pd.DataFrame(unique_lst)
    print(new_df)
    return new_df
