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

  py.globals.set("records", py.toPy(records));
  let test = await py.runPythonAsync(`test(records)`);
  console.log("result of the test: ", test)

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
      op2.value = table;

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