$(window).on('DOMContentLoaded', () => {
  var canvas = $('#canvas')[0];
  var engine = new BABYLON.Engine(canvas, true);
  var isLocked = false;

  var createScene = function(){
    var scene = new BABYLON.Scene(engine);

    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.OimoJSPlugin());
    scene.gravity = new BABYLON.Vector3(0, -2, 0);


    var camera = new BABYLON.FreeCamera("camera0", new BABYLON.Vector3(0, 50, -10), scene);
    var ground = BABYLON.Mesh.CreateTiledGround('ground0', -20, -20, 20, 20, {"w" : 2, "h" : 2}, {'h' : 8, 'w' : 8}, scene, true);

    camera.setTarget(BABYLON.Vector3.Zero());
    camera.ellipsoid = new BABYLON.Vector3(0.1,1,0.1);
    camera.attachControl(canvas, false);

    var light = new BABYLON.HemisphericLight('light0', new BABYLON.Vector3(0,1,0), scene);

    var ground = BABYLON.Mesh.CreateTiledGround('ground0', -20, -20, 20, 20, {"w" : 2, "h" : 2}, {'h' : 8, 'w' : 8}, scene, true);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0.9}, scene);

    scene.collisionsEnabled = true;
    camera.applyGravity = true;
    camera.checkCollisions = true;

    ground.checkCollisions = true;

    scene.onPointerDown = function(e){
      if (!isLocked){
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
        if(canvas.requestPointerLock){
          canvas.requestPointerLock();
        }
      }
    }

    function updatePLock(){
      var controlEnabled = document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement || document.pointerLockElement || null;
      if(!controlEnabled){
        isLocked = false;
      }else{
        isLocked = true;
      }
    }

    $(document).on("pointerlockchange", updatePLock, false);
    $(document).on("mozpointerlockchange", updatePLock, false);
    $(document).on("mspointerlockchange", updatePLock, false);
    $(document).on("webkitpointerlockchange", updatePLock, false);

    return scene;
  };

  var scene = createScene();
  scene.debugLayer.show();
  engine.runRenderLoop(() => {
    scene.render();
  });

  $(window).on('resize', () => {
    engine.resize();
  });
  $('body').append('<script id="test_script">console.log("test1")</script>');
});
