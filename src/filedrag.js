import EM from 'EventEmitter';
export let em;
export function Init(el) {
    em = new EM();

    console.log("Listen on: ", el);
    el.addEventListener("dragover", FileDragHover, false);
    el.addEventListener("dragleave", FileDragHover, false);
    el.addEventListener("drop", FileSelectHandler, false);
}

function FileDragHover(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.type == "dragover")
        e.target.classList.add("hover");
    else
        e.target.classList.remove("hover");
}

function FileSelectHandler(e) {
    e.stopPropagation();
    e.preventDefault();
    // cancel event and hover styling
    FileDragHover(e);

    // fetch FileList object
    var files = e.target.files || e.dataTransfer.files;

    // process all File objects
    for (var i = 0; i < files.length; i++) {
        let f = files[i];
        var type;

        if (f.type.indexOf("audio") != -1)
            type = "audio";
        else
            continue;

        console.log(type);
    }

    em.emit("loaded", files.length);
}