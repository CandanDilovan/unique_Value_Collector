
async function start(){
    grist.ready({
      requiredAccess: 'full',
    });
    // let tables = await grist.docApi.listTables();
    console.log("docApi methods:", Object.keys(grist.docApi));
    // console.log(tables)
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