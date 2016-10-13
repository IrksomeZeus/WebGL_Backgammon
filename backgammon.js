var canvas;
var gl;
var colorLoc;
var modelViewLoc;
var projectionLoc;

var vertices = [];
var colors = [];
var indices = [];
var theta = [];
var angles  = [];
var c = [];
var s = [];

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

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

	// Load vertices and colors for cube faces

	vertices = [
	   vec4(0.0, 0.0, cubeSize, 1.0),
	   vec4(0.0, cubeSize, cubeSize, 1.0),
	   vec4(cubeSize, cubeSize, cubeSize, 1.0),
	   vec4(cubeSize, 0.0, cubeSize, 1.0),
	   vec4(0.0, 0.0, 0.0, 1.0),
	   vec4(0.0, cubeSize, 0.0, 1.0),
	   vec4(cubeSize, cubeSize, 0.0, 1.0),
	   vec4(cubeSize, 0.0, 0.0, 1.0)
	];
	 colors = [
	    vec4(1.0, 0.0, 0.0, 1.0),  // red
		vec4(1.0, 1.0, 0.0, 1.0),  // yellow
		vec4(0.0, 1.0, 0.0, 1.0),  // green
		vec4(0.0, 0.0, 1.0, 1.0),  // blue
		vec4(1.0, 0.0, 1.0, 1.0),  // magenta
		vec4(0.0, 1.0, 1.0, 1.0)   // cyan
	];

	// Load indices to represent the triangles that will draw each face

	indices = [
	   1, 0, 3, 3, 2, 1,  // front face
	   2, 3, 7, 7, 6, 2,  // right face
	   3, 0, 4, 4, 7, 3,  // bottom face
	   6, 5, 1, 1, 2, 6,  // top face
	   4, 5, 6, 6, 7, 4,  // back face
	   5, 4, 0, 0, 1, 5   // left face
	];

	theta[0] = 0.0;
	theta[1] = 0.0;
	theta[2] = 0.0;

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
	aspect = canvas.width / canvas.height;
    gl.clearColor( 0.7, 0.7, 0.7, 1.0 );
	gl.enable(gl.DEPTH_TEST);
	//projection = ortho (windowMin, windowMax, windowMin, windowMax, windowMin, windowMax+cubeSize);
	// Register event listeners for the buttons

	var a=document.getElementById ("XButton");
	a.addEventListener ("click", function() { axis = xAxis; });
	var b=document.getElementById ("YButton");
	b.addEventListener ("click", function () { axis = yAxis; });
	var c=document.getElementById ("ZButton");
	c.addEventListener ("click", function () { axis = zAxis; });
	var d=document.getElementById ("Reset");
	d.addEventListener ("click", function () { theta = [0.0, 0.0, 0.0]; axis = xAxis });

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

	colorLoc = gl.getUniformLocation (program, "color");
	modelViewLoc = gl.getUniformLocation (program, "modelView");
	projectionLoc  = gl.getUniformLocation (program, "projection");

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

	var iBuffer = gl.createBuffer();
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
		c[i] = Math.cos(angles[i]);
		s[i] = Math.sin(angles[i]);
	}

	rx = mat4 (1.0, 0.0, 0.0, 0.0,
	           0.0, c[0], -s[0], 0.0,
			   0.0, s[0], c[0], 0.0,
			   0.0, 0.0, 0.0, 1.0);

	ry = mat4 (c[1], 0.0, s[1], 0.0,
			   0.0, 1.0, 0.0, 0.0,
			   -s[1], 0.0, c[1], 0.0,
			   0.0, 0.0, 0.0, 1.0);

	rz = mat4 (c[2], -s[2], 0.0, 0.0,
			   s[2], c[2], 0.0, 0.0,
			   0.0, 0.0, 1.0, 0.0,
			   0.0, 0.0, 0.0, 1.0);

	tz1 = mat4 (1.0, 0.0, 0.0, -cubeSize2,
			   0.0, 1.0, 0.0, -cubeSize2,
			   0.0, 0.0, 1.0, -cubeSize2,
			   0.0, 0.0, 0.0, 1.0);

	tz2 = mat4 (1.0, 0.0, 0.0, cubeSize2,
			   0.0, 1.0, 0.0, cubeSize2,
			   0.0, 0.0, 1.0, cubeSize2,
			   0.0, 0.0, 0.0, 1.0);

	looking = lookAt (vec3(cubeSize2,cubeSize2,4*cubeSize), vec3(cubeSize2,cubeSize2,0), vec3(0.0, 1.0, 0.0));
	projection = perspective (45.0, aspect, 1, 10*cubeSize);
	rotation = mult (rz, mult(ry, rx));
	modelView = mult(looking, mult(tz2, mult (rotation, tz1)));
	gl.uniformMatrix4fv (modelViewLoc, false, flatten(modelView));
	gl.uniformMatrix4fv (projectionLoc, false, flatten(projection));
	for (var i=0; i<6; i++) {
		gl.uniform4fv (colorLoc, colors[i]);
		gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 6*i );
	}
	requestAnimFrame (render);
};
