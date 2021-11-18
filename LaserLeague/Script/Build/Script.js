"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Agent extends ƒ.Node {
        healthvalue = 1;
        name = "Agent Smith";
        cmpAudio;
        hit;
        constructor() {
            super("Agent");
            this.hit = false;
            this.addComponent(new ƒ.ComponentTransform);
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshPyramid("MeshAgent")));
            this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("MaterialAgent", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 0, 1, 1)))));
            this.mtxLocal.translateZ(0.5);
            this.getComponent(ƒ.ComponentMesh).mtxPivot.scale(ƒ.Vector3.ONE(0.5));
            Script.gameState.name = this.name;
            let css = Script.Hud.changeCSS("name");
            css.style.width = this.name.length - 1 + "ch";
            const audio = new ƒ.Audio("Sound/trancyvania.mp3");
            this.cmpAudio = new ƒ.ComponentAudio(audio, true);
            this.cmpAudio.volume = 1;
            this.addComponent(this.cmpAudio);
        }
        health() {
            Script.gameState.health = this.healthvalue;
        }
        playMusic(bol) {
            if (bol != this.hit) {
                this.hit = bol;
                //console.log(this.hit)
                //this.cmpAudio.play(this.hit);
            }
        }
    }
    Script.Agent = Agent;
})(Script || (Script = {}));
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
    var ƒui = FudgeUserInterface;
    class GameState extends ƒ.Mutable {
        name = "";
        health = 1;
        reduceMutator(_mutator) { }
    }
    Script.gameState = new GameState();
    class Hud {
        static controller;
        static start() {
            let domHud = document.querySelector("div");
            Hud.controller = new ƒui.Controller(Script.gameState, domHud);
            Hud.controller.updateUserInterface();
        }
        static changeCSS(keyvalue) {
            let domHud = document.querySelector("input[key='" + keyvalue + "']");
            return domHud;
        }
    }
    Script.Hud = Hud;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class Laser extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(Laser);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "Laser added to ";
        viewport;
        rotationSpeed;
        deltaTime;
        gameObject;
        rotationTransform;
        constructor() {
            super();
            this.rotationSpeed = 90;
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
        static collision(agent, laserformation) {
            let col = false;
            for (let las of laserformation.getChildren()) {
                let arms = las.getChildrenByName("Arms")[0];
                for (let beam of arms.getChildren()) {
                    let posLocal1 = ƒ.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beam.mtxWorldInverse, true);
                    if (posLocal1.x <= 2.8 && posLocal1.x >= 0 && posLocal1.y <= 0.25 && posLocal1.y >= -0.25)
                        col = true;
                }
            }
            return col;
        }
        // protected reduceMutator(_mutator: ƒ.Mutator): void {
        //   // delete properties that should not be mutated
        //   // undefined properties and private fields (#) will not be included by default
        // }
        changeRotateSpeed(num) {
            this.rotationSpeed = num;
        }
    }
    Script.Laser = Laser;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    document.addEventListener("interactiveViewportStarted", start);
    let viewport;
    let laserformation;
    let agent;
    let hitted = false;
    let ctrForward = new ƒ.Control("Forward", 10, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(200);
    let ctrRotate = new ƒ.Control("Rotate", 90, 0 /* PROPORTIONAL */);
    ctrRotate.setDelay(0);
    let dialog;
    window.addEventListener("load", init);
    async function start(_event) {
        viewport = _event.detail;
        let graph = viewport.getBranch();
        laserformation = graph.getChildrenByName("Laserformation")[0];
        agent = new Script.Agent();
        graph.getChildrenByName("Agents")[0].addChild(agent);
        viewport.getCanvas().addEventListener("click", hndClick);
        graph.addEventListener("agentSentEvent", hndAgentEvent);
        viewport.camera.mtxPivot.rotateY(180);
        viewport.camera.mtxPivot.translateZ(-30);
        let cmpListener = new ƒ.ComponentAudioListener();
        graph.addComponent(cmpListener);
        let graphLaser = ƒ.Project.resources["Graph|2021-10-28T13:07:23.830Z|93008"];
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 3; j++) {
                let laserarr = await ƒ.Project.createGraphInstance(graphLaser);
                laserarr.addEventListener("graphEvent", hndGraphEvent, true);
                graph.getChildrenByName("Laserformation")[0].addChild(laserarr);
                laserarr.mtxLocal.translateY(-5 + i * 6);
                laserarr.mtxLocal.translateX(-11 + j * 6);
            }
        }
        Script.Hud.start();
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        let deltaTime = ƒ.Loop.timeFrameReal / 1000;
        let walkValue = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])
            + ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]));
        ctrForward.setInput(walkValue * deltaTime);
        agent.mtxLocal.translateY(ctrForward.getOutput());
        let rotValue = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])
            + ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]));
        ctrRotate.setInput(rotValue * deltaTime);
        agent.mtxLocal.rotateZ(ctrRotate.getOutput());
        // ƒ.Physics.world.simulate();  // if physics is included and used
        viewport.draw();
        //console.log(Laser.collision(agent, laserformation))
        hitted = Script.Laser.collision(agent, laserformation);
        agent.playMusic(hitted);
        ƒ.AudioManager.default.update();
        agent.healthvalue -= 0.01;
        agent.health();
    }
    function hndClick(_event) {
        console.log("click");
        agent.dispatchEvent(new CustomEvent("agentSentEvent", { bubbles: true }));
    }
    function hndAgentEvent(_event) {
        console.log("event dispatched");
        _event.currentTarget.broadcastEvent(new CustomEvent("graphEvent"));
    }
    function hndGraphEvent(_event) {
        console.log("Graph event received", _event.currentTarget);
    }
    async function init(_event) {
        await ƒ.Project.loadResourcesFromHTML();
        dialog = document.querySelector("dialog");
        dialog.querySelector("h1").textContent = document.title;
        dialog.addEventListener("click", function (_event) {
            // @ts-ignore until HTMLDialog is implemented by all browsers and available in dom.d.ts
            dialog.close();
            startInteractiveViewport("Graph|2021-10-07T13:40:59.613Z|04641");
        });
        //@ts-ignore
        dialog.showModal();
    }
    async function startInteractiveViewport(_graphId) {
        // load resources referenced in the link-tag
        await ƒ.Project.loadResourcesFromHTML();
        ƒ.Debug.log("Project:", ƒ.Project.resources);
        // pick the graph to show
        let graph = ƒ.Project.resources[_graphId];
        ƒ.Debug.log("Graph:", graph);
        if (!graph) {
            alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
            return;
        }
        // setup the viewport
        let cmpCamera = new ƒ.ComponentCamera();
        let canvas = document.querySelector("canvas");
        let viewport = new ƒ.Viewport();
        viewport.initialize("InteractiveViewport", graph, cmpCamera, canvas);
        ƒ.Debug.log("Viewport:", viewport);
        // hide the cursor when interacting, also suppressing right-click menu
        // setup audio
        ƒ.AudioManager.default.listenTo(graph);
        ƒ.Debug.log("Audio:", ƒ.AudioManager.default);
        // draw viewport once for immediate feedback
        viewport.draw();
        canvas.dispatchEvent(new CustomEvent("interactiveViewportStarted", { bubbles: true, detail: viewport }));
    }
    document.head.querySelector("meta[autoView]").getAttribute("autoView");
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map