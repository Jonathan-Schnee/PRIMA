declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
}
declare namespace Script {
    import ƒ = FudgeCore;
    class ScriptAgent extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        item: string;
        private agentRB;
        constructor();
        hndEvent: (_event: Event) => void;
        use: (_event: Event) => void;
        getRB(): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class ScriptGenerator extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        private treePercentage;
        private stonePercentage;
        constructor();
        addTree(random: ƒ.Random): void;
        addStone(random: ƒ.Random): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class ScriptStone extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        percentage: number;
        constructor();
        addStone(random: ƒ.Random): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class ScriptTree extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        percentage: number;
        constructor();
        chopTree(agent: ScriptAgent): void;
    }
}
