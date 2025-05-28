console.log("loadeddddddddddddddddddddddddddddddddddddddddddddddddd")
console.log("typeof grist:", typeof grist);
console.log("grist.ready exists:", typeof grist.ready);

if (typeof grist !== undefined){

    grist.ready(() => {
        console.log('testtttttttttttttttttttttttttttttttttttttttttttttttttttt');
        grist.setTitle("readyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
    });
}
else {
    console.log("nope sorry bruvs")
}