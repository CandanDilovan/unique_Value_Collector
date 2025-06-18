let pyodide;

async function py_Start(src, dst, dstcol)
{
    createProgressInterface();
    showProgress();
    updateProgress(0, "Initialisation...", "Préparation du traitement");
    
    try {
        const grist = window.grist;
        console.log(grist.docApi);
        
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
        
        console.log(typeof grist.docApi.addRecords);
        
        for (let x = 0; x < records.length; x++) 
        {
          let dsttable = await grist.docApi.fetchTable(dst.value)
          console.log(dsttable[dst.text][x])
          if (dsttable[dst.text][x] !== records[x])
            await grist.docApi.applyUserActions([["AddRecord", dst.text, null, records[x]]]);
          
          const stepProgress = 80 + ((x + 1) / records.length) * 20;
          updateProgress(
              Math.round(stepProgress), 
              "Ajout des enregistrements...", 
              `${x + 1}/${records.length} enregistrements ajoutés`
          );
        }
        
        showSuccess(records.length);
        
    } catch (error) {
        console.error('Erreur dans py_Start:', error);
        showError(error.message || 'Une erreur inattendue s\'est produite');
    }
}

document.getElementById("sourcetable").addEventListener("change", col_Selector);
document.getElementById("desttable").addEventListener("change", col_Selector);
document.getElementById("dupe").addEventListener("click", async(event) => {
  try 
  {
    let src = document.getElementById("sourcetable");
    let srccol = document.getElementById("sourcecolumn");
    let dst = document.getElementById("desttable");
    let dstcol = document.getElementById("dstcolumn");
    
    console.log(dstcol.selectedOptions[0].text)
    if (srccol.selectedOptions[0].text === dstcol.selectedOptions[0].text)
      {
        let srctable = await grist.docApi.fetchTable(src.selectedOptions[0].value);
        console.log(srctable[dstcol.selectedOptions[0].text][0])
        if (is_Text(srctable[dstcol.selectedOptions[0].text][0]))
          await py_Start(srctable, dst.selectedOptions[0], dstcol.selectedOptions[0].text);
        else
          throw "columns must be Texte type";
      }
    }
    catch (error)
    {
      console.error(error)
    }
})

async function col_Selector(event) 
{
    let table = await grist.docApi.fetchTable(event.target.value);
    console.log(table);
    let srccol = null;
    
    if (event.target.id === "sourcetable")
        srccol = document.getElementById("sourcecolumn");
    else
        srccol = document.getElementById("dstcolumn");
    
    console.log(srccol);
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
    let srccol = document.getElementById("sourcecolumn");
    let dstcol = document.getElementById("dstcolumn");
    
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
