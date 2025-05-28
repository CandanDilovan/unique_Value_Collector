console.log("loadeddddddddddddddddddddddddddddddddddddddddddddddddd")


if (typeof grist !== undefined){

    grist.ready(() => {
        console.log('testtttttttttttttttttttttttttttttttttttttttttttttttttttt');
        grist.setTitle("readyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
    });
}
else {
    console.log("nope sorry bruvs")
}