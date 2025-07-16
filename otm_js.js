async function otm_load() {
    let tables = await grist.docApi.listTables();
    
    tables = tables.sort();

    let srcdrop = document.getElementById("sourcetable");
    let dstdrop = document.getElementById("desttable");


    for (const table of tables) {
        const op1 = document.createElement("option");
        const op2 = document.createElement("option");
        op1.value = table;
        op1.textContent = table;
        op2.value = table;
        op2.textContent = table;
        srcdrop.appendChild(op1);
        dstdrop.appendChild(op2);
    }
    document.getElementById("sourcetable").addEventListener("change", show_Col);
    document.getElementById("desttable").addEventListener("change", show_Col);

    document.getElementById("desttable").addEventListener("change", col_Selector);
    document.getElementById("dupe").addEventListener("click", async(event) => {
        const button =  event.target;
        button.disabled = true;
        try 
        {
            let src = document.getElementById("sourcetable");
            let dst = document.getElementById("desttable");
            let dstcol = document.getElementById("dstcolumn");

            let srctable = await grist.docApi.fetchTable(src.selectedOptions[0].value);
            let dsttable = await grist.docApi.fetchTable(dst.selectedOptions[0].value);
        
            if (check_Col(dstcol.selectedOptions[0].text, Object.keys(srctable)))
            {
                if (is_Text(srctable[dstcol.selectedOptions[0].text][0]))
                    await py_Start(srctable, dst.selectedOptions[0], check_Col(dsttable, dstcol.selectedOptions[0].text));
                else
                    throw "columns must be Texte type";
            }
            else
                throw "tables do not match";
        }
        catch (error)
        {
            console.error(error)
            showError(error.message)
        }
        finally
        {
            button.disabled = false;
        }
    });
}

function rearange_Cols(dsttable, dstcol)
{
    new_lst = [dstcol];
    for (let x = 0; x < dsttable.lenght; x++)
    {
        if (dsttable[x] !== dstcol)
            new_lst.appendChild(dsttable[x]);   
    }
    return new_lst
}

function check_Col(dst, src)
{
    console.log(src);
    console.log(dst);
    for (const col of src)
    {
        console.log(col)
        if (dst === col)
            return true;
    }
    return false;
}