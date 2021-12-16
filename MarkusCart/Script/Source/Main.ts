namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <any>start);

  let chgcam: boolean = false
  let keyCam: boolean = false
  let pressed:boolean = false

  let map: ƒ.Node;

  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 7000, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(200);
  let ctrTurn: ƒ.Control = new ƒ.Control("Turn", 1000, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrTurn.setDelay(50);

  let cart: ƒ.Node


  let body: ƒ.ComponentRigidbody;
  let forceNodes: ƒ.Node[]
  let posForce: ƒ.Vector3

  let mtxTerrain: ƒ.Matrix4x4;
  let meshTerrain: ƒ.MeshTerrain;

  let isGrounded: boolean = false;
  let dampTranslation:number;
  let dampRotation:number;

  let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
  let cameraNode: ƒ.Node = new ƒ.Node("Camera");
  cameraNode.addComponent(cmpCamera);
  let startCam: ƒ.ComponentCamera;

  let fricMap: ƒ.TextureImage;
  let can: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D
  let imgData: ImageData;

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;
    viewport.calculateTransforms();
    startCam = viewport.camera

    startCam.mtxPivot.translateY(160);
    startCam.mtxPivot.rotateX(90);

    let graph: ƒ.Node = viewport.getBranch();

    fricMap = <ƒ.TextureImage>ƒ.Project.resources["TextureImage|2021-12-13T22:47:30.419Z|92341"];
    can = document.createElement("canvas");
    ctx = can.getContext("2d");
    let img = fricMap.image
    can.width = img.width;
    can.height = img.height;
    ctx.drawImage(img, 0, 0);
    imgData = ctx.getImageData(0,0,img.width,img.height);


    cart = graph.getChildrenByName("Cart")[0]
    body = cart.getComponent(ƒ.ComponentRigidbody);
    dampTranslation = body.dampTranslation;
    dampRotation = body.dampRotation;
    map = graph.getChildrenByName("Tarrain")[0];
    meshTerrain = <ƒ.MeshTerrain>map.getComponent(ƒ.ComponentMesh).mesh;
    mtxTerrain = map.getComponent(ƒ.ComponentMesh).mtxWorld;



    graph.appendChild(cameraNode);

    let cmpTransformCamera: ƒ.ComponentTransform = new ƒ.ComponentTransform();
    cameraNode.addComponent(cmpTransformCamera);

    cmpCamera.mtxPivot.translateZ(-8);
    cmpCamera.mtxPivot.translateY(5);
    cmpCamera.mtxPivot.rotateX(20);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);
    }

  function update(_event: Event): void {
    gravity();
    checkFric();
    ƒ.Physics.world.simulate();  // if physics is included and used
    if(isGrounded){
      controls();
    }
    else{
      body.dampRotation = body.dampTranslation = 0;
    }

    camera();

    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function controls(): void{
    body.dampTranslation = dampTranslation
    body.dampRotation = dampRotation
    let forward: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
    ctrForward.setInput(forward);
    body.applyForce(ƒ.Vector3.SCALE(cart.mtxLocal.getZ(), ctrForward.getOutput()));
    if(forward!=0){
      let turn: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
      ctrTurn.setInput(turn);
      body.applyTorque(ƒ.Vector3.SCALE(ƒ.Vector3.Y(), ctrTurn.getOutput()))
      }
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.T])){
      ctx.putImageData(imgData, 0, 0);
      var dataURL = can.toDataURL();
      console.log(dataURL);
    }
  }
  function camera(): void{
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])){
      if(!pressed){
        chgcam = !chgcam
        pressed = true
      }
    }
    else{
      pressed = false
    }
    keyCam = chgcam
    if(keyCam){
      let cartPosition: ƒ.Vector3 = cart.mtxWorld.translation
      cameraNode.mtxLocal.translation = cartPosition;
      cameraNode.mtxLocal.rotation = new ƒ.Vector3(0, cart.mtxLocal.rotation.y, 0);
      viewport.camera = cmpCamera
    }
    else{
      viewport.camera = startCam
    }
  }
  function gravity(){
    let maxHeight: number = 0.3;
    let minHeight: number = 0.2;
    forceNodes = cart.getChildren();
    let force: ƒ.Vector3 = ƒ.Vector3.SCALE( ƒ.Physics.world.getGravity(), -body.mass /forceNodes.length);
    //let force: ƒ.Vector3 = ƒ.Vector3.SCALE( ƒ.Physics.world.getGravity(), -body.mass);
    isGrounded = false;
    for(let forceNode of forceNodes){
      posForce = forceNode.getComponent(ƒ.ComponentMesh).mtxWorld.translation;
      let terrainInfo: ƒ.TerrainInfo = meshTerrain.getTerrainInfo(posForce, mtxTerrain);
      let height: number =  posForce.y - terrainInfo.position.y;
      
      if(height < maxHeight){
        body.applyForceAtPoint(ƒ.Vector3.SCALE(force, (maxHeight - height) / (maxHeight - minHeight)), posForce)
        isGrounded = true; 
      }
    }
  }
  function checkFric(){
    let mapMesh : ƒ.ComponentMesh = map.getComponent(ƒ.ComponentMesh)
    let imgPos : ƒ.Vector2 = new ƒ.Vector2(cart.mtxLocal.translation.z + mapMesh.mtxPivot.scaling.z/2, cart.mtxLocal.translation.x + mapMesh.mtxPivot.scaling.x/2)
    let pxlfac: number = mapMesh.mtxPivot.scaling.x / imgData.width
    let pxlPos: ƒ.Vector2 = new ƒ.Vector2((imgPos.x / pxlfac) | 0 , (imgPos.y / pxlfac) | 0);
    let pxlArr: number = pxlPos.x  * imgData.width + pxlPos.y;
    imgData.data[pxlArr * 4] = 2;
  }
}