namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 550, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(10);

  let agent: ƒ.Node;
  let agentRB: ƒ.ComponentRigidbody;
  let isGrounded: boolean;
  let ground: ƒ.Node;
  let agentdampT: number;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS ;
    let graph: ƒ.Node = viewport.getBranch();
    agent= graph.getChildrenByName("Agent")[0];
    ground = graph.getChildrenByName("Ground")[0];
    generateCG(ground)
    agentRB = agent.getComponent(ƒ.ComponentRigidbody);
    agentRB.effectRotation = new ƒ.Vector3(0,0,0);
    agentdampT = agentRB.dampTranslation
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    isGrounded = false
    let direction = ƒ.Vector3.Y(-1)

    let agentTransL = agent.mtxWorld.translation.clone;
    agentTransL.x -= agent.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x /2 - 0.01;
    let rayL = ƒ.Physics.raycast(agentTransL, direction, 0.5, true, ƒ.COLLISION_GROUP.GROUP_2)
    let agentTransR = agent.mtxWorld.translation.clone;
    agentTransR.x += agent.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x /2 - 0.01;
    let rayR = ƒ.Physics.raycast(agentTransR, direction, 0.5, true, ƒ.COLLISION_GROUP.GROUP_2)
    if(rayL.hit || rayR.hit){
      agentRB.dampTranslation = agentdampT;
      isGrounded = true
    }

    let forward: number = ƒ.Keyboard.mapToTrit( [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT], [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]);
    ctrForward.setInput(forward);
    agentRB.applyForce(ƒ.Vector3.X(ctrForward.getOutput()));


    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && isGrounded){
      //agentRB.applyLinearImpulse(ƒ.Vector3.Y(15));
      agentRB.dampTranslation = 0.1
      agentRB.addVelocity(ƒ.Vector3.Y(10))
    }

    ƒ.Physics.world.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function generateCG(ground: ƒ.Node){
    for(let g of ground.getChildren()){
      let groundRB = g.getComponent(ƒ.ComponentRigidbody)
      groundRB.collisionGroup = ƒ.COLLISION_GROUP.GROUP_2
    }
  }
}