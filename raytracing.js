// Chase Bishop & Austin Yates
// Ray Tracing
var gl;
var imageData;
var height;
var width;
var con;
var scene;
var planeCount = 0;
var surfaceCount = 0;
var theta;
var r;
window.onload = function init() {
  var c = document.getElementById('gl-canvas');

  width = 640 * 0.5;
  height = 480 * 0.5;
  c.width = width;
  c.height = height;
  c.style.cssText = 'width:' + (width * 2) + 'px;height:' + (height * 2) + 'px';
  con = c.getContext('2d');
  imageData = con.getImageData(0, 0, width, height);

  scene = {};

  scene.camera = {
    point: {
      x: -5,
      y: -5,
      z: 12
    },
    fieldOfView: 45,
    vector: {
      x: 0,
      y: 1.5,
      z: 0
    }
  };

  scene.lights = [{
    x: -30,
    y: -30,
    z: 20
  }];
  r = 1.5;
  theta = 0;
  var numSpheres = 3;
  var offset = Math.PI / 180 * 360 / numSpheres;
  scene.objects = [{
    type: 'plane',
    pointOne: {
      x: 3,
      y: -3,
      z: 3
    },
    pointTwo: {
      x: 3,
      y: -3,
      z: -6
    },
    pointThree: {
      x: 3,
      y: 3,
      z: -6
    },
    pointFour: {
      x: 3,
      y: 3,
      z: 3
    },
    color: {
      x: 200,
      y: 200,
      z: 300
    },
    specular: .5,
    lambert: 0.7,
    ambient: 0.4
  }, {
    type: 'plane',
    pointOne: {
      x: 3,
      y: 3,
      z: 3
    },
    pointTwo: {
      x: 3,
      y: 3,
      z: -6
    },
    pointThree: {
      x: -3,
      y: 3,
      z: -6
    },
    pointFour: {
      x: -3,
      y: 3,
      z: 3
    },
    color: {
      x: 300,
      y: 200,
      z: 200
    },
    specular: .5,
    lambert: 0.7,
    ambient: 0.4
  }, {
    type: 'plane',
    pointOne: {
      x: -3,
      y: -3,
      z: -6
    },
    pointTwo: {
      x: 3,
      y: -3,
      z: -6
    },
    pointThree: {
      x: 3,
      y: 3,
      z: -6
    },
    pointFour: {
      x: -3,
      y: 3,
      z: -6
    },
    color: {
      x: 200,
      y: 300,
      z: 200
    },
    specular: .5,
    lambert: 0.7,
    ambient: 0.4
  }, {
    type: 'sphere',
    point: {
      x: r * Math.cos(theta),
      y: 1.5,
      z: r * Math.sin(theta) - 1.5
    },
    color: {
      x: 255,
      y: 255,
      z: 0
    },
    specular: 0.2,
    lambert: 0.7,
    ambient: 0.1,
    radius: 1,
    angle: 0
  }, {
    type: 'sphere',
    point: {
      x: r * Math.cos(theta + offset),
      y: 1.5,
      z: r * Math.sin(theta + offset) - 1.5
    },
    color: {
      x: 255,
      y: 0,
      z: 0
    },
    specular: 0.2,
    lambert: 0.7,
    ambient: 0.1,
    radius: 1,
    angle: offset
  }, {
    type: 'sphere',
    point: {
      x: r * Math.cos(theta - offset),
      y: 1.5,
      z: r * Math.sin(theta - offset) - 1.5
    },
    color: {
      x: 0,
      y: 0,
      z: 255
    },
    specular: 0.2,
    lambert: 0.7,
    ambient: 0.1,
    radius: 1,
    angle: -offset
  }];

  render(scene);
  console.log(planeCount, surfaceCount);
  tick(scene);

};

