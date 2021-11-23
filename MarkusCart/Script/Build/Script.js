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
    async function start(_event) {
        viewport = _event.detail;
        let graph = viewport.getBranch();
        let cmpRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE);
        let heightMap = new ƒ.TextureImage();
        await heightMap.load("../Texture/heightC.png");
        let mtrTexFlat = ƒ.Project.resources["Material|2021-11-23T02:36:34.207Z|12139"];
        let material = new ƒ.ComponentMaterial(mtrTexFlat);
        let gridMeshFlat = new ƒ.MeshRelief("HeightMap", heightMap);
        let grid = new ƒ.ComponentMesh(gridMeshFlat);
        console.log(grid);
        grid.mtxPivot.scale(new ƒ.Vector3(100, 10, 100));
        grid.mtxPivot.translateY(-grid.mesh.boundingBox.max.y);
        let transfom = new ƒ.ComponentTransform();
        map.addComponent(grid);
        map.addComponent(material);
        map.addComponent(cmpRigidbody);
        map.addComponent(transfom);
        graph.addChild(map);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);
    }
    function update(_event) {
        console.log();
        // ƒ.Physics.world.simulate();  // if physics is included and used
        ƒ.Physics.world.simulate();
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map