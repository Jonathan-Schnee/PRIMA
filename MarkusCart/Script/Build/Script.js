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
    let chgcam = false;
    let keyCam = false;
    let pressed = false;
    let map;
    let ctrForward = new ƒ.Control("Forward", 7000, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(200);
    let ctrTurn = new ƒ.Control("Turn", 1000, 0 /* PROPORTIONAL */);
    ctrTurn.setDelay(50);
    let cart;
    let body;
    let forceNodes;
    let posForce;
    let mtxTerrain;
    let meshTerrain;
    let isGrounded = false;
    let dampTranslation;
    let dampRotation;
    let cmpCamera = new ƒ.ComponentCamera();
    let cameraNode = new ƒ.Node("Camera");
    cameraNode.addComponent(cmpCamera);
    let startCam;
    let fricMap;
    let can;
    let ctx;
    let imgData;
    async function start(_event) {
        viewport = _event.detail;
        viewport.calculateTransforms();
        startCam = viewport.camera;
        startCam.mtxPivot.translateY(160);
        startCam.mtxPivot.rotateX(90);
        let graph = viewport.getBranch();
        fricMap = ƒ.Project.resources["TextureImage|2021-12-13T22:47:30.419Z|92341"];
        can = document.createElement("canvas");
        ctx = can.getContext("2d");
        let img = fricMap.image;
        can.width = img.width;
        can.height = img.height;
        ctx.drawImage(img, 0, 0);
        imgData = ctx.getImageData(0, 0, img.width, img.height);
        cart = graph.getChildrenByName("Cart")[0];
        body = cart.getComponent(ƒ.ComponentRigidbody);
        dampTranslation = body.dampTranslation;
        dampRotation = body.dampRotation;
        map = graph.getChildrenByName("Tarrain")[0];
        meshTerrain = map.getComponent(ƒ.ComponentMesh).mesh;
        mtxTerrain = map.getComponent(ƒ.ComponentMesh).mtxWorld;
        graph.appendChild(cameraNode);
        let cmpTransformCamera = new ƒ.ComponentTransform();
        cameraNode.addComponent(cmpTransformCamera);
        cmpCamera.mtxPivot.translateZ(-8);
        cmpCamera.mtxPivot.translateY(5);
        cmpCamera.mtxPivot.rotateX(20);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);
    }
    function update(_event) {
        gravity();
        checkFric();
        ƒ.Physics.world.simulate(); // if physics is included and used
        if (isGrounded) {
            controls();
        }
        else {
            body.dampRotation = body.dampTranslation = 0;
        }
        camera();
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function controls() {
        body.dampTranslation = dampTranslation;
        body.dampRotation = dampRotation;
        let forward = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
        ctrForward.setInput(forward);
        body.applyForce(ƒ.Vector3.SCALE(cart.mtxLocal.getZ(), ctrForward.getOutput()));
        if (forward != 0) {
            let turn = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
            ctrTurn.setInput(turn);
            body.applyTorque(ƒ.Vector3.SCALE(ƒ.Vector3.Y(), ctrTurn.getOutput()));
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.T])) {
            ctx.putImageData(imgData, 0, 0);
            var dataURL = can.toDataURL();
            console.log(dataURL);
        }
    }
    function camera() {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
            if (!pressed) {
                chgcam = !chgcam;
                pressed = true;
            }
        }
        else {
            pressed = false;
        }
        keyCam = chgcam;
        if (keyCam) {
            let cartPosition = cart.mtxWorld.translation;
            cameraNode.mtxLocal.translation = cartPosition;
            cameraNode.mtxLocal.rotation = new ƒ.Vector3(0, cart.mtxLocal.rotation.y, 0);
            viewport.camera = cmpCamera;
        }
        else {
            viewport.camera = startCam;
        }
    }
    function gravity() {
        let maxHeight = 0.3;
        let minHeight = 0.2;
        forceNodes = cart.getChildren();
        let force = ƒ.Vector3.SCALE(ƒ.Physics.world.getGravity(), -body.mass / forceNodes.length);
        //let force: ƒ.Vector3 = ƒ.Vector3.SCALE( ƒ.Physics.world.getGravity(), -body.mass);
        isGrounded = false;
        for (let forceNode of forceNodes) {
            posForce = forceNode.getComponent(ƒ.ComponentMesh).mtxWorld.translation;
            let terrainInfo = meshTerrain.getTerrainInfo(posForce, mtxTerrain);
            let height = posForce.y - terrainInfo.position.y;
            if (height < maxHeight) {
                body.applyForceAtPoint(ƒ.Vector3.SCALE(force, (maxHeight - height) / (maxHeight - minHeight)), posForce);
                isGrounded = true;
            }
        }
    }
    function checkFric() {
        let mapMesh = map.getComponent(ƒ.ComponentMesh);
        let imgPos = new ƒ.Vector2(cart.mtxLocal.translation.z + mapMesh.mtxPivot.scaling.z / 2, cart.mtxLocal.translation.x + mapMesh.mtxPivot.scaling.x / 2);
        let pxlfac = mapMesh.mtxPivot.scaling.x / imgData.width;
        let pxlPos = new ƒ.Vector2((imgPos.x / pxlfac) | 0, (imgPos.y / pxlfac) | 0);
        let pxlArr = pxlPos.x * imgData.width + pxlPos.y;
        imgData.data[pxlArr * 4] = 2;
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map