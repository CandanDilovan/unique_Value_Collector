let pyodide;

async function py_Start(records){
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

  await grist.docApi.applyUsersActions([
    ["AddTabble", "UniqueTable", {tableName: "UniqueTable"}],
  ]);
}


async function start(){
    grist.ready({
      requiredAccess: 'full',

    });
    console.log("docApi methods:", Object.keys(grist.docApi));
    grist.onRecords((records) => {
      console.log(records);
      py_Start(records);
    })
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