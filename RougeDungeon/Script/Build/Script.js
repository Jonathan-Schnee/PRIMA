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
    let ctrForward = new ƒ.Control("Forward", 250, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(10);
    let agent;
    let agentRB;
    let isGrounded;
    let ground;
    let agentdampT;
    let graph;
    let treeList;
    let stoneList;
    let randomSeed;
    let random;
    let generator;
    let cameraNode = new ƒ.Node("cameraNode");
    let cmpCamera = new ƒ.ComponentCamera();
    window.addEventListener("load", start);
    async function start(_event) {
        await ƒ.Project.loadResourcesFromHTML();
        graph = ƒ.Project.resources["Graph|2021-12-24T09:09:33.313Z|93679"];
        randomSeed = 30;
        random = new ƒ.Random(randomSeed);
        agent = graph.getChildrenByName("Agent")[0];
        agent.getComponent(Script.ScriptAgent).setRB();
        window.addEventListener("click", agent.getComponent(Script.ScriptAgent).use);
        ground = graph.getChildrenByName("Ground")[0];
        generator = graph.getChildrenByName("Generator")[0];
        generator.getComponent(Script.ScriptGenerator).addTree(random);
        generator.getComponent(Script.ScriptGenerator).addStone(random);
        treeList = generator.getChildrenByName("Trees")[0];
        stoneList = generator.getChildrenByName("Stones")[0];
        generateCG(ground);
        agentRB = agent.getComponent(ƒ.ComponentRigidbody);
        agentRB.effectRotation = new ƒ.Vector3(0, 0, 0);
        agentdampT = agentRB.dampTranslation;
        cmpCamera.mtxPivot.translation = new ƒ.Vector3(0, 1, 20);
        cmpCamera.mtxPivot.rotation = new ƒ.Vector3(5, 180, 0);
        cameraNode.addComponent(cmpCamera);
        cameraNode.addComponent(new ƒ.ComponentTransform());
        graph.addChild(cameraNode);
        let canvas = document.querySelector("canvas");
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", graph, cmpCamera, canvas);
        viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER;
        ƒ.AudioManager.default.listenTo(graph);
        ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 120); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        cameraNode.mtxLocal.translation = new ƒ.Vector3(agent.mtxLocal.translation.x, 0, 0);
        isGrounded = false;
        let direction = ƒ.Vector3.Y(-1);
        treeList.getChildrenByName("Tree3")[0].mtxLocal.rotateX(-90);
        console.log(treeList.getChildrenByName("Tree3")[0].mtxLocal.translation.y);
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
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class ScriptAgent extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(ScriptAgent);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        item = "Axe";
        agentRB;
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
        use = (_event) => {
            let tree;
            if (this.agentRB.triggerings.length != 0) {
                for (let rb of this.agentRB.triggerings) {
                    if (rb.collisionGroup == ƒ.COLLISION_GROUP.GROUP_3) {
                        tree = rb.node;
                        break;
                    }
                }
            }
            if (this.item == "Axe") {
                //Call Trigger from Tree and call the Method in the ScriptTree
                console.log("hit2");
                let treemesh = tree.getComponent(ƒ.ComponentMesh);
                let treeheight = treemesh.mtxPivot.scaling.clone;
                treemesh.mtxPivot.scaling = new ƒ.Vector3(treeheight.x, treeheight.y - 1, treeheight.z);
                console.log(tree.mtxLocal.translation.toString());
                ƒ.Recycler.dumpAll();
                tree.mtxLocal.translation = new ƒ.Vector3(1, 1, 1);
                tree.mtxLocal.translation = new ƒ.Vector3(1, 1, 1);
                tree.mtxLocal.translation = new ƒ.Vector3(1, 1, 1);
                console.log(tree.mtxLocal.translation.toString());
                console.log(tree.mtxLocal.translation.toString());
                console.log(tree.mtxLocal.translation.toString());
            }
            if (this.item == "Pickaxe") {
                //Call Trigger from Tree and call the Method in the ScriptTree
                console.log("hit2");
            }
            if (this.item == "Sword") {
                //Call Trigger from Tree and call the Method in the ScriptTree
                console.log("hit3");
            }
        };
        setRB() {
            this.agentRB = this.node.getComponent(ƒ.ComponentRigidbody);
            console.log(this.node.getComponent(ƒ.ComponentRigidbody));
        }
    }
    Script.ScriptAgent = ScriptAgent;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class ScriptGenerator extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(ScriptGenerator);
        // Properties may be mutated by users in the editor via the automatically created user interface
        treePercentage = 65;
        stonePercentage = 65;
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
        }
        addTree(random) {
            let trees = this.node.getChildrenByName("Trees")[0];
            for (let tree of trees.getChildren()) {
                let scale = tree.getComponent(ƒ.ComponentMesh).mtxPivot.scaling;
                let num = random.getRangeFloored(0, 101);
                if (num < this.treePercentage) {
                    tree.getComponent(ƒ.ComponentMaterial).clrPrimary.setBytesRGBA(155, 103, 60, 255);
                    let height = random.getRangeFloored(2, scale.y + 1);
                    tree.getComponent(ƒ.ComponentMesh).mtxPivot.scaleY(height / scale.y);
                    tree.mtxLocal.translateY((height - scale.y) / 2);
                    tree.addComponent(new Script.ScriptTree);
                    tree.addComponent(new ƒ.ComponentRigidbody);
                    let treeRB = tree.getComponent(ƒ.ComponentRigidbody);
                    treeRB.typeBody = ƒ.BODY_TYPE.STATIC;
                    treeRB.initialization = ƒ.BODY_INIT.TO_PIVOT;
                    treeRB.isTrigger = true;
                    treeRB.collisionGroup = ƒ.COLLISION_GROUP.GROUP_3;
                    treeRB.mtxPivot.scaleY(height);
                    treeRB.mtxPivot.translateZ(1);
                }
                else {
                    trees.removeChild(tree);
                }
            }
        }
        addStone(random) {
            let stones = this.node.getChildrenByName("Stones")[0];
            for (let stone of stones.getChildren()) {
                let num = random.getRangeFloored(0, 101);
                if (num < this.stonePercentage) {
                    stone.getComponent(ƒ.ComponentMaterial).clrPrimary.setBytesRGBA(211, 211, 211, 255);
                }
                else {
                    stones.removeChild(stone);
                }
            }
        }
    }
    Script.ScriptGenerator = ScriptGenerator;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class ScriptStone extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(ScriptStone);
        // Properties may be mutated by users in the editor via the automatically created user interface
        percentage = 3;
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
        }
        addStone(random) {
            for (let stone of this.node.getChildren()) {
                let num = random.getRangeFloored(0, 11);
                if (num > this.percentage) {
                    stone.getComponent(ƒ.ComponentMaterial).clrPrimary.setBytesRGBA(211, 211, 211, 255);
                }
                else {
                    stone.activate(false);
                }
            }
        }
    }
    Script.ScriptStone = ScriptStone;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class ScriptTree extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(ScriptTree);
        // Properties may be mutated by users in the editor via the automatically created user interface
        percentage = 3;
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
        }
        chopTree(agent) {
            if (agent.item == "Axe") {
                let height = this.node.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.y;
                this.node.getComponent(ƒ.ComponentMesh).mtxPivot.scaleY(height - 1);
            }
        }
    }
    Script.ScriptTree = ScriptTree;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map