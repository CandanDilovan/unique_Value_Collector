let pyodide;

function createProgressInterface() {
    const container = document.createElement('div');
    container.id = 'progress-container';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 350px;
        background: white;
        border: 2px solid #ddd;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-family: Arial, sans-serif;
        display: none;
    `;

    const title = document.createElement('div');
    title.style.cssText = `
        font-size: 16px;
        font-weight: bold;
        color: #333;
        margin-bottom: 15px;
        text-align: center;
    `;
    title.textContent = 'Traitement en cours...';

    const progressBar = document.createElement('div');
    progressBar.id = 'progress-bar-container';
    progressBar.style.cssText = `
        width: 100%;
        height: 25px;
        background-color: #f0f0f0;
        border-radius: 12px;
        overflow: hidden;
        margin-bottom: 10px;
        border: 1px solid #ddd;
    `;

    const progressFill = document.createElement('div');
    progressFill.id = 'progress-fill';
    progressFill.style.cssText = `
        width: 0%;
        height: 100%;
        background: linear-gradient(90deg, #4CAF50, #45a049);
        transition: width 0.4s ease;
        border-radius: 12px;
    `;

    const statusMessage = document.createElement('div');
    statusMessage.id = 'status-message';
    statusMessage.style.cssText = `
        font-size: 14px;
        color: #555;
        margin-bottom: 8px;
        min-height: 20px;
    `;

    const detailsText = document.createElement('div');
    detailsText.id = 'details-text';
    detailsText.style.cssText = `
        font-size: 12px;
        color: #777;
        text-align: center;
    `;

    progressBar.appendChild(progressFill);
    container.appendChild(title);
    container.appendChild(statusMessage);
    container.appendChild(progressBar);
    container.appendChild(detailsText);
    document.body.appendChild(container);
}

function showProgress() {
    const container = document.getElementById('progress-container');
    if (container) {
        container.style.display = 'block';
    }
}

function updateProgress(percentage, message, details = '') {
    const fill = document.getElementById('progress-fill');
    const status = document.getElementById('status-message');
    const detailsEl = document.getElementById('details-text');
    
    if (fill) fill.style.width = percentage + '%';
    if (status) status.textContent = message;
    if (detailsEl) detailsEl.textContent = details;
}

function showSuccess(recordsCount) {
    const container = document.getElementById('progress-container');
    const title = container.querySelector('div');
    
    if (container && title) {
        container.style.background = '#d4edda';
        container.style.borderColor = '#28a745';
        title.textContent = '✅ Traitement terminé !';
        title.style.color = '#155724';
        
        updateProgress(100, `${recordsCount} enregistrements ajoutés avec succès`, 'Cliquez pour fermer');
        
        container.style.cursor = 'pointer';
        container.onclick = () => container.remove();
        
        setTimeout(() => {
            if (container.parentNode) {
                container.remove();
            }
        }, 5000);
    }
}

function showError(errorMessage) {
    const container = document.getElementById('progress-container');
    const title = container.querySelector('div');
    
    if (container && title) {
        container.style.background = '#f8d7da';
        container.style.borderColor = '#dc3545';
        title.textContent = '❌ Erreur';
        title.style.color = '#721c24';
        
        updateProgress(0, errorMessage, 'Cliquez pour fermer');
        
        container.style.cursor = 'pointer';
        container.onclick = () => container.remove();
        
        setTimeout(() => {
            if (container.parentNode) {
                container.remove();
            }
        }, 8000);
    }
}

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
        
        for (let x = 0; x < records.length; x++) {
            await grist.docApi.applyUserActions([["AddRecord", dst, null, records[x]]]);
            
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
  
  let src = document.getElementById("sourcetable");
  let srccol = document.getElementById("sourcecolumn");
  let dst = document.getElementById("desttable");
  let dstcol = document.getElementById("dstcolumn");

  console.log(dstcol.selectedOptions[0].text)
  if (srccol.selectedOptions[0].text === dstcol.selectedOptions[0].text)
  {
    let srctable = await grist.docApi.fetchTable(src.selectedOptions[0].value); 
    let dsttable = await grist.docApi.fetchTable(dst.selectedOptions[0].value);
    console.log(srctable.columns)
    for (const col of srctable.columns)
    {
      console.log(col.type)
    }
    await py_Start(srctable, dst.selectedOptions[0].text, dstcol.selectedOptions[0].text);
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
