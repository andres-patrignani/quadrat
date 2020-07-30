let canvasElement;
let canvas;
let img;
let mask;

let rows;
let cols;
let cellWidth;
let cellHeight;

let labelMode;
let activeLabelName;
let activeLabelColor;
let tableLabels;
let quadrat = {'description':'', 'rows':0, 'columns':0, 'grid':[]};
let labels = {};
let filename = 'dandelions.jpg';


function preload(){
    pixelDensity(1);
    img = loadImage('public/img/' + filename);
}


function setup(){

    // Get canvas parent element
    canvasElement = document.getElementById('canvas');

    // Resize image to fill element width
    img.resize(canvasElement.offsetWidth,0);

    // Create copy of image that will be used as mask
    mask = img

    // Create canvas spanning full DOM element width and preserving image height
    canvas = createCanvas(canvasElement.offsetWidth, img.height);
    canvas.parent(canvasElement);

    // Add mask to canvas
    image(mask, 0, 0);

    // Upload image button
    uploadImageBtnP5 = createFileInput(gotFile); // hidden in CSS
    uploadImageBtnP5.parent('uploadImageBtn')
    //uploadImageBtn = document.getElementById('uploadImageBtn').appendChild(uploadImageBtnP5.elt);

    // Create grid button
    createGridBtn = document.getElementById('createGridBtn');

    // Add grid button 
    addLabelBtn = document.getElementById('addGridBtn');
    addGridBtn.addEventListener('click', addGrid);

    // Create label button
    createLabelBtn = document.getElementById('createLabelBtn');

    // Add label button (inside create label modal)
    addLabelBtn = document.getElementById('addLabelBtn');
    addLabelBtn.addEventListener('click', addLabel);

    // Download image button
    downloadImageBtn = document.getElementById("downloadImageBtn").addEventListener("click", function(){
        if(Object.keys(quadrat).length>0){
            let fileparts = filename.split('.');
            saveCanvas(canvas, fileparts[0] + '_quadrat.' + fileparts[1])
        }
    });

    // Download table button
    downloadTableBtn = document.getElementById("downloadTableBtn");
    downloadTableBtn.addEventListener("click", function(){
        let fileparts = filename.split('.');
        saveTable(prepareTable(), fileparts[0] + '_table.csv')
    });

    // Download JSON button
    downloadJSONBtn = document.getElementById("downloadJSONBtn");
    downloadJSONBtn.addEventListener("click", function(){
        let fileparts = filename.split('.');
        saveJSON(prepareJSON(), fileparts[0] + '_json.json')
    });

    // Get value of grid and label modes
    labelMode = document.querySelector('input[name=modeControls]:checked').value;
}


function draw(){
    //console.log('X: ' + mouseX + ' Y:' + mouseY)
    // Get user selection 
    labelMode = document.querySelector('input[name=modeControls]:checked').value;

    // Chech that modals are closed to avoid highlighting cells accidentally
    modalGridOpen = document.querySelector("#modal-create-grid").classList.contains('open');
    modalLabelOpen = document.querySelector("#modal-create-label").classList.contains('open');
    modalOpen = modalGridOpen | modalLabelOpen;

    // Get list of existing labels
    let listLabels = Object.keys(labels);

    if(mouseIsPressed & !modalOpen & quadrat.hasOwnProperty('grid') & labels.hasOwnProperty(activeLabelName)){
        for (let i = 0; i < quadrat.grid.length; i++) {

            // Current cell properties
            let cellLabel = quadrat.grid[i].label;
            let cellX = quadrat.grid[i].x;
            let cellY = quadrat.grid[i].y;
            let cellWidth = quadrat.grid[i].width;
            let cellHeight = quadrat.grid[i].height;

            // Check if mouse position is inside cell
            let inCell = (mouseX > cellX) & (mouseX < cellX + cellWidth) & (mouseY > cellY) & (mouseY < cellY + cellHeight)

            // Helight and erase cells
            if(inCell & labelMode == 'highlightGrid' & cellLabel != activeLabelName){
                quadrat.grid[i].label = activeLabelName;
                quadrat.grid[i].color = activeLabelColor + '80';
                quadrat.grid[i].draw();

            } else if(inCell & labelMode == 'eraseGrid'){
                quadrat.grid[i].label = null;
                quadrat.grid[i].color = null;
                quadrat.grid[i].draw();
            }
        }

        // Count labels
        for(let j=0; j<listLabels.length; j++){
            let currentLabel = listLabels[j];
            let count = quadrat.grid.filter(k => k.label == currentLabel).length;
            let percentage;
            if(count == 0){
                percentage = 0
            } else {
                percentage = round(count / quadrat.grid.length * 100,1);
            }
            labels[currentLabel].count = count;
            labels[currentLabel].percentage = percentage;
            document.getElementById(currentLabel).children[2].innerText =  labels[currentLabel].percentage;
        }
    }
}


// function windowResized() {
//     resizeCanvas(canvasElement.offsetWidth, canvasElement.offsetHeight);
//     loadImageToCanvas(img)
//     for(let i=0; i<quadrat.grid.length; i++){
//          quadrat.grid[i].draw();
//     }
//   }


function gotFile(file){
    if (file.type === 'image'){
        filename = file.name;
        img = loadImage(file.data,loadImageToCanvas);
    }
}

function loadImageToCanvas(img){
    img.resize(canvas.width, canvas.height)
    mask = img;
    image(mask, 0, 0, canvas.width, canvas.height);
}


