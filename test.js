console.log("loadeddddddddddddddddddddddddddddddddddddddddddddddddd")
console.log("typeof grist:", typeof grist);
console.log("grist.ready exists:", typeof grist.ready);


function start(){
    grist.ready()
    console.log("testtttttttttttttttttttttttttt")
}

function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" :
      document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(start)