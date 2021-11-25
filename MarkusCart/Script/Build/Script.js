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
    let map = new ƒ.Node("ownTarrain");
    let ctrForward = new ƒ.Control("Forward", 10, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(50000);
    let ctrTurn = new ƒ.Control("Turn", 100, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(50);
    let cart;
    let mtxTerrain;
    let meshTerrain;
    async function start(_event) {
        viewport = _event.detail;
        viewport.calculateTransforms();
        viewport.camera.mtxPivot.translateY(120);
        viewport.camera.mtxPivot.rotateX(90);
        let graph = viewport.getBranch();
        cart = graph.getChildrenByName("Cart")[0];
        //let cmpRigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);
        let heightMap = new ƒ.TextureImage();
        await heightMap.load("../Texture/heightC.png");
        let mtrTex = ƒ.Project.resources["Material|2021-11-23T14:02:06.634Z|31225"];
        let material = new ƒ.ComponentMaterial(mtrTex);
        console.log(material);
        let gridMeshFlat = new ƒ.MeshRelief("HeightMap", heightMap);
        let grid = new ƒ.ComponentMesh(gridMeshFlat);
        grid.mtxPivot.scale(new ƒ.Vector3(100, 10, 100));
        grid.mtxPivot.translateY(-grid.mesh.boundingBox.max.y / 2);
        let transfom = new ƒ.ComponentTransform();
        map.addComponent(grid);
        map.addComponent(material);
        //map.addComponent(cmpRigidbody)
        map.addComponent(transfom);
        graph.addChild(map);
        meshTerrain = map.getComponent(ƒ.ComponentMesh).mesh;
        mtxTerrain = map.getComponent(ƒ.ComponentMesh).mtxWorld;
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);
    }
    function update(_event) {
        // ƒ.Physics.world.simulate();  // if physics is included and used
        //ƒ.Physics.world.simulate();
        let deltaTime = ƒ.Loop.timeFrameReal / 1000;
        let forward = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
        ctrForward.setInput(forward);
        cart.mtxLocal.translateZ(ctrForward.getOutput() * deltaTime);
        if (forward != 0) {
            let turn = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
            ctrTurn.setInput(turn);
            cart.mtxLocal.rotateY(ctrTurn.getOutput() * deltaTime);
        }
        let terrainInfo = meshTerrain.getTerrainInfo(cart.mtxLocal.translation, mtxTerrain);
        cart.mtxLocal.translation = terrainInfo.position;
        cart.mtxLocal.showTo(ƒ.Vector3.SUM(terrainInfo.position, cart.mtxLocal.getZ()), terrainInfo.normal);
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map