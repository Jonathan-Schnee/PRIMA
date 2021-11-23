namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <any>start);

  let map: ƒ.Node = new ƒ.Node("ownTarrain");
  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;

    let graph: ƒ.Node = viewport.getBranch();

    let cmpRigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);

    let heightMap = new ƒ.TextureImage();
    await heightMap.load("../Texture/heightC.png");

    let mtrTexFlat: ƒ.Material = <ƒ.Material>ƒ.Project.resources["Material|2021-11-23T02:36:34.207Z|12139"];
    let material = new ƒ.ComponentMaterial(mtrTexFlat)
    let gridMeshFlat : ƒ.MeshTerrain = new ƒ.MeshRelief("HeightMap", heightMap);
    let grid = new ƒ.ComponentMesh(gridMeshFlat);
    console.log(grid)
    grid.mtxPivot.scale(new ƒ.Vector3(100, 10, 100))
    grid.mtxPivot.translateY(-grid.mesh.boundingBox.max.y)

    let transfom = new ƒ.ComponentTransform();
    map.addComponent(grid)
    map.addComponent(material);
    map.addComponent(cmpRigidbody)
    map.addComponent(transfom)
    graph.addChild(map)
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);
    }

  function update(_event: Event): void {
    console.log()
    // ƒ.Physics.world.simulate();  // if physics is included and used
    ƒ.Physics.world.simulate();
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}