function preload(){

}

let canvas;
let loadedImg;
let thereIsImage = false;
let counter = 0;
let table = new p5.Table();
table.addColumn('RECORD');
table.addColumn('LABEL');
table.addColumn('X');
table.addColumn('Y');
table.addColumn('TIMESTAMP');
for(let i=0; i<9; i++){
    let posPix = i + 1;
    table.addColumn('R'+posPix);
    table.addColumn('G'+posPix);
    table.addColumn('B'+posPix);
    table.addColumn('A'+posPix);
}


function setup(){
    canvasElement = document.getElementById('canvas');

    pixelDensity(1);
    canvas = createCanvas(canvasElement.offsetWidth,windowHeight*0.7);
    canvas.parent('canvas');
    canvas.mousePressed(getPixelValue);
    btnUpload = createFileInput(gotFile);
    btnUpload.parent('fileInput');
    statusLabel = document.getElementById('statusLabel');
    btnClear = document.getElementById('clearTableBtn');
    btnClear.addEventListener('click', function(){
        if(btnClear.classList[2] === "is-outlined"){
            btnClear.classList.remove("is-outlined");
            statusLabel.innerHTML = 'Click one more time the "CLEAR" button to wipe out all the data and refresh the page.';
        } else {
            table.clearRows();
            counterLabel.value = table.getRowCount();
            location.reload();
        }
    })

    background(250)
    cursor(CROSS)
    textSize(32);
    text('Load an image to start', canvasElement.offsetWidth/2-200, windowHeight*0.7/2);
    pixelLabel = document.getElementById("pixelLabel");
    counterLabel = document.getElementById("counterLabel");
    downloadTableBtn = document.getElementById("downloadTableBtn");
    downloadTableBtn.addEventListener("click", function(){
        saveTable(table,'pixeldata.csv')
    });

}


function draw() {
    // if(thereIsImage){
    //     clear()
    //     image(loadedImg, 0, 0, canvas.width, canvas.height);
    //     image(loadedImg, mouseX-80, mouseY-80, 160, 160, mouseX*loadedImg.width/canvas.width-9, mouseY*loadedImg.height/canvas.height-9, 19, 19);
    //     //console.log(mouseX*(loadedImg.width/canvas.width))
    // }
}

function gotFile(file){
    if (file.type === 'image'){
        loadImage(file.data,function(img){
            loadedImg = img;
            aspectRatio = img.width / img.height;
            sideSize = canvasElement.offsetWidth;
            canvas.resize(sideSize, sideSize/aspectRatio);
            console.log(img.width)
            console.log(img.height)
            console.log('X: '+sideSize)
            console.log('Y: '+sideSize/aspectRatio)
            console.log('AR: '+aspectRatio)
            image(img, 0, 0, canvas.width, canvas.height);
            //thereIsImage = true;
        })
    }
}

function getPixelValue(){

    let posX = [-1, 0, 1, -1, 0, 1, -1, 0, 1];
    let posY = [-1, -1, -1, 0, 0, 0, 1, 1, 1];
    let pointerX = floor(mouseX);
    let pointerY = floor(mouseY);

    let timestamp = new Date();
    let newRow = table.addRow();
    
    newRow.set('LABEL', pixelLabel.value)
    newRow.set('X', pointerX);
    newRow.set('Y', pointerY);
    newRow.set('TIMESTAMP', timestamp.toISOString());

    for(let i = 0; i < 9; i++){
        let posPix = i + 1;
        let RGBA = get(pointerX+posX[i], pointerY+posY[i])
        newRow.set('R'+posPix, RGBA[0]);
        newRow.set('G'+posPix, RGBA[1]);
        newRow.set('B'+posPix, RGBA[2]);
        newRow.set('A'+posPix, RGBA[3]);
        if(i==4){
            console.log(RGBA)
        }
    }
    
    newRow.set('RECORD', table.getRowCount())
    counterLabel.value = table.getRowCount();
    if(table.getRowCount() === 0){
        btnClear.disabled = true;
    } else {
        btnClear.disabled = false;
    }
    
}