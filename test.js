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