function tick(scene) {
  var delta = 0.1;
  console.log('tick')
  theta = theta + delta;

  for (var i = 0; i < scene.objects.length; i++) {
    // object = scene.objects[i];
    if (scene.objects[i].type === 'sphere') {
      console.log(scene.objects[i].point.x);
      scene.objects[i].point.x = r * Math.cos(theta + scene.objects[i].angle);
      scene.objects[i].point.z = r * Math.sin(theta + scene.objects[i].angle) - 1.5;
    }
  }

  render(scene);
  console.log(planeCount, surfaceCount);
  setTimeout(tick, 10, scene);
}

function render(scene) {
  var camera = scene.camera;
  var lights = scene.lights;
  var objects = scene.objects;

  var cameraVector = Vector.unitVector(Vector.subtract(camera.vector, camera.point));
  var vpRight = Vector.unitVector(Vector.crossProduct(cameraVector, Vector.UP));
  var vpUp = Vector.unitVector(Vector.crossProduct(vpRight, cameraVector));
  var fovRadians = Math.PI * (camera.fieldOfView / 2) / 180;
  var heightWidthRatio = height / width;
  var halfWidth = Math.tan(fovRadians);
  var halfHeight = heightWidthRatio * halfWidth;
  var camerawidth = halfWidth * 2;
  var cameraheight = halfHeight * 2;
  var pixelWidth = camerawidth / (width - 1);
  var pixelHeight = cameraheight / (height - 1);

  var index, color;
  var ray = {
    point: camera.point
  };

  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      var xcomponent = Vector.scale(vpRight, (x * pixelWidth) - halfWidth);
      var ycomponent = Vector.scale(vpUp, (y * pixelHeight) - halfHeight);

      ray.vector = Vector.unitVector(Vector.add3(cameraVector, xcomponent, ycomponent));
      color = trace(ray, scene, 0);
      index = (x * 4) + (y * width * 4);
      imageData.data[index + 0] = color.x;
      imageData.data[index + 1] = color.y;
      imageData.data[index + 2] = color.z;
      imageData.data[index + 3] = 255;
    }
  }
  con.putImageData(imageData, 0, 0);
}

function trace(ray, scene, depth) {
  if (depth > 2) {
    return;
  }

  var distObject = intersectScene(ray, scene);
  if (distObject[0] === Infinity) {
    return Vector.WHITE;
  }

  var dist = distObject[0];
  var object = distObject[1];
  var pointAtTime;

  if (object.type === 'sphere') {
    pointAtTime = Vector.add(ray.point, Vector.scale(ray.vector, dist));
  } else {
    pointAtTime = Vector.add(ray.point, Vector.scale(ray.vector, dist));
  }
  var normal;

  if (object.type === 'sphere') {
    normal = sphereNormal(object, pointAtTime);
  } else if (object.type === 'plane') {
    normal = planeNormal(object);
  }
  return surface(ray, scene, object, pointAtTime, normal, depth);
}

function surface(ray, scene, object, pointAtTime, normal, depth) {
  var b = object.color;
  var c = Vector.ZERO;
  var lambertAmount = 0;
  if (object.lambert) {
    for (var i = 0; i < scene.lights.length; i++) {
      var lightPoint = scene.lights[0];
      if (!isLightVisible(pointAtTime, scene, lightPoint)) continue;
      var contribution = Vector.dotProduct(Vector.unitVector(Vector.subtract(lightPoint,
        pointAtTime)), normal);
      if (contribution > 0) lambertAmount += contribution;
    }
  }
  if (object.specular) {
    var reflectedRay = {
      point: pointAtTime,
      vector: Vector.reflectThrough(ray.vector, normal)
    };
    var reflectedColor = trace(reflectedRay, scene, ++depth);
    if (reflectedColor) {
      c = Vector.add(c, Vector.scale(reflectedColor, object.specular));
    }
  }
  lambertAmount = Math.min(1, lambertAmount);

  return Vector.add3(c, Vector.scale(b, lambertAmount * object.lambert), Vector.scale(b, object.ambient));
}

