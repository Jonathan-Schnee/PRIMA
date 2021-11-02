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
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class LaserRotator extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(LaserRotator);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "LaserRotator added to ";
        viewport;
        rotationSpeed = 90;
        deltaTime;
        gameObject;
        rotationTransform;
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
                    this.start();
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
            }
        };
        start() {
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        update = (_event) => {
            this.deltaTime = ƒ.Loop.timeFrameReal / 1000;
            this.node.mtxLocal.rotateZ(this.rotationSpeed * this.deltaTime);
        };
    }
    Script.LaserRotator = LaserRotator;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    let transform;
    let laserformation;
    let agent;
    let copyLaser;
    let ctrForward = new ƒ.Control("Forward", 10, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(200);
    let ctrRotate = new ƒ.Control("Rotate", 90, 0 /* PROPORTIONAL */);
    ctrRotate.setDelay(0);
    async function start(_event) {
        viewport = _event.detail;
        let graph = viewport.getBranch();
        laserformation = graph.getChildrenByName("Laserformation")[0];
        agent = graph.getChildrenByName("Agents")[0].getChildren()[0];
        viewport.camera.mtxPivot.translateZ(-16);
        let graphLaser = FudgeCore.Project.resources["Graph|2021-10-28T13:07:23.830Z|93008"];
        copyLaser = await ƒ.Project.createGraphInstance(graphLaser);
        graph.getChildrenByName("Laserformation")[0].addChild(copyLaser);
        copyLaser.mtxLocal.translateX(-10);
        for (var i = 0; i < 20; i++) {
            for (var j = 0; j < 10; j++) {
                let laserarr = await ƒ.Project.createGraphInstance(graphLaser);
                graph.getChildrenByName("Laserformation")[0].addChild(laserarr);
                laserarr.mtxLocal.translateY(i * 5);
                laserarr.mtxLocal.translateX(j * 5);
            }
        }
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
        for (var i = 0; i < laserformation.getChildren().length; i++)
            laserformation.getChildren()[i].mtxLocal.rotateZ(Math.random() * 90 * deltaTime);
        // ƒ.Physics.world.simulate();  // if physics is included and used
        viewport.draw();
        checkCollision();
        ƒ.AudioManager.default.update();
    }
    function checkCollision() {
        for (var i = 0; i < laserformation.getChildren().length; i++) {
            let arms = laserformation.getChildren()[i].getChildrenByName("Arms")[0];
            for (var j = 0; j < arms.getChildren().length; j++) {
                let beam = arms.getChildren()[j];
                let posLocal1 = ƒ.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beam.mtxWorldInverse, true);
                if (posLocal1.x <= 2.8 && posLocal1.x >= 0 && posLocal1.y <= 0.25 && posLocal1.y >= -0.25)
                    console.log("hit");
            }
        }
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map