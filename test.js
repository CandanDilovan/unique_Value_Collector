let pyodide;

async function py_Start(src, dst, dstcol){
  const grist = window.grist;
  console.log(grist.docApi)
  py = await loadPyodide();
  await py.loadPackage(['pandas'])

  let response = await fetch("https://raw.githubusercontent.com/CandanDilovan/unique_Value_Collector/main/unique_collector.py")
  console.log(response.ok)
  if (!response.ok)
    throw new TypeError(`Server error`);
  py_code = await response.text();
  await py.runPythonAsync(py_code);

  py.globals.set("src", py.toPy(src));
  await py.runPythonAsync(`result = test(src)`);
  const records_json = py.runPython(`result.to_json(orient="records")`);
  const records = JSON.parse(records_json);

  console.log(typeof grist.docApi.addRecords);
  for (let x = 0; x < records.length; x++)
    await grist.docApi.applyUserActions([["AddRecord", dst, null, {[dstcol]: records[x]}]]);
}

document.getElementById("dupe").addEventListener("click", async(event) => {
  
  let src = document.getElementById("sourcecolumn");
  let dst = document.getElementById("desttable")
  let dstcol = document.getElementById("dstcolumn");



  if (src.selectedOptions[0].text === dstcol.selectedOptions[0].text)
  {
    let srctable = await grist.docApi.fetchTable(src.selectedOptions[0].value); 
    let dsttable = await grist.docApi.fetchTable(dst.selectedOptions[0].value);
    await py_Start(srctable, dst.selectedOptions[0].text, dstcol.selectedOptions[0].text);
  }
})

document.getElementById("sourcetable").addEventListener("change", col_Selector)
document.getElementById("desttable").addEventListener("change", col_Selector)


async function col_Selector(event) 
{
  let table = await grist.docApi.fetchTable(event.target.value);
  let srccol = null;

  if (event.target.id === "sourcetable") 
    srccol = document.getElementById("sourcecolumn");
  else
    srccol = document.getElementById("dstcolumn");
  console.log(srccol)
  srccol.innerHTML = ''
  
  for (const col of Object.keys(table))
  {
    const op = document.createElement("option");
    op.value = col;
    op.textContent = col;
    srccol.appendChild(op);
  }
}


async function start(){
    grist.ready({
      requiredAccess: 'full',
    });
    console.log("docApi methods:", Object.keys(grist.docApi));
    const tables = await grist.docApi.listTables();

    let srcdrop = document.getElementById("sourcetable");
    let dstdrop = document.getElementById("desttable")

    for (const table of tables){
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
  if (document.attachEvent ? document.readyState === "complete" :
      document.readyState !== "loading"){
    await fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(start)

//to do :
//expliquer le fonctionnement dans le readme
//mieux parser les colones pour ne pas prendre en compte les réferences déjà existante
//empêcher l'envoie de table qui ne sont pas des dupliquer de la table source
//barre de chargement
//optimisation/augmentation de la vitesse d'ajout des lignes dans la table
//
