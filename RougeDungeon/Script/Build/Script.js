"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let ctrForward = new ƒ.Control("Forward", 200, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(10);
    let agent;
    let agentRB;
    let isGrounded;
    let ground;
    let agentdampT;
    let graph;
    let cameraNode = new ƒ.Node("cameraNode");
    let cmpCamera = new ƒ.ComponentCamera();
    window.addEventListener("load", start);
    async function start(_event) {
        await ƒ.Project.loadResourcesFromHTML();
        graph = ƒ.Project.resources["Graph|2021-12-24T09:09:33.313Z|93679"];
        agent = graph.getChildrenByName("Agent")[0];
        ground = graph.getChildrenByName("Ground")[0];
        generateCG(ground);
        agentRB = agent.getComponent(ƒ.ComponentRigidbody);
        agentRB.effectRotation = new ƒ.Vector3(0, 0, 0);
        agentdampT = agentRB.dampTranslation;
        cmpCamera.mtxPivot.translation = new ƒ.Vector3(0, 0, 22);
        cmpCamera.mtxPivot.rotation = new ƒ.Vector3(0, 180, 0);
        cameraNode.addComponent(cmpCamera);
        cameraNode.addComponent(new ƒ.ComponentTransform());
        graph.addChild(cameraNode);
        let canvas = document.querySelector("canvas");
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", graph, cmpCamera, canvas);
        ƒ.AudioManager.default.listenTo(graph);
        ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 120); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        cameraNode.mtxLocal.translation = new ƒ.Vector3(agent.mtxLocal.translation.x, 0, 0);
        isGrounded = false;
        let direction = ƒ.Vector3.Y(-1);
        let agentTransL = agent.mtxWorld.translation.clone;
        agentTransL.x -= agent.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x / 2 - 0.02;
        let rayL = ƒ.Physics.raycast(agentTransL, direction, 0.5, true, ƒ.COLLISION_GROUP.GROUP_2);
        let agentTransR = agent.mtxWorld.translation.clone;
        agentTransR.x += agent.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x / 2 - 0.02;
        let rayR = ƒ.Physics.raycast(agentTransR, direction, 0.5, true, ƒ.COLLISION_GROUP.GROUP_2);
        if (rayL.hit || rayR.hit) {
            agentRB.dampTranslation = agentdampT;
            isGrounded = true;
        }
        let forward = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT], [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]);
        ctrForward.setInput(forward);
        agentRB.applyForce(ƒ.Vector3.X(ctrForward.getOutput()));
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && isGrounded) {
            agentRB.setVelocity(new ƒ.Vector3(agentRB.getVelocity().x, 11, agentRB.getVelocity().z));
        }
        ƒ.Physics.world.simulate(); // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function generateCG(ground) {
        for (let g of ground.getChildren()) {
            let groundRB = g.getComponent(ƒ.ComponentRigidbody);
            groundRB.collisionGroup = ƒ.COLLISION_GROUP.GROUP_2;
        }
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map