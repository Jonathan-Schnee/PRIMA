namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let agent: ƒ.Node;
  let coll: ƒ.Node;

  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 10, ƒ.CONTROL_TYPE.PROPORTIONAL);
  let ctrTurn: ƒ.Control = new ƒ.Control("Turn", 10, ƒ.CONTROL_TYPE.PROPORTIONAL);


  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    let graph: ƒ.Node = viewport.getBranch();
    agent = graph.getChildrenByName("Agent")[0];
    coll = graph.getChildrenByName("Collider")[0];
    viewport = _event.detail;
    coll.getComponent(ƒ.ComponentRigidbody).isTrigger = false;
    agent.getComponent(ƒ.ComponentRigidbody).addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, collider, true)
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);
    // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    //console.log(coll.getComponent(ƒ.ComponentRigidbody).triggerings)
    // ƒ.Physics.world.simulate();  // if physics is included and used
    let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;
    controls(deltaTime);
    ƒ.Physics.world.simulate();
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function controls(_deltaTime: number): void{
    let forward: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
    ctrForward.setInput(forward);
    agent.getComponent(ƒ.ComponentRigidbody).applyForce(ƒ.Vector3.SCALE(agent.mtxLocal.getZ(), ctrForward.getOutput()))
    
    let turn: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
    ctrTurn.setInput(turn);
    agent.getComponent(ƒ.ComponentRigidbody).applyTorque(ƒ.Vector3.SCALE(ƒ.Vector3.Y(), ctrTurn.getOutput()))
  }
  function collider(_event: ƒ.EventPhysics):void{
    console.log(_event.cmpRigidbody.node.name);
  }
}