import EM from 'EventEmitter';
export let em;
export function Init(el) {
    em = new EM();

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
    FileDragHover(e);

    var files = e.target.files || e.dataTransfer.files;

    for (var i = 0; i < files.length; i++) {
        let file = files[i];

        // if (file.type.indexOf("audio") == -1)
        //     continue;

        var reader = new FileReader();
        reader.onload = function (e) {
            em.emit("loaded", file, e.target.result);
        }
        reader.readAsDataURL(file);
    }
}