function addGrid(){
    let gridRows = document.getElementById('gridRows').value;
    let gridColumns = document.getElementById('gridColumns').value;
    let quadratDescription = document.getElementById('quadratDescription').value

    if(quadrat.grid.length > 0){
        let gridWarning = confirm('Proceding with this action will remove the existin grid and associated labels.')
        if(gridWarning){
            quadrat.grid = createGrid(gridRows,gridColumns);
            quadrat.rows = gridRows;
            quadrat.columns = gridColumns;
            quadrat.description = quadratDescription;
        
            loadImageToCanvas(img)
            for(let i=0; i<quadrat.grid.length; i++){
                quadrat.grid[i].draw();
            }
        }
    } else {
        quadrat.grid = createGrid(gridRows,gridColumns);
        quadrat.rows = gridRows;
        quadrat.columns = gridColumns;
        quadrat.description = quadratDescription;
    
        loadImageToCanvas(img)
        for(let i=0; i<quadrat.grid.length; i++){
            quadrat.grid[i].draw();
        }
    }
    

}


function addLabel(){

    // Get label information from DOM
    let labelName = document.getElementById('labelName').value;
    if(labelName === ''){labelName = 'Label_' + int(Object.keys(labels).length + 1)}

    let labelColor = document.getElementById('labelColor').value;
    let labelDescription = document.getElementById('labelDescription').value;

    // Add label information to quadrat variable
    labels[labelName] = {'color':labelColor, 'count':0, 'percentage':0, 'description':labelDescription};
   
    tableLabels = document.getElementById("table-labels");
    let tableLabelsBody = tableLabels.tBodies[0];
    let row = tableLabelsBody.insertRow(0);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);

    // Color cell
    cell1.style.backgroundColor = labelColor; // without the alpha channel

    // Name cell
    cell2.innerHTML = labelName;
    
    // Cover cell
    cell3.innerHTML = "0";
    cell3.classList.add('center-align');

    // Close button cell
    cell4.innerHTML = '<a class="btn-flat" style="padding: 0px;"><i class="material-icons" style="font-size=1rem">close</i></a>'
    cell4.addEventListener('click', removeLabel)

    // Add id and event listener to row
    row.addEventListener('click', selectLabel)
    row.id = labelName;

    // Current active label on label tables
    activeLabelName = labelName;
    activeLabelColor = labelColor;

    // Update table of labels
    for(let i=1; i<tableLabels.rows.length; i++){
        tableLabels.rows[i].className = '';
    }

    // Make table and download controls visible if hidden
    tableLabels.style.display = "table";
    document.getElementById("downloadControls").style.display = "block";

    // Select row by id and highlight row
    row.classList.toggle("selected-label");

}


function selectLabel(item){
    if(item){
        for(let i=1; i<tableLabels.rows.length; i++){
            tableLabels.rows[i].className = '';
        }
        item.currentTarget.classList.toggle("selected-label");
        activeLabelName = item.currentTarget.id; // Current target is the element that has the listener, no the one clicked
        activeLabelColor = labels[activeLabelName].color;
    }
}


function removeLabel(e){
    //let row = document.getElementById(activeLabel);
    let row = e.target.parentElement.parentElement.parentElement;
    removeBoolean = prompt('This action will remove all quadrat associated with label:' + row.id + '.\n Type label name to confirm deletion:')
    
    if(removeBoolean === row.id){

        // Delete label in labels object
        delete labels[row.id]

        // Remove highlighted cells from grid
        for(let i=0; i<quadrat.grid.length; i++){
            if(quadrat.grid[i].label === row.id){
                quadrat.grid[i].label = null;
                quadrat.grid[i].color = null;
                quadrat.grid[i].draw();
            }
        }

        // Remove label from table
        row.parentNode.removeChild(row);
    }

    // Stop lsitener propagation to prevent highlighting of the deleeted row
    e.stopImmediatePropagation();

    // Check if table is empty to hide it
    let tableLabelsBody = tableLabels.tBodies[0];
    if(tableLabelsBody.childElementCount == 0){
        document.getElementById("table-labels").style.display = "none";
    }
}

// Define cell class
class Cell {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.color = null; // cell color, initialize with null
        this.label = null; // cell label, initialize with null
    }

    draw(){
        if(this.label === null){
            noFill()
        } else {
            fill(this.color)
        }
        copy(img, this.x, this.y, this.width, this.height, this.x, this.y, this.width, this.height);
        stroke(color(255)) // White cell edges
        rect(this.x, this.y, this.width, this.height);
    }
}


function createGrid(rows,cols){
    let grid = [];

    // Compute cell width to span the entire image width
    cellWidth = (canvasElement.offsetWidth)/cols;
    cellHeight = (canvasElement.offsetHeight)/rows;

    for (let x = 0; x < mask.width; x += cellWidth) {
        for (let y = 0; y < mask.height; y += cellHeight ) {
            grid.push(new Cell(x,y,cellWidth,cellHeight ))
        }
    }
    return grid
}


function prepareTable(){
    let outputTable = new p5.Table();
    outputTable.addColumn('CELL');
    outputTable.addColumn('LABEL');
    outputTable.addColumn('COLOR');

    for(let i=0; i<quadrat.grid.length; i++){
        let newRow = outputTable.addRow();
        newRow.set('CELL', i+1)
        newRow.set('LABEL', quadrat.grid[i].label)
        newRow.set('COLOR', quadrat.grid[i].color)
    }
    return outputTable
}

function prepareJSON(){
    let JSON = {'labels':labels, 'quadrat':quadrat}
    return JSON
}

