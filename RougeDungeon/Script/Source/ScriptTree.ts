namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization
  

    export class ScriptTree extends ƒ.ComponentScript {
      // Register the script as component for use in the editor via drag&drop
      public static readonly iSubclass: number = ƒ.Component.registerSubclass(ScriptTree);
      // Properties may be mutated by users in the editor via the automatically created user interface
      public percentage: number = 3;


      constructor() {
        super();
  
        // Don't start when running in editor
        if (ƒ.Project.mode == ƒ.MODE.EDITOR)
          return;
  
        // Listen to this component being added to or removed from a node
      }

      public chopTree(agent : ScriptAgent){
        if(agent.item == "Axe"){
          let height : number = this.node.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.y;
          this.node.getComponent(ƒ.ComponentMesh).mtxPivot.scaleY(height - 1);
        }
      }
    }
  }