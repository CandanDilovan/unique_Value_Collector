let pyodide;

async function py_Start(src, dst){
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

  console.log(dst, src, src.textContent)

  console.log(records[0])
  console.log(typeof grist.docApi.addRecords);
  await grist.docApi.addRecords({tableId: dst, records: records[0]});
}

document.getElementById("dupe").addEventListener("click", async(event) => {
  
  src = document.getElementById("sourcetable");
  dst = document.getElementById("desttable");

  if (src.selectedOptions[0].text + "_dupe" === dst.selectedOptions[0].text)
  {
    srctable = await grist.docApi.fetchTable(src.selectedOptions[0].value); 
    dsttable = await grist.docApi.fetchTable(dst.selectedOptions[0].value);
    await py_Start(srctable, dst.selectedOptions[0].text);
  }
})


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