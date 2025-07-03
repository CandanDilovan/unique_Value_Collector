document.getElementById("oto_button").addEventListener("click", async() =>{
    try{
        const container = document.getElementById("block");

        if (document.getElementById("oto_block"))
            throw ("already loaded");
        else if (document.getElementById("otm_block"))
            container.removeChild("otm_block")

        const response = await fetch("sub_html/one-to-one.html");
        const html = await response.text();

        const tmp = document.createElement("div");
        tmp.innerHTML = html;

        const block = tmp.querySelector(".oto_block");

        container.appendChild(block);
        await oto_load();
    }
    catch(err){
        console.error(err);
    }
});

document.getElementById("otm_button").addEventListener("click", async() =>{
    const container = document.getElementById("block");
    try{

        if (document.getElementById("otm_block"))
            throw ("already loaded");
        else if (document.getElementById("oto_block"))
            container.removeChild("oto_block")

        const response = await fetch("sub_html/one-to-many.html");
        const html = await response.text();

        const tmp = document.createElement("div");
        tmp.innerHTML = html;

        const block = tmp.querySelector(".oto_block");

        container.appendChild(block)
        await oto_load();
    }
    catch(err){
        console.error(err);
    }
});
