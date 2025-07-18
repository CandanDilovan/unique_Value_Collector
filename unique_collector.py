import pandas as pd


def oto_unique(src, dstcol):
    df = pd.DataFrame(src)
    table = df[dstcol].drop_duplicates().reset_index(drop=True)
    new_df = pd.DataFrame({dstcol: table})
    return new_df


def otm_unique(src, dstcol):
    df = pd.DataFrame(src)
    unique_lst = new_Dict(dstcol)
    for x in range(len(df[dstcol[0]])):
        if df[dstcol[0]][x] not in unique_lst:
            for y in range(len(dstcol)):
                unique_lst[dstcol[y]] = df[dstcol[y]][x]
    print(unique_lst)
    new_df = pd.DataFrame.from_dict(unique_lst)
    return new_df


def new_Dict(dstcol):
    Dict = dict()
    for col in dstcol:
        Dict[col] = set()
    return Dict
