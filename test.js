console.log("loadeddddddddddddddddddddddddddddddddddddddddddddddddd")
console.log("typeof grist:", typeof grist);
console.log("grist.ready exists:", typeof grist.ready);


async function start(){
    grist.ready({
      requiredAccess: 'read table',
    });
    let tables = await grist.docApi.listTables();
    console.log("docApi methods:", Object.keys(grist.docApi));
    console.log("testtttttttttttttttttttttttttt");
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