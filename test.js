let pyodide;

async function py_Start(src, dst, dstcol)
{
    createProgressInterface();
    showProgress();
    updateProgress(0, "Initialisation...", "Préparation du traitement");
    
    try {
        const grist = window.grist;

        updateProgress(5, "Chargement de Pyodide...", "Initialisation de l'environnement Python");
        py = await loadPyodide();
        updateProgress(15, "Pyodide chargé", "Environnement Python prêt");
        
        updateProgress(20, "Chargement des packages...", "Installation de pandas");
        await py.loadPackage(['pandas']);
        updateProgress(30, "Packages chargés", "Pandas disponible");
        
        updateProgress(35, "Récupération du script...", "Téléchargement depuis GitHub");
        let response = await fetch("https://raw.githubusercontent.com/CandanDilovan/unique_Value_Collector/main/unique_collector.py");
        
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
        updateProgress(45, "Script récupéré", "Code Python téléchargé");
        
        updateProgress(50, "Préparation du code...", "Analyse du script Python");
        py_code = await response.text();
        await py.runPythonAsync(py_code);
        updateProgress(60, "Code exécuté", "Fonctions Python chargées");
        
        updateProgress(65, "Traitement des données...", "Analyse des doublons");
        py.globals.set("src", py.toPy(src));
        py.globals.set("dstcol", py.toPy(dstcol));
        await py.runPythonAsync(`result = test(src, dstcol)`);
        updateProgress(75, "Données traitées", "Résultats générés");
        
        updateProgress(78, "Conversion des résultats...", "Préparation pour Grist");
        const records_json = py.runPython(`result.to_json(orient="records")`);
        const records = JSON.parse(records_json);
        updateProgress(80, "Conversion terminée", `${records.length} enregistrements à ajouter`);
        
        for (let x = 0; x < records.length; x++) 
        {
            let dsttable = await grist.docApi.fetchTable(dst.value);

            let id = dsttable['id'][x]
            if (dsttable[dstcol][x] !== records[x][dstcol])
                console.log(dsttable[dstcol][x])
                if (dsttable[dstcol][x])
                    await grist.docApi.applyUserActions([["UpdateRecord", dst.text, id, records[x]]]);
                else
                    await grist.docApi.applyUserActions([["AddRecord", dst.text, null, records[x]]]);

            const stepProgress = 80 + ((x + 1) / records.length) * 20;
            updateProgress(
                Math.round(stepProgress), 
                "Ajout des enregistrements...", 
                `${x + 1}/${records.length} enregistrements ajoutés`
            );
        }
        showSuccess(records.length);
    } 
    catch (error) {
        console.error('Erreur dans py_Start:', error);
        showError(error.message || 'Une erreur inattendue s\'est produite');
    }
}

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

async function start() 
{
    grist.ready({
        requiredAccess: 'full',
    });
    
    console.log("docApi methods:", Object.keys(grist.docApi));
    const tables = await grist.docApi.listTables();
    
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
}

async function ready(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        await fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready(start);
