namespace Script {
    import ƒ = FudgeCore

    export class Agent extends ƒ.Node {
        
        public healthvalue: number = 1;
        public name: string = "Agent Smith";
        private cmpAudio: ƒ.ComponentAudio;
        private hit: boolean;
        constructor() {
            super("Agent");
            this.hit = false;
            this.addComponent(new ƒ.ComponentTransform);
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshPyramid("MeshAgent")));
            this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("MaterialAgent", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 0, 1, 1)))));
            this.mtxLocal.translateZ(0.5);
            this.getComponent(ƒ.ComponentMesh).mtxPivot.scale(ƒ.Vector3.ONE(0.5));
            gameState.name = this.name;
            let css = Hud.changeCSS("name");
            css.style.width = this.name.length-1 + "ch";
            const audio: ƒ.Audio = new ƒ.Audio("Sound/trancyvania.mp3");
            this.cmpAudio = new ƒ.ComponentAudio(audio, true);
            this.cmpAudio.volume = 1;
            this.addComponent(this.cmpAudio)
            

        }

        public health(): void {
            gameState.health = this.healthvalue;
        }

        public playMusic(bol: boolean): void{
            if(bol!=this.hit){
                this.hit = bol
                //console.log(this.hit)
                //this.cmpAudio.play(this.hit);
            }
        }
    }
}