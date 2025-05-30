let pyodide;

async function py_Start(records){
  py = await loadPyodide();
  await pyodide.loadPackage(['pandas'])

  let response = await fetch("https://candandilovan.github.io/unique_Value_Collector/unique_Collector.py")
  if (!response.ok())
      throw new TypeError(`Server error: ${errorText}`);
  py_code = await response.text();
  await py.runPythonAsync(py_code);
  
  py.globals.set("records", records);
  let test = await py.runPythonAsync(`
    from unique_Collector import test
    test(records)`);
  console.log(test)
}

}

async function start(){
    grist.ready({
      requiredAccess: 'full',
    });
    console.log("docApi methods:", Object.keys(grist.docApi));
    grist.onRecords((records) => {
      console.log(records)
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