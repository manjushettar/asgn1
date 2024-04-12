// ColoredPoints.js
// Vertex shader program
var VSHADER_SOURCE =`
    uniform float u_size;
    attribute vec4 a_Position;
    void main() {
      gl_Position = a_Position;
      gl_PointSize = u_size;
    }`

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
      gl_FragColor = u_FragColor;
    }`

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_size;

function setupWebGL() {
    canvas = document.getElementById('webgl');

    gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
}

function connectVariablestoGLSL(){
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        // ...
        console.log('Failed to initialize shaders.');
        return;
    }
    
    // Get the storage location of a_Position variable
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0){
        // ...
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    // Get the storage location of u_FragColor variable
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if(!u_FragColor){
        // ...
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    u_size = gl.getUniformLocation(gl.program, 'u_size');
    if(!u_size){
        console.log('Failed to get the storage location of u_size');
        return;
    }
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2; 
const STAR = 3;
const HEART = 4;

let g_selectedColor = [1.0,1.0,1.0,1.0];
let g_selectedSize = 5;
let g_segment = 10;
let g_selectedType = POINT;
let draw = false;
function addActionsForHTMLUI(){
    document.getElementById('green').onclick = function() { g_selectedColor = [0.0,1.0,0.0,1.0]; };
    document.getElementById('red').onclick = function() { g_selectedColor = [1.0,0.0,0.0,1.0]; };
    document.getElementById('clearButton').onclick = function() { draw = false; g_shapesList = []; renderAllShapes(); };  

    document.getElementById('pointButton').onclick = function() { g_selectedType = POINT; };
    document.getElementById('triangleButton').onclick = function() { g_selectedType = TRIANGLE; };
    document.getElementById('circleButton').onclick = function() { g_selectedType = CIRCLE; };
    document.getElementById('drawButton').onclick = function() { drawPic(); draw = true };


    document.getElementById('redSlide').addEventListener('mouseup', function(){g_selectedColor[0] = this.value / 100;});
    document.getElementById('greenSlide').addEventListener('mouseup', function(){g_selectedColor[1] = this.value / 100;});
    document.getElementById('blueSlide').addEventListener('mouseup', function(){g_selectedColor[2] = this.value / 100;});

    document.getElementById('sizeSlide').addEventListener('mouseup', function(){g_selectedSize = this.value;});

    document.getElementById('starButton').onclick = function() { g_selectedType = STAR;};
    document.getElementById('heartButton').onclick = function() { g_selectedType = HEART;};
}


function main() {
    // ...
    // Initialize shaders
    setupWebGL() 
    
    connectVariablestoGLSL()

    addActionsForHTMLUI()
    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) }};
    canvas.onmousemove

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // ...
}

var g_shapesList = [];


function click(ev) {
    let [x,y] = convertCoordinatesEventToGL(ev)

    let point;
    if(g_selectedType == POINT){
        point = new Point();
    }
    else if(g_selectedType == TRIANGLE){
        point = new Triangle();
    }
    else if(g_selectedType == CIRCLE){
        point = new Circle();
    }
    else if(g_selectedType == STAR){
        point = new Star();
    }
    else if(g_selectedType == HEART){
        point = new Heart();
    }
    point.position = [x, y];
    point.color = g_selectedColor.slice();
    point.size = g_selectedSize;
    g_shapesList.push(point)


    renderAllShapes()
}

function convertCoordinatesEventToGL(ev){
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

   return ([x,y])
}

function renderAllShapes(){
    //var startTime = performance.now()
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    if(draw){
        drawPic()
    }
    var len = g_shapesList.length;
    for(var i = 0; i < len; i++) {
        g_shapesList[i].render()
    }
}

function drawPic() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const triangles = [
        //trunk
        [-0.6, -0.8, -0.4, -0.8, -0.6, -0.2],
        [-0.6, -0.2, -0.4, -0.8, -0.4, -0.2],
        [-0.2, -0.8, 0.0, -0.8, -0.2, -0.2],
        [-0.2, -0.2, 0.0, -0.8, 0.0, -0.2],
        //tree
        [-0.8, -0.2, -0.5, 0.4, -0.2, -0.2],
        [-0.4, -0.2, -0.1, 0.4, 0.2, -0.2],
        //sun
        [0.6, 0.6, 0.7, 0.5, 0.8, 0.6],
        [0.6, 0.6, 0.7, 0.7, 0.8, 0.6],
        //grass
        [-1.0, -1.0, 1.0, -1.0, -1.0, -0.8],
        [-1.0, -0.8, 1.0, -1.0, 1.0, -0.8],
    ];

    const colors = [
        [0.6, 0.4, 0.2, 1.0],
        [0.6, 0.4, 0.2, 1.0],
        [0.6, 0.4, 0.2, 1.0],
        [0.6, 0.4, 0.2, 1.0],
        [0.0, 0.6, 0.0, 1.0],
        [0.0, 0.6, 0.0, 1.0],
        [1.0, 1.0, 0.0, 1.0],
        [1.0, 1.0, 0.0, 1.0],
        [0.0, 0.8, 0.0, 1.0],
        [0.0, 0.8, 0.0, 1.0],
    ];

    for (let i = 0; i < triangles.length; i++) {
        const [x1, y1, x2, y2, x3, y3] = triangles[i];
        const [r, g, b, a] = colors[i];

        gl.uniform4f(u_FragColor, r, g, b, a);

        drawTriangle([x1, y1, x2, y2, x3, y3]);
    }
}
