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
    let transform;
    let agent;
    let laser;
    let ctrForward = new ƒ.Control("Forward", 10, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(200);
    let ctrRotate = new ƒ.Control("Rotate", 90, 0 /* PROPORTIONAL */);
    ctrRotate.setDelay(0);
    async function start(_event) {
        viewport = _event.detail;
        let graph = viewport.getBranch();
        laser = graph.getChildrenByName("Laserformation")[0].getChildrenByName("Laser")[0];
        transform = laser.mtxLocal;
        agent = graph.getChildrenByName("Agents")[0].getChildren()[0];
        viewport.camera.mtxPivot.translateZ(-16);
        let graphLaser = await ƒ.Project.registerAsGraph(laser, false);
        let copy = new ƒ.GraphInstance(graphLaser);
        graph.getChildrenByName("Laserformation")[0].addChild(copy);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 120); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        let deltaTime = ƒ.Loop.timeFrameReal / 1000;
        let walkValue = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])
            + ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]));
        ctrForward.setInput(walkValue * deltaTime);
        agent.mtxLocal.translateX(ctrForward.getOutput());
        let rotValue = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])
            + ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]));
        ctrRotate.setInput(rotValue * deltaTime);
        agent.mtxLocal.rotateZ(ctrRotate.getOutput());
        transform.rotateZ(90 * deltaTime);
        // ƒ.Physics.world.simulate();  // if physics is included and used
        viewport.draw();
        checkCollision();
        ƒ.AudioManager.default.update();
    }
    function checkCollision() {
        let beam1 = laser.getChildrenByName("Arms")[0].getChildren()[0];
        let posLocal1 = ƒ.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beam1.mtxWorldInverse, true);
        let beam2 = laser.getChildrenByName("Arms")[0].getChildren()[1];
        let posLocal2 = ƒ.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beam2.mtxWorldInverse, true);
        let beam3 = laser.getChildrenByName("Arms")[0].getChildren()[2];
        let posLocal3 = ƒ.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beam3.mtxWorldInverse, true);
        if (posLocal1.x <= 2.8 && posLocal1.x >= 0 && posLocal1.y <= 0.25 && posLocal1.y >= -0.25)
            console.log("hit");
        if (posLocal2.x <= 2.8 && posLocal2.x >= 0 && posLocal2.y <= 0.25 && posLocal2.y >= -0.25)
            console.log("hit");
        if (posLocal3.x <= 2.8 && posLocal3.x >= 0 && posLocal3.y <= 0.25 && posLocal3.y >= -0.25)
            console.log("hit");
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map