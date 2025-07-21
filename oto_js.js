async function oto_load() {
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

    document.getElementById("sourcetable").addEventListener("change", col_Selector);
    document.getElementById("desttable").addEventListener("change", col_Selector);
    document.getElementById("dupe").addEventListener("click", async(event) => {
        const button =  event.target;
        button.disabled = true;
        try 
        {
            let src = document.getElementById("sourcetable");
            let srccol = document.getElementById("sourcecolumn");
            let dst = document.getElementById("desttable");
            let dstcol = document.getElementById("dstcolumn");
        
            if (srccol.selectedOptions[0].text === dstcol.selectedOptions[0].text)
            {
                let srctable = await grist.docApi.fetchTable(src.selectedOptions[0].value);
                if (is_Text(srctable[dstcol.selectedOptions[0].text][0]))
                    await py_Start(srctable, dst.selectedOptions[0], dstcol.selectedOptions[0].text);
                else
                    throw "columns must be Texte type";
            }
        }
        catch (error)
        {
            console.error(error)
            showErrorPopup(error)
        }
        finally
        {
            button.disabled = false
        }
    });
}

