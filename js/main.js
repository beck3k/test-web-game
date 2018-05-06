$(window).on('DOMContentLoaded', () => {
  var canvas = $('#canvas')[0];
  var engine = new BABYLON.Engine(canvas, true);
  var isLocked = false;

  var createScene = function(){
    var scene = new BABYLON.Scene(engine);

    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
    scene.gravity = new BABYLON.Vector3(0, -0.25, 0);


    var camera = new BABYLON.FreeCamera("camera0", new BABYLON.Vector3(0, 50, -10), scene);
    // var ground = BABYLON.Mesh.CreateTiledGround('ground0', -20, -20, 20, 20, {"w" : 2, "h" : 2}, {'h' : 8, 'w' : 8}, scene, true);

    camera.setTarget(BABYLON.Vector3.Zero());
    // camera.ellipsoid = new BABYLON.Vector3(0.1,1,0.1);
    camera.attachControl(canvas, false);
    camera.keysUp.push(87);
    camera.keysDown.push(83)
    camera.keysLeft.push(65);
    camera.keysRight.push(68);

    var light = new BABYLON.PointLight('light0', new BABYLON.Vector3(0,30,0), scene);

    var ground = BABYLON.Mesh.CreateTiledGround('ground0', -20, -20, 20, 20, {"w" : 2, "h" : 2}, {'h' : 8, 'w' : 8}, scene, true);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0.9}, scene);

    scene.collisionsEnabled = true;
    camera.applyGravity = true;
    camera.checkCollisions = true;

    ground.checkCollisions = true;

    // var playerBody = new BABYLON.MeshBuilder.CreateBox('playerBody', {size: 2}, scene);
    // playerBody.physicsImpostor = new BABYLON.PhysicsImpostor(playerBody, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 2, restitution: 0.1}, scene);
    // camera.parent = playerBody;
    // camera.position = playerBody.getAbsolutePosition();

    var playCube = new BABYLON.MeshBuilder.CreateBox('playCube', {size: 3, width: 5}, scene);
    playCube.position = new BABYLON.Vector3(0, 1, 0);
    playCube.checkCollisions = true;


    var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);

    // myMaterial.diffuseColor = new BABYLON.Color3(1, 255, 1);
    // myMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
    myMaterial.ambientTexture = new BABYLON.Texture('/grass.png', scene);
    // myMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
    // myMaterial.ambientColor = new BABYLON.Color3(0.23, 5.98, 0.53);

    playCube.material = myMaterial;
    playCube.wireframe = true;

    playCube.physicsImpostor = new BABYLON.PhysicsImpostor(playCube, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 2, restitution: 0.1});


    var keyHandler = function(evt){
      switch(evt.key){
        case " ":
          var cam = scene.cameras[0];

          cam.animations = [];

          var a = new BABYLON.Animation(
              "a",
              "position.y", 20,
              BABYLON.Animation.ANIMATIONTYPE_FLOAT,
              BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

          // Animation keys
          var keys = [];
          keys.push({ frame: 0, value: cam.position.y });
          keys.push({ frame: 10, value: cam.position.y + 5 });
          // keys.push({ frame: 20, value: cam.position.y });
          a.setKeys(keys);

          var easingFunction = new BABYLON.CircleEase();
          easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
          a.setEasingFunction(easingFunction);

          cam.animations.push(a);

          scene.beginAnimation(cam, 0, 20, false);
      }
    }

    BABYLON.Tools.RegisterTopRootEvents([{
      name: "keydown",
      handler: keyHandler
    }]);

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

  $('#run').click(function(){
    $('#test_script').remove();
    $('body').append('<script id="test_script">' + $('textarea').val() + '</script>');
  });

  var oldLog = console.log;
  console.log = function (message) {
      $('#log').val($('#log').val() + message + "\n");
      oldLog.apply(console, arguments);
  };
});
