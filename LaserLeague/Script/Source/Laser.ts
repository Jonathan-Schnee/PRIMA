namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization
  
    export class Laser extends ƒ.ComponentScript {
      // Register the script as component for use in the editor via drag&drop
      public static readonly iSubclass: number = ƒ.Component.registerSubclass(Laser);
      // Properties may be mutated by users in the editor via the automatically created user interface
      public message: string = "Laser added to ";
  
      public viewport: ƒ.Viewport;
  
      public rotationSpeed: number;
      public deltaTime: number;
  
      public gameObject: ƒ.Node;
      public rotationTransform: ƒ.ComponentTransform;
  
      constructor() {
        super();

        this.rotationSpeed = 90;

        // Don't start when running in editor
        if (ƒ.Project.mode == ƒ.MODE.EDITOR)
          return;
  
        // Listen to this component being added to or removed from a node
        this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
        this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
  
      }
  
      // Activate the functions of this component as response to events
      public hndEvent = (_event: Event) => {
        switch (_event.type) {
          case ƒ.EVENT.COMPONENT_ADD:
            ƒ.Debug.log(this.message, this.node);
            this.start();
            break;
          case ƒ.EVENT.COMPONENT_REMOVE:
            this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
            this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
            break;
        }
      }
  
      public start (): void  {
  
        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
      }
  
      public update = (_event: Event): void =>{
        this.deltaTime = ƒ.Loop.timeFrameReal / 1000;
        this.node.mtxLocal.rotateZ(this.rotationSpeed * this.deltaTime);
      }
      
      public static collision(agent: Agent, laserformation: ƒ.Node): boolean{
        let col: boolean = false;
        for(let las of laserformation.getChildren()){
          let arms: ƒ.Node = las.getChildrenByName("Arms")[0]
          for(let beam of arms.getChildren()){
            let posLocal1: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beam.mtxWorldInverse, true);
            if(posLocal1.x <= 2.8 && posLocal1.x >= 0 && posLocal1.y <= 0.25 && posLocal1.y >= -0.25)
              col = true
            
          }
        }
        return col;
      }

      // protected reduceMutator(_mutator: ƒ.Mutator): void {
      //   // delete properties that should not be mutated
      //   // undefined properties and private fields (#) will not be included by default
      // }
    }
  }