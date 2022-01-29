namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization
  

    export class ScriptStone extends ƒ.ComponentScript {
      // Register the script as component for use in the editor via drag&drop
      public static readonly iSubclass: number = ƒ.Component.registerSubclass(ScriptStone);
      // Properties may be mutated by users in the editor via the automatically created user interface
      public percentage: number = 3;


      constructor() {
        super();
  
        // Don't start when running in editor
        if (ƒ.Project.mode == ƒ.MODE.EDITOR)
          return;
  
        // Listen to this component being added to or removed from a node
      }
      public addStone(random: ƒ.Random) : void {
        for(let stone of this.node.getChildren()){

          let num = random.getRangeFloored(0, 11);
          if(num> this.percentage){
            stone.getComponent(ƒ.ComponentMaterial).clrPrimary.setBytesRGBA(211,211,211,255)
          }
          else{
            stone.activate(false);
          }
        }
      }
    }
  }