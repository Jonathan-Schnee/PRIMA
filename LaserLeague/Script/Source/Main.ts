namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!")

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <any>start);

  let transform: ƒ.Matrix4x4;
  let agent: ƒ.Node;
  let laser: ƒ.Node;

  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 10, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(200);

  let ctrRotate: ƒ.Control = new ƒ.Control("Rotate", 90, ƒ.CONTROL_TYPE.PROPORTIONAL)
  ctrRotate.setDelay(0);

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;
    


    let graph: ƒ.Node = viewport.getBranch();
    laser = graph.getChildrenByName("Laserformation")[0].getChildrenByName("Laser")[0];
    transform = laser.mtxLocal;
    agent = graph.getChildrenByName("Agents")[0].getChildren()[0];

    viewport.camera.mtxPivot.translateZ(-16);

    let graphLaser: ƒ.Graph = await ƒ.Project.registerAsGraph(laser, false);
    let copy: ƒ.GraphInstance = new ƒ.GraphInstance(graphLaser);
    
    graph.getChildrenByName("Laserformation")[0].addChild(copy);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 120);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }
  function update(_event: Event): void {
    let deltaTime: number = ƒ.Loop.timeFrameReal / 1000

    let walkValue: number = (
      ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])
      + ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])
    );
    ctrForward.setInput(walkValue * deltaTime)
    agent.mtxLocal.translateX(ctrForward.getOutput())

    let rotValue: number = (
      ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])
      + ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])
    );
    ctrRotate.setInput(rotValue * deltaTime)
    agent.mtxLocal.rotateZ(ctrRotate.getOutput())

    transform.rotateZ(90 * deltaTime);
    // ƒ.Physics.world.simulate();  // if physics is included and used
    viewport.draw();
    checkCollision();
    ƒ.AudioManager.default.update();
  }

  function checkCollision(): void {
      let beam1: ƒ.Node = laser.getChildrenByName("Arms")[0].getChildren()[0];
      let posLocal1: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beam1.mtxWorldInverse, true);
      let beam2: ƒ.Node = laser.getChildrenByName("Arms")[0].getChildren()[1];
      let posLocal2: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beam2.mtxWorldInverse, true);
      let beam3: ƒ.Node = laser.getChildrenByName("Arms")[0].getChildren()[2];
      let posLocal3: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beam3.mtxWorldInverse, true);

      if(posLocal1.x <= 2.8 && posLocal1.x >= 0 && posLocal1.y <= 0.25 && posLocal1.y >= -0.25)
        console.log("hit");
      if(posLocal2.x <= 2.8 && posLocal2.x >= 0 && posLocal2.y <= 0.25 && posLocal2.y >= -0.25)
        console.log("hit");
      if(posLocal3.x <= 2.8 && posLocal3.x >= 0 && posLocal3.y <= 0.25 && posLocal3.y >= -0.25)
        console.log("hit");
  }

}