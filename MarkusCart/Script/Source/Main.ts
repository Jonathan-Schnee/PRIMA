namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <any>start);

  let map: ƒ.Node = new ƒ.Node("ownTarrain");

  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 10, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(50000);
  let ctrTurn: ƒ.Control = new ƒ.Control("Turn", 100, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(50);

  let cart: ƒ.Node

  let mtxTerrain: ƒ.Matrix4x4;
  let meshTerrain: ƒ.MeshTerrain;

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;
    viewport.calculateTransforms();
    viewport.camera.mtxPivot.translateY(120);
    viewport.camera.mtxPivot.rotateX(90);
    let graph: ƒ.Node = viewport.getBranch();
    cart = graph.getChildrenByName("Cart")[0]
    //let cmpRigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);

    let heightMap = new ƒ.TextureImage();
    await heightMap.load("../Texture/heightC.png");

    let mtrTex: ƒ.Material = <ƒ.Material>ƒ.Project.resources["Material|2021-11-23T14:02:06.634Z|31225"];
    let material = new ƒ.ComponentMaterial(mtrTex)
    console.log(material)
    let gridMeshFlat = new ƒ.MeshRelief("HeightMap", heightMap);
    let grid = new ƒ.ComponentMesh(gridMeshFlat);
    grid.mtxPivot.scale(new ƒ.Vector3(100, 10, 100))
    grid.mtxPivot.translateY(-grid.mesh.boundingBox.max.y/2)

    let transfom = new ƒ.ComponentTransform();
    map.addComponent(grid)
    map.addComponent(material);
    //map.addComponent(cmpRigidbody)
    map.addComponent(transfom)
    graph.addChild(map)

    meshTerrain = <ƒ.MeshTerrain>map.getComponent(ƒ.ComponentMesh).mesh;
    mtxTerrain = map.getComponent(ƒ.ComponentMesh).mtxWorld;

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);
    }

  function update(_event: Event): void {
    // ƒ.Physics.world.simulate();  // if physics is included and used
    //ƒ.Physics.world.simulate();

    let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;
    let forward: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
    ctrForward.setInput(forward);
    cart.mtxLocal.translateZ(ctrForward.getOutput() * deltaTime);
    if(forward!=0){
      let turn: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
      ctrTurn.setInput(turn);
      cart.mtxLocal.rotateY(ctrTurn.getOutput() * deltaTime);
      }
      let terrainInfo: ƒ.TerrainInfo = meshTerrain.getTerrainInfo(cart.mtxLocal.translation, mtxTerrain);
      cart.mtxLocal.translation = terrainInfo.position;
      cart.mtxLocal.showTo(ƒ.Vector3.SUM(terrainInfo.position, cart.mtxLocal.getZ()), terrainInfo.normal);

    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}