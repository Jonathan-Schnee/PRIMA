namespace Script {
    import ƒ = FudgeCore

    export class Agent extends ƒ.Node {
        
        public healthvalue: number = 1;
        public name: string = "Agent Smith";
        private cmpAudio: ƒ.ComponentAudio;
        constructor() {
            super("Agent");
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
            this.cmpAudio.volume = 0.1;
            this.addComponent(this.cmpAudio)
            this.addComponent(new ƒ.ComponentAudioListener());
        }

        public health(): void {
            gameState.health = this.healthvalue;
        }

        public playMusic(): void{
            if(this.cmpAudio.isPlaying)
                this.cmpAudio.play(false);
            else
                this.cmpAudio.play(true)
        }
    }
}