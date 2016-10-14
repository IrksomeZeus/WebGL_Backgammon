var canvas;
var gl;
var colorLoc;
var modelViewLoc;
var projectionLoc;

var vertices = [];
var colors = [];
var indices = [];
var blackTriangles = [];
var whiteTriangles = [];
var theta = [];
var angles  = [];
var c = [];
var s = [];

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

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

	// Load vertices and colors for cube faces

	vertices = [
    vec4(0,0,0,1),
    vec4(0,0,0,1),
    vec4(32,0,0,1),
    vec4(32,3,0,1),
    vec4(0,3,0,1),
    vec4(0,0,-26,1),
    vec4(32,0,-26,1),
    vec4(32,3,-26,1),
    vec4(0,3,-26,1),
    vec4(1,3,-25,1),
    vec4(1,3,-1,1),
    vec4(15,3,-1,1),
    vec4(17,3,-1,1),
    vec4(31,3,-1,1),
    vec4(31,3,-25,1),
    vec4(17,3,-25,1),
    vec4(15,3,-25,1),
    vec4(1,0,-25,1),
    vec4(1,0,-1,1),
    vec4(15,0,-1,1),
    vec4(17,0,-1,1),
    vec4(31,0,-1,1),
    vec4(31,0,-25,1),
    vec4(17,0,-25,1),
    vec4(15,0,-25,1),
	];

  for (i = 3; i < 30; i++) {
    if (i % 2 === 1) {
      vertices.push(vec4(i, 0.01, -1, 1));
    } else {
      vertices.push(vec4(i, 0.01, -9, 1));
    }
  }

  for (i = 3; i < 30; i++) {
    if (i % 2 === 1) {
      vertices.push(vec4(i, 0.01, -25, 1));
    } else {
      vertices.push(vec4(i, 0.01, -17, 1));
    }
  }

  console.log(vertices.length);

	 colors = [
     vec4(178/255, 178/255, 178/255, 1.0),
     vec4(128/255, 128/255, 128/255, 1.0),
     vec4(0, 0, 0, 1),
     vec4(1, 1, 1, 1),
     vec4(80/255, 80/255, 80/255, 1)
	];

  for (i=0; i < 255; i = i + 5) {
    var factor = i/255;
    colors.push(vec4(0, factor, 1, 1));
  }

	// Load indices to represent the triangles that will draw each face

  indices = [

    // TOP of Board

    11, 16, 15,
    15, 12, 11,
    4, 10, 3,
    13, 3, 10,
    13, 14, 3,
    3, 14, 7,
    7, 14, 8,
    8, 14, 9,
    9, 10, 8,
    8, 10, 4,

    // Base
    1, 6, 2,
    1, 5, 6,

    // Front
    1, 4, 3,
    3, 2, 1,

    // FrontLeft
    11, 10, 18,
    18, 19, 11,

    // FrontRight
    13, 12, 20,
    20, 21, 13,

    // Left
    8, 4, 1,
    1, 5, 8,

    // Inner Left
    18, 10, 9,
    9, 17, 18,

    // Back
    7, 8, 5,
    5, 6, 7,

    // BackLeft
    9, 16, 24,
    24, 17, 9,

    // BackRight
    15, 14, 22,
    22, 23, 15,

    // Right
    2, 3, 7,
    7, 6, 2,

    // Inner Right
    14, 13, 21,
    21, 22, 14,

    // mid Right
    12, 15, 23,
    23, 20, 12,

    // mid Left
    16, 11, 19,
    19, 24, 16,

    // Black triangles
    47, 48, 49,
    43, 44, 45,
    39, 40, 41,
    33, 34, 35,
    29, 30, 31,
    25, 26, 27,
    54, 56, 55,
    58, 60, 59,
    62, 64, 63,
    68, 70, 69,
    72, 74, 73,
    76, 78, 77,

    // White Triangles

    49, 50, 51,
    45, 46, 47,
    41, 42, 43,
    35, 36, 37,
    31, 32, 33,
    27, 28, 29,
    52, 54, 53,
    56, 58, 57,
    60, 62, 61,
    66, 68, 67,
    70, 72, 71,
    74, 76, 75
  ];

  console.log(indices.length);

	theta[0] = 0.0;
	theta[1] = 0.0;
	theta[2] = 0.0;

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height);
	aspect = canvas.width / canvas.height;
    gl.clearColor( 0.4, 0.4, 0.4, 1.0 );
	gl.enable(gl.DEPTH_TEST);
	//projection = ortho (windowMin, windowMax, windowMin, windowMax, windowMin, windowMax+cubeSize);
	// Register event listeners for the buttons

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

	// var a=document.getElementById ("XButton");
	// a.addEventListener ("click", function() { axis = xAxis; });
	// var b=document.getElementById ("YButton");
	// b.addEventListener ("click", function () { axis = yAxis; });
	// var c=document.getElementById ("ZButton");
	// c.addEventListener ("click", function () { axis = zAxis; });
	// var d=document.getElementById ("Reset");
	// d.addEventListener ("click", function () { theta = [0.0, 0.0, 0.0]; axis = xAxis });

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

	colorLoc = gl.getUniformLocation (program, "color");
	modelViewLoc = gl.getUniformLocation (program, "modelView");
	projectionLoc  = gl.getUniformLocation (program, "projection");

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

	iBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBuffer);
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    render();
};

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	theta[axis] += 0.5;

	for (i=0; i<3; i++) {
		angles[i] = radians(theta[i]);
    if (i === 1 || i === 3){
      angles[i] = radians(0);

    } else {
      angles[i] = radians(30);
    }
    // c[i] = 0;
    // s[i] = 0;
		c[i] = Math.cos(angles[i]);
		s[i] = Math.sin(angles[i]);
	};

  t = 60;
	rx = mat4 (1.0, 0.0, 0.0, 0.0,
	           0.0, Math.cos(radians(t)), -Math.sin(radians(t)), 0.0,
			   0.0, Math.sin(radians(t)), Math.cos(radians(t)), 0.0,
			   0.0, 0.0, 0.0, 1.0);

	tz1 = mat4 (1.0, 0.0, 0.0, -16,
			   0.0, 1.0, 0.0, -1.5,
			   0.0, 0.0, 1.0, -13,
			   0.0, 0.0, 0.0, 1.0);

	tz2 = mat4 (1.0, 0.0, 0.0, 5,
			   0.0, 1.0, 0.0, -13,
			   0.0, 0.0, 1.0, 6,
			   0.0, 0.0, 0.0, 1.0);


	looking = lookAt (vec3(cubeSize2,cubeSize2,4*cubeSize), vec3(cubeSize2,cubeSize2,0), vec3(0.0, 1.0, 0.0));
	projection = perspective (45.0, aspect, 1, 10*cubeSize);
	modelView = mult(looking, mult(tz2 ,mult(rx, tz1)));
	gl.uniformMatrix4fv (modelViewLoc, false, flatten(modelView));
	gl.uniformMatrix4fv (projectionLoc, false, flatten(projection));

  gl.uniform4fv(colorLoc, colors[4]);
  for (var i=0; i<10; i++) {
    gl.drawElements( gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 3*i );
  }
  gl.uniform4fv(colorLoc, colors[0]);
  for (var i=10; i<12; i++) {
    gl.drawElements( gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 3*i );
  }
  gl.uniform4fv(colorLoc, colors[1]);
  for (var i=12; i<36; i++) {
		gl.drawElements( gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 3*i );
	}
  gl.uniform4fv(colorLoc, colors[2]);
  for (var i = 36; i < 48; i++) {
    gl.drawElements( gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 3*i );
  }
  gl.uniform4fv(colorLoc, colors[3]);
  for (var i = 48; i < 60; i++) {
    gl.drawElements( gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 3*i );
  }
	requestAnimFrame (render);
};
