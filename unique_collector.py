import pandas as pd


def oto_unique(src, dstcol):
    df = pd.DataFrame(src)
    table = df[dstcol].drop_duplicates().reset_index(drop=True)
    new_df = pd.DataFrame({dstcol: table})
    return new_df


def otm_unique(src, dstcol):
    df = pd.DataFrame(src)
    unique_lst = set()
    new_df = pd.DataFrame(columns=dstcol)
    for x in range(len(df[dstcol[0]])):
        if df[dstcol[0]][x] not in unique_lst:
            unique_lst.add(df[dstcol[0]][x])
            new_df.loc[len(new_df)] = add_Row(dstcol, x, df)
    return new_df


def add_Row(lst, pos, df):
    new_lst = []
    for str in lst:
        new_lst.append(df[str][pos])
    return new_lst
