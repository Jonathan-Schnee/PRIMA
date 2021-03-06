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
    document.addEventListener("interactiveViewportStarted", start);
    let agent;
    let coll;
    let ctrForward = new ƒ.Control("Forward", 10, 0 /* PROPORTIONAL */);
    let ctrTurn = new ƒ.Control("Turn", 10, 0 /* PROPORTIONAL */);
    function start(_event) {
        viewport = _event.detail;
        let graph = viewport.getBranch();
        agent = graph.getChildrenByName("Agent")[0];
        coll = graph.getChildrenByName("Collider")[0];
        viewport = _event.detail;
        //coll.getComponent(ƒ.ComponentRigidbody).isTrigger = true;
        agent.getComponent(ƒ.ComponentRigidbody).addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, (_event) => console.log("proximity"));
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);
        // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        //console.log(coll.getComponent(ƒ.ComponentRigidbody).triggerings)
        // ƒ.Physics.world.simulate();  // if physics is included and used
        let deltaTime = ƒ.Loop.timeFrameReal / 1000;
        controls(deltaTime);
        ƒ.Physics.world.simulate();
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function controls(_deltaTime) {
        let forward = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
        ctrForward.setInput(forward);
        agent.getComponent(ƒ.ComponentRigidbody).applyForce(ƒ.Vector3.SCALE(agent.mtxLocal.getZ(), ctrForward.getOutput()));
        let turn = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
        ctrTurn.setInput(turn);
        agent.getComponent(ƒ.ComponentRigidbody).applyTorque(ƒ.Vector3.SCALE(ƒ.Vector3.Y(), ctrTurn.getOutput()));
    }
    function collider(_event) {
        console.log(_event.cmpRigidbody.node.name);
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map