function isLightVisible(pt, scene, light) {
  var distObject = intersectScene({
    point: pt,
    vector: Vector.unitVector(Vector.subtract(pt, light))
  }, scene);
  return distObject[0] > -0.005;
}


function intersectScene(ray, scene) {
  var closest = [Infinity, null];
  for (var i = 0; i < scene.objects.length; i++) {
    var object = scene.objects[i];
    if (object.type === 'sphere') {
      dist = sphereIntersection(object, ray);
    } else if (object.type === 'plane') {
      dist = planeIntersection(object, ray);
    }
    if (dist !== undefined && dist < closest[0]) {
      closest = [dist, object];
    }
  }
  return closest;
}

function planeNormal(plane) {
  var upVector = Vector.unitVector(Vector.subtract(plane.pointOne, plane.pointTwo));
  var leftVector = Vector.unitVector(Vector.subtract(plane.pointOne, plane.pointThree));
  return Vector.unitVector(Vector.crossProduct(upVector, leftVector));
}

function planeIntersection(plane, ray) {
  var camera = scene.camera;
  var normal = planeNormal(plane);

  var D = -(normal.x * plane.pointOne.x + normal.y * plane.pointOne.y + normal.z * plane.pointOne.z);
  // var D = s;
  var startRayPoint = ray.point;
  var rayDirection = ray.vector;

  var denom = Vector.dotProduct(normal, rayDirection);
  // if (denom > 0) {
  //   denom = -denom
  // }
  if (denom == 0) {
    return;
  } else {
    planeCount++;
    var t = (-Vector.dotProduct(normal, startRayPoint) - D) / denom
    var intersect = Vector.add(startRayPoint, Vector.scale(rayDirection, t));
    if (surfaceIntersect(plane, intersect)) {
      return Vector.distanceForm(ray.point, intersect);
    } else {
      return;
    }
  }
}

function surfaceIntersect(plane, intersect) {
  var bounds = getSurfaceBounds(plane);
  var cond1 = false,
    cond2 = false,
    cond3 = false;
  if (bounds[0] === bounds[1]) {
    cond1 = true;
  }
  if (bounds[2] === bounds[3]) {
    cond2 = true;
  }
  if (bounds[4] === bounds[5]) {
    cond3 = true;
  }

  if ((intersect.x >= bounds[0] && intersect.x <= bounds[1]) || cond1) {
    if (intersect.y >= bounds[2] && intersect.y <= bounds[3] || cond2) {
      if (intersect.z >= bounds[4] && intersect.z <= bounds[5] || cond3) {
        surfaceCount++;
        return true;
      }
    }
  }
  return false;
}

function getSurfaceBounds(plane) {
  var points = [plane.pointOne, plane.pointTwo, plane.pointThree, plane.pointFour];
  var minX = 100;
  var maxX = -100;
  var minY = 100;
  var maxY = -100;
  var minZ = 100;
  var maxZ = -100;
  for (i = 0; i < 4; i++) {
    var point = points[i];
    if (point.x <= minX) {
      minX = point.x;
    }
    if (point.x >= maxX) {
      maxX = point.x;
    }
    if (point.y <= minY) {
      minY = point.y;
    }
    if (point.y >= maxY) {
      maxY = point.y;
    }
    if (point.z <= minZ) {
      minZ = point.z;
    }
    if (point.z >= maxZ) {
      maxZ = point.z;
    }
  }
  return [minX, maxX, minY, maxY, minZ, maxZ];
}

function sphereIntersection(sphere, ray) {
  var eye_to_center = Vector.subtract(sphere.point, ray.point);
  var v = Vector.dotProduct(eye_to_center, ray.vector);
  var eoDot = Vector.dotProduct(eye_to_center, eye_to_center);
  var discriminant = (sphere.radius * sphere.radius) - eoDot + (v * v);

  if (discriminant < 0) {
    return;
  } else {
    return v - Math.sqrt(discriminant);
  }
}

function sphereNormal(sphere, pos) {
  return Vector.unitVector(Vector.subtract(pos, sphere.point));
}
