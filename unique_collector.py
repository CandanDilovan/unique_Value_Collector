import pandas as pd


def oto_unique(src, dstcol):
    df = pd.DataFrame(src)
    table = df[dstcol].drop_duplicates().reset_index(drop=True)
    new_df = pd.DataFrame({dstcol: table})
    return new_df


def otm_unique(src, dstcol, dstlst):
    df = pd.DataFrame(src)
    unique_lst = set()
    new_df = pd.DataFrame(columns=dstlst)
    for x in range(len(df[dstcol])):
        if df[dstcol][x] not in unique_lst:
            unique_lst.add(df[dstcol][x])
            new_df.loc[len(new_df)] = add_Row(dstlst, x, df)
    return new_df


def add_Row(lst, pos, df):
    new_lst = set()
    for str in lst:
        new_lst.add(df[str][pos])
    return new_lst
