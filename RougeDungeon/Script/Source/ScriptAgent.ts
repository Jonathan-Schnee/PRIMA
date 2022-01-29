namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization
    export class ScriptAgent extends ƒ.ComponentScript {    
      // Register the script as component for use in the editor via drag&drop
      public static readonly iSubclass: number = ƒ.Component.registerSubclass(ScriptAgent);
      // Properties may be mutated by users in the editor via the automatically created user interface
      public message: string = "CustomComponentScript added to ";
      public item: string = "Axe";
      private agentRB: ƒ.ComponentRigidbody;
      constructor() {
        super();
        // Don't start when running in editor
        if (ƒ.Project.mode == ƒ.MODE.EDITOR)
          return;
  
        
        // Listen to this component being added to or removed from a node
        this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
        this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
      }
  
      // Activate the functions of this component as response to events
      public hndEvent = (_event: Event): void => {

        switch (_event.type) {
          case ƒ.EVENT.COMPONENT_ADD:
            ƒ.Debug.log(this.message, this.node);
            break;
          case ƒ.EVENT.COMPONENT_REMOVE:
            this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
            this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
            break;
        }
      }
      public use = (_event: Event): void => {
        let tree: ƒ.Node
        if(this.agentRB.triggerings.length != 0){
          for(let rb of this.agentRB.triggerings){
            if(rb.collisionGroup == ƒ.COLLISION_GROUP.GROUP_3){
              tree = rb.node;
              break;
            }
          }
        }
        if(this.item == "Axe"){
          //Call Trigger from Tree and call the Method in the ScriptTree
          console.log("hit2");
          let treemesh = tree.getComponent(ƒ.ComponentMesh);
          let treeheight : ƒ.Vector3 = treemesh.mtxPivot.scaling.clone;
          treemesh.mtxPivot.scaling = new ƒ.Vector3(treeheight.x, treeheight.y - 1, treeheight.z);
          console.log(tree.mtxLocal.translation.toString());
          ƒ.Recycler.dumpAll();
          tree.mtxLocal.translation = new ƒ.Vector3(1,1,1);
          tree.mtxLocal.translation = new ƒ.Vector3(1,1,1);
          tree.mtxLocal.translation = new ƒ.Vector3(1,1,1);
          console.log(tree.mtxLocal.translation.toString());
          console.log(tree.mtxLocal.translation.toString());
          console.log(tree.mtxLocal.translation.toString());
        }
        
        if(this.item == "Pickaxe"){
          //Call Trigger from Tree and call the Method in the ScriptTree
          console.log("hit2");
        }
        
        if(this.item == "Sword"){
          //Call Trigger from Tree and call the Method in the ScriptTree
          console.log("hit3");
        }
    }
    public setRB(): void {
      this.agentRB = this.node.getComponent(ƒ.ComponentRigidbody);
      console.log(this.node.getComponent(ƒ.ComponentRigidbody));
    }
  }
}
