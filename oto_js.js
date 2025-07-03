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
        showError(error.message)
    }
    finally
    {
        button.disabled = false
    }
})

async function col_Selector(event) 
{
    let table = await grist.docApi.fetchTable(event.target.value);
    let srccol = null;
    
    if (event.target.id === "sourcetable")
        srccol = document.getElementById("sourcecolumn");
    else
        srccol = document.getElementById("dstcolumn");
    
    srccol.innerHTML = '';
    
    for (const col of Object.keys(table))
    {
        const op = document.createElement("option");
        op.value = col;
        op.textContent = col;
        srccol.appendChild(op);
    }
}

