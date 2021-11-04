namespace Script{
    import ƒ = FudgeCore
    
    export class Agent extends ƒ.Node{
    constructor(){
        super("Agent");
        this.addComponent(new ƒ.ComponentTransform);
        this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshPyramid("MeshAgent")));
        this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("MaterialAgent", ƒ.ShaderUniColor,new ƒ.CoatColored(new ƒ.Color(1,0,1,1)))));
        this.mtxLocal.translateZ(0.5);
        this.getComponent(ƒ.ComponentMesh).mtxPivot.scale(ƒ.Vector3.ONE(0.5));
    }
    }
}