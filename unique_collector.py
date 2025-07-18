import pandas as pd


def oto_unique(src, dstcol):
    df = pd.DataFrame(src)
    table = df[dstcol].drop_duplicates().reset_index(drop=True)
    new_df = pd.DataFrame({dstcol: table})
    return new_df


def otm_unique(src, dstcol):
    df = pd.DataFrame(src)
    unique_lst = new_Dict(dstcol)
    new_df = pd.DataFrame(columns=dstcol)
    for y in range(len(dstcol)):
        for x in range(len(df[dstcol[y]])):
            if df[dstcol[y]][x] not in unique_lst:
                unique_lst[dstcol[y]] = df[dstcol[y]][x]
    return new_df


def new_Dict(dstcol):
    Dict = dict()
    for col in dstcol:
        Dict[col] = set()
    return Dict
