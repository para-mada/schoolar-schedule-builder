var shiftpressed = false;
var ctrlpressed = false;
var filaActual = 1;
var selectedCells = "";
var printedCells = 0;
var ultimaSeleccionada = "";
$(function(event) { 

    var materia = document.getElementById("materia");
    var edificio = document.getElementById("edificio");
    var profesor = document.getElementById("profesor");
    var aula = document.getElementById("aula");

    function loadList() {
        var data = getCookie('lista');
        filas = data.split('|');
        if(filas) {
            var lista = document.getElementById('lista');
            if (filas.length >=1) {
                lista.innerHTML+="<div class='tr-list' id='row1' onclick='setClass(this.id)'></div>";
                for (var i = 0; i < filas.length; i++) {
                    var fila = document.getElementById('row'+filaActual);
                    var columnas = filas[i].split(',');
                    if(columnas[0] == '') {
                        continue;
                    }
                    fila.innerHTML +=
                    "<div class='td-list c1'>"+columnas[0]+"</div>"+
                    "<div class='td-list c2'>"+columnas[1]+"</div>"+
                    "<div class='td-list c3'>"+columnas[2]+"</div>";
                    if(filas[i+1]) {
                        lista.innerHTML+="<div class='tr-list' onclick='setClass(this.id)' id='row"+(++filaActual)+"'></div>";
                    }
                }
            }
        }
    }

    function loadAulas() {
        var edificios = 83;
        var aulas = 5;
        for (var edificio = 65 ; edificio <= edificios ; edificio++) {
            document.getElementById('edificio').innerHTML += "<option>"+String.fromCharCode(edificio)+"</option>"
        }

        for (var aula = 1; aula <= aulas; aula++) {
            document.getElementById('aula').innerHTML += "<option>"+aula+"</option>"
        }
    }

    function loadCells() {
        var row = 2;
        if(printedCells<1){
            for (var i=1; i <= 72; i++) {
                var cell = new Cell('cell'+i);
                document.getElementById('horario').innerHTML += cell.toHTML(row);
                if(i%6==0) {
                    row++;
                }
            }
        }
    }
    loadAulas();
    loadList();
    loadCells();
});



function charge() {
    if(materia.value=="") {
        clean();
        return;
    }
    var val = "";

    var cookietemp = materia.value+","+profesor.value+","+edificio.value+aula.value+"|";
    var datos = getCookie('lista');
    if (datos) {
        val+=datos;
    }
    val+=cookietemp;
    var celdas = selectedCells.split(";");
    for (var i = celdas.length - 1; i >= 0; i--) {
        if(celdas[i]=="") {
           continue;
        }
        var cell = document.getElementById(celdas[i]);
        cell.getElementsByClassName("materia")[0].innerText = materia.value;
        cell.getElementsByClassName("profesor")[0].innerText = profesor.value;
        cell.getElementsByClassName("aula")[0].innerText = edificio.value+aula.value;
        cell.className += ' aula-'+edificio.value+aula.value;
    }
    if(!datos.includes(cookietemp)){
        loadNew(materia.value, profesor.value, edificio.value+aula.value);
        createCookie('lista', val);
    }
    clean();
    selected_clean();
}
function loadNew(mat, prof, au) {
    var id = 'row'+(++filaActual);
    lista.innerHTML+="<div class='tr-list' onclick='setClass(this.id)' id='"+id+"'></div>";
    var fila = document.getElementById(id);
    fila.innerHTML +=
    "<div class='td-list c1'>"+mat+"</div>"+
    "<div class='td-list c2'>"+prof+"</div>"+
    "<div class='td-list c3'>"+au+"</div>";
}

function setClass(rowid/*fila*/) {
    var ids = selectedCells.split(';');
    var row = document.getElementById(rowid);
    var materia = row.getElementsByTagName("div")[0];
    var profesor = row.getElementsByTagName("div")[1];
    var aula = row.getElementsByTagName("div")[2];
    for (var i = ids.length - 1; i >= 0; i--) {
        if(ids[i]=="") {
            continue;
        }
        var cell = document.getElementById(ids[i]);
        cell.getElementsByClassName("materia")[0].innerText = materia.innerText;
        cell.getElementsByClassName("profesor")[0].innerText = profesor.innerText;
        cell.getElementsByClassName("aula")[0].innerText = aula.innerText;
        cell.className += ' aula-'+aula.innerText;
    }
    clean();
    selected_clean();
}



function display() {
    document.getElementById('overlay').style.display = "grid";
}
function capitalize(text) {
    var newText = text[0].toUpperCase() + text.substring(1).toLowerCase();
    return newText;
}

function changeGroup() {
    var grupo = prompt("¿A qué grupo perteneces?");
    var cell = document.getElementById('grupo');
    cell.innerText = "Grupo "+capitalize(grupo);
}

function selected(id) {
    return selectedCells.includes(id);
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(unescape(document.cookie));
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function onkey(e) {
var key = (e.keyCode ? e.keyCode : e.which);
    switch(key) {
        case 27:
        case 192:
        case 96:
            clean();
            break;
        case 8:
            remove_selected();
            break;
        case 17:
            ctrlpressed = true;
            break;
        case 45:
            display();
            break;
        case 16:
            shiftpressed = true;
            break;
    }
    console.log("down: "+key);
}
function onrelease(e) {
    var key = (e.keyCode ? e.keyCode : e.which);
    switch(key) {
        case 17:
            ctrlpressed = false;
            break;
        case 16:
            shiftpressed = false;
            break;
    }
    console.log("up: "+key)
}
function clean() {
    materia.value = "";
    profesor.value = "";
    aula.value = "1";
    edificio.value = "A";
    document.getElementById('overlay').style.display = "none";
}
function createCookie(name, value) {
    document.cookie = (escape(name) + "=" + escape(value) +"; path=/");
}