namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 200, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(10);

  let agent: ƒ.Node;
  let agentRB: ƒ.ComponentRigidbody;
  let j = 0
  let isGrounded: boolean;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    let graph: ƒ.Node = viewport.getBranch();
    agent= graph.getChildrenByName("Agent")[0];
    agentRB = agent.getComponent(ƒ.ComponentRigidbody)
    agentRB.effectRotation = new ƒ.Vector3(0,0,0)

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {

    let forward: number = ƒ.Keyboard.mapToTrit( [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT], [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]);
    ctrForward.setInput(forward);
    agentRB.applyForce(ƒ.Vector3.X(ctrForward.getOutput()));
    
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])){
      j = 50
    }

    if(j != 0){
      agentRB.applyForce(ƒ.Vector3.Y(1000));
      j-- 
    }

    ƒ.Physics.world.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}