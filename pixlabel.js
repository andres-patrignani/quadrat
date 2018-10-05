let img;
let canvas;
let filename;
let totalcols;
let totalrows;
let table;
let zoomCheckbox;
let cursorPosition;
let cursorColorValue;
let cursorColorBackground;
let pixelArrayValue;

function preload(){
    img = loadImage('public/img/example.jpg');
}


function setup(){
    pixelDensity(1);

    canvasElement = document.getElementById('canvas');
    canvas = createCanvas(canvasElement.offsetWidth,windowHeight*0.7);
    canvas.parent('canvas');
    canvas.mousePressed(getPixelValue);

    pixelArrayElement = document.getElementById('pixelArray');
    pixelArrayValue = parseFloat(pixelArrayElement.value);
    setTableRows(pixelArrayValue);
    pixelArray.addEventListener('change',function(){

        if(recordLabel.value == 0){
            r = true;
        } else {
            let r = confirm('This action will delete ' + recordLabel.value + ' records');
        }

        if (r == true) {
            pixelArrayValue = parseFloat(pixelArrayElement.value);
            setTableRows(pixelArrayValue);
            recordLabel.value = table.getRowCount();
            console.log(pixelArrayValue)
        }
    })

    

    

    btnUpload = createFileInput(gotFile);
    btnUpload.parent('fileInput');
    statusLabel = document.getElementById('statusLabel');
    cursorPosition = document.getElementById('cursorPosition');
    cursorColorValue = document.getElementById('cursorColorValue');
    cursorColorBackground = document.getElementById('cursorColorBackground');
    zoomCheckbox = document.getElementById('zoomCheckbox');
    btnClear = document.getElementById('clearTableBtn');

    btnClear.addEventListener('click', function(){
        if(recordLabel.value > 0){
            let r = confirm('Click OK to confirm the deletion of ' + recordLabel.value + ' records.');
            if (r == true) {
                table.clearRows();
                recordLabel.value = table.getRowCount();
                btnClear.disabled = true;
                //location.reload();
            }
        }
    })
    cursor(CROSS)
    pixelLabel = document.getElementById("pixelLabel");
    recordLabel = document.getElementById("recordLabel");
    downloadTableBtn = document.getElementById("downloadTableBtn");
    downloadTableBtn.addEventListener("click", function(){
        saveTable(table,'pixlabel.csv')
    });
    
    loadImageToCanvas(img);
    filename = 'example.jpg';
}

let drawOnce = false;
function draw() {
    //image(img, 0, 0, 99, 99, (mouseX-100)*img.width/canvas.width-20, mouseY*img.height/canvas.height-20, 40, 40);
    //image(img, 0, 100, 99, 99, (mouseX-100)*img.width/canvas.width-10, mouseY*img.height/canvas.height-10, 20, 20);
    if(zoomCheckbox.checked){
        image(img, 0, 0, 150, 150, mouseX*img.width/canvas.width-10, mouseY*img.height/canvas.height-10, 20, 20);
        stroke(0);
        line(75,0,75,74)
        drawOnce = true;
    } else if(!zoomCheckbox.checked && drawOnce){
        image(img, 0, 0, canvas.width, canvas.height);
        drawOnce = false;
    }

    let RGBA = get(mouseX, mouseY);
    if(mouseX >= 0 && mouseX <= canvas.width && mouseY >= 0 && mouseY <= canvas.height){
        cursorPosition.innerHTML = 'ROW: ' + floor(mouseY) + '   ' + 'COL: ' + floor(mouseX);
        cursorColorValue.innerHTML = 'R: ' + RGBA[0] + '  ' + 'G: ' + RGBA[1] + '  ' + 'B: ' + RGBA[2] + '  ' + 'A: ' + RGBA[3];
        cursorColorBackground.style.backgroundColor =  color(RGBA[0], RGBA[1], RGBA[2], RGBA[3])
    } else {
        cursorPosition.innerHTML = 'ROW: ' + '' + '   ' + 'COL: ' + '';
        cursorColorValue.innerHTML = 'R: ' + '' + '  ' + 'G: ' + '' + '  ' + 'B: ' + '' + '  ' + 'A: ' + '';
        cursorColorBackground.style.backgroundColor =  color(255, 255, 255, 255)
    }
}


function setTableRows(pixels){
    table = new p5.Table();
    table.addColumn('RECORD');
    table.addColumn('FILENAME');
    table.addColumn('LABEL');
    table.addColumn('COL');
    table.addColumn('ROW');
    table.addColumn('TOTALCOLS');
    table.addColumn('TOTALROWS');
    table.addColumn('TIMESTAMP');
    for(let i = 0; i < pixels; i++){
        let posPix = i + 1;
        table.addColumn('R'+posPix);
        table.addColumn('G'+posPix);
        table.addColumn('B'+posPix);
        table.addColumn('A'+posPix);
    }
}

function gotFile(file){
    if (file.type === 'image'){
        filename = file.name;
        img = loadImage(file.data,loadImageToCanvas);
    }
}

function loadImageToCanvas(img){
    aspectRatio = img.width / img.height;
    sideSize = floor(canvasElement.offsetWidth);
    canvas.resize(sideSize, floor(sideSize/aspectRatio));
    image(img, 0, 0, canvas.width, canvas.height);
}

function getPixelValue(){

    let posX;
    let posY;
    if(pixelArrayValue === 9.0){
        posX = [-1, 0, 1, -1, 0, 1, -1, 0, 1];
        posY = [-1, -1, -1, 0, 0, 0, 1, 1, 1];
    } else if(pixelArrayValue === 1.0){
        posX = [1];
        posY = [1];
    }

    let pointerX = floor(mouseX);
    let pointerY = floor(mouseY);

    let timestamp = new Date();
    let newRow = table.addRow();
    newRow.set('FILENAME', filename)
    newRow.set('LABEL', pixelLabel.value)
    newRow.set('COL', pointerX);
    newRow.set('ROW', pointerY);
    newRow.set('TOTALROWS', canvas.height);
    newRow.set('TOTALCOLS', canvas.width);
    newRow.set('TIMESTAMP', timestamp.toISOString());

    for(let i = 0; i < pixelArrayValue; i++){
        let posPix = i + 1;
        let RGBA = get(pointerX+posX[i], pointerY+posY[i])
        newRow.set('R'+posPix, RGBA[0]);
        newRow.set('G'+posPix, RGBA[1]);
        newRow.set('B'+posPix, RGBA[2]);
        newRow.set('A'+posPix, RGBA[3]);
    }
    
    newRow.set('RECORD', table.getRowCount())
    recordLabel.value = table.getRowCount();
    if(table.getRowCount() === 0){
        btnClear.disabled = true;
    } else {
        btnClear.disabled = false;
    }
    
}