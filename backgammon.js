var canvas;
var gl;
var colorLoc;
var modelViewLoc;
var projectionLoc;

var currVertices = [];

var currIndices = [];

var blackTriangles = [];
var whiteTriangles = [];
var angles = [];

var boardWidth = 32;
var boardHeight = 26;
var boardDepth = 4;

var cubeSize = 10;
var cubeSize2 = cubeSize / 2.0;
var windowMin = -cubeSize2;
var windowMax = cubeSize + cubeSize2;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;

var projection;
var modelView;
var aspect;

var iBuffer;

window.onload = function init() {
  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }
  //
  //  Configure WebGL
  //
  gl.viewport(0, 0, canvas.width, canvas.height);
  aspect = canvas.width / canvas.height;
  gl.clearColor(0.4, 0.4, 0.4, 1.0);
  gl.enable(gl.DEPTH_TEST);

  var game = new Board();
  var pieces = game.getPieces();
  currVertices = currIndices.concat(vertices);
  currVertices = currVertices.concat(pieces[0]);
  currVertices = currVertices.concat(pieces[1]);
  currIndices = currIndices.concat(indices);
  currIndices = currIndices.concat(pieces[2]);
  currIndices = currIndices.concat(pieces[3]);

  console.log(currVertices.length);

  console.log(currIndices.length);

  console.log(pieces[0].length);

  console.log(pieces[2].length);

  var die1 = document.getElementById("Die1");
  var die2 = document.getElementById("Die2");
  var rollButton = document.getElementById("Roll");
  rollButton.addEventListener("click", function() {

    var val1 = Math.ceil(6 * Math.random());
    var val2 = Math.ceil(6 * Math.random());

    console.log(val1, val2);

    die1.textContent = parseInt(val1);
    die2.textContent = parseInt(val2);

  })

  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  colorLoc = gl.getUniformLocation(program, "color");
  modelViewLoc = gl.getUniformLocation(program, "modelView");
  projectionLoc = gl.getUniformLocation(program, "projection");

  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(currVertices), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  iBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(currIndices), gl.STATIC_DRAW);

  render();
};

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  t = 75;
  rx = mat4(1.0, 0.0, 0.0, 0.0,
    0.0, Math.cos(radians(t)), -Math.sin(radians(t)), 0.0,
    0.0, Math.sin(radians(t)), Math.cos(radians(t)), 0.0,
    0.0, 0.0, 0.0, 1.0);

  tz1 = mat4(1.0, 0.0, 0.0, -16,
    0.0, 1.0, 0.0, -1.5,
    0.0, 0.0, 1.0, -13,
    0.0, 0.0, 0.0, 1.0);

  tz2 = mat4(1.0, 0.0, 0.0, 5,
    0.0, 1.0, 0.0, -18,
    0.0, 0.0, 1.0, 0,
    0.0, 0.0, 0.0, 1.0);


  looking = lookAt(vec3(cubeSize2, cubeSize2, 4 * cubeSize), vec3(cubeSize2,
    cubeSize2, 0), vec3(0.0, 1.0, 0.0));
  projection = perspective(45.0, aspect, 1, 10 * cubeSize);
  modelView = mult(looking, mult(tz2, mult(rx, tz1)));
  gl.uniformMatrix4fv(modelViewLoc, false, flatten(modelView));
  gl.uniformMatrix4fv(projectionLoc, false, flatten(projection));

  gl.uniform4fv(colorLoc, colors[4]);
  for (var i = 0; i < 10; i++) {
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 3 * i);
  }
  gl.uniform4fv(colorLoc, colors[0]);
  for (var i = 10; i < 12; i++) {
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 3 * i);
  }
  gl.uniform4fv(colorLoc, colors[1]);
  for (var i = 12; i < 36; i++) {
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 3 * i);
  }
  gl.uniform4fv(colorLoc, colors[2]);
  for (var i = 36; i < 48; i++) {
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 3 * i);
  }
  gl.uniform4fv(colorLoc, colors[3]);
  for (var i = 48; i < 60; i++) {
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 3 * i);
  }
  gl.uniform4fv(colorLoc, colors[5]);
  for (var i = 60; i < 90; i++) {
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 3 * i);
  }
  gl.uniform4fv(colorLoc, colors[6]);
  for (var i = 90; i < 300; i++) {
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 3 * i);
  }
  requestAnimFrame(render);
};
