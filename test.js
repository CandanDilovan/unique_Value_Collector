console.log("loadeddddddddddddddddddddddddddddddddddddddddddddddddd")
console.log("typeof grist:", typeof grist);
console.log("grist.ready exists:", typeof grist.ready);

setTimeout(() => {
  grist.ready(() => {
    console.log("🎉 INSIDE grist.ready");
    grist.setHeight(300);
  });
}, 0);