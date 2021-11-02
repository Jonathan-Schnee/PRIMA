namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!")

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <any>start);

  let transform: ƒ.Matrix4x4;
  let laserformation: ƒ.Node;
  let agent: ƒ.Node;
  let copyLaser: ƒ.Node;

  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 10, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(200);

  let ctrRotate: ƒ.Control = new ƒ.Control("Rotate", 90, ƒ.CONTROL_TYPE.PROPORTIONAL)
  ctrRotate.setDelay(0);

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;
    


    let graph: ƒ.Node = viewport.getBranch();
    laserformation = graph.getChildrenByName("Laserformation")[0];
    agent = graph.getChildrenByName("Agents")[0].getChildren()[0];
    viewport.camera.mtxPivot.translateZ(-16);

    let graphLaser: ƒ.Graph = <ƒ.Graph>FudgeCore.Project.resources["Graph|2021-10-28T13:07:23.830Z|93008"];
    copyLaser = await ƒ.Project.createGraphInstance(graphLaser)
    
    graph.getChildrenByName("Laserformation")[0].addChild(copyLaser);

    copyLaser.mtxLocal.translateX(-10);

    for(var i = 0; i < 20; i++){
      for(var j = 0; j < 10; j++){
        let laserarr = await ƒ.Project.createGraphInstance(graphLaser)
        graph.getChildrenByName("Laserformation")[0].addChild(laserarr);
        laserarr.mtxLocal.translateY(i* 5);
        laserarr.mtxLocal.translateX(j* 5);
      }
    }




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
    for(var i = 0; i < laserformation.getChildren().length; i++)
      laserformation.getChildren()[i].mtxLocal.rotateZ(Math.random()* 90 * deltaTime);
    // ƒ.Physics.world.simulate();  // if physics is included and used
    viewport.draw();
    checkCollision();
    ƒ.AudioManager.default.update();
  }

  function checkCollision(): void {
    for(var i = 0; i < laserformation.getChildren().length; i++){
      let arms: ƒ.Node = laserformation.getChildren()[i].getChildrenByName("Arms")[0]
      for(var j = 0; j < arms.getChildren().length; j++){
        let beam = arms.getChildren()[j]
        let posLocal1: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beam.mtxWorldInverse, true);
        if(posLocal1.x <= 2.8 && posLocal1.x >= 0 && posLocal1.y <= 0.25 && posLocal1.y >= -0.25)
          console.log("hit");
      }
    }
  }

}