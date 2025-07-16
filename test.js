let pyodide;

async function py_Start(src, dst, dstcol)
{
    createProgressInterface();
    showProgress();
    updateProgress(0, "Initialisation...", "Préparation du traitement");
    
    try {
        const grist = window.grist;
        py = await loadPyodide();

        await py.loadPackage(['pandas']);
        let response = await fetch("https://raw.githubusercontent.com/CandanDilovan/unique_Value_Collector/main/unique_collector.py");
        
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }

        py_code = await response.text();
        await py.runPythonAsync(py_code);
        
        py.globals.set("src", py.toPy(src));
        py.globals.set("dstcol", py.toPy(dstcol));
        console.log(typeof(dstcol))
        if (typeof(dstcol) === "string")
        {
            console.log("here");
            await py.runPythonAsync(`result = oto_unique(src, dstcol)`);
            
            const records_json = py.runPython(`result.to_json(orient="records")`);
            const records = JSON.parse(records_json);
            addto_Grist_one(records, dst, dstcol);
        }
        else
        {
            await py.runPythonAsync("result = otm_unique(src, dstcol)")
            const records_json = py.runPython("result.to_json(orient='records')");
            const records = JSON.parse(records_json);
            addto_Grist_mult(records, dst, dstcol);
        }

    } 
    catch (error) {
        console.error('Erreur dans py_Start:', error);
        showError(error.message || 'Une erreur inattendue s\'est produite');
    }
}

async function addto_Grist_mult(records, dst, dstcol) 
{
    for (let x = 0; x < records.length; x++) 
    {
        let dsttable = await grist.docApi.fetchTable(dst.value);

        let id = dsttable['id'][x]
        if (dsttable[dstcol][x] !== records[x][dstcol])
        {
            console.log(dsttable[dstcol][x])
            if (dsttable[dstcol][x])
                await grist.docApi.applyUserActions([["UpdateRecord", dst.text, id, records[x]]]);
            else
             await grist.docApi.applyUserActions([["AddRecord", dst.text, null, records[x]]]);
        }
        const stepProgress = 0 + ((x + 1) / records.length) * 20;
        updateProgress(
            Math.round(stepProgress), 
            "Ajout des enregistrements...", 
            `${x + 1}/${records.length} enregistrements ajoutés`
        );
    }
    showSuccess(records.length);
}


async function addto_Grist_one(records, dst, dstcol) 
{
    for (let x = 0; x < records.length; x++) 
    {
        let dsttable = await grist.docApi.fetchTable(dst.value);

        let id = dsttable['id'][x];
        for (let y = 0; y < dstcol.length; y++)
        {
            if (dsttable[dstcol[y]][x] !== records[x][dstcol[y]])
                console.log(dsttable[dstcol][x])
            {
                if (dsttable[dstcol[y]][x])
                    await grist.docApi.applyUserActions([["UpdateRecord", dst.text, id, records[x]]]);
                else
                    await grist.docApi.applyUserActions([["AddRecord", dst.text, null, records[x]]]);
            }
        }
        const stepProgress = 0 + ((x + 1) / records.length) * 20;
        updateProgress(
            Math.round(stepProgress), 
            "Ajout des enregistrements...", 
            `${x + 1}/${records.length} enregistrements ajoutés`
        );
    }
    showSuccess(records.length);
}


async function start() 
{
    grist.ready({
        requiredAccess: 'full',
    });
    
    console.log("docApi methods:", Object.keys(grist.docApi));
}

async function ready(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        await fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}



ready(start);
