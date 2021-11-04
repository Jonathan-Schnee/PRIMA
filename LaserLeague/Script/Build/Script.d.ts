declare namespace Script {
    import ƒ = FudgeCore;
    class Agent extends ƒ.Node {
        constructor();
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CollisionDetection extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        viewport: ƒ.Viewport;
        gameObject: ƒ.Node;
        rotationTransform: ƒ.ComponentTransform;
        constructor();
        hndEvent: (_event: Event) => void;
        start(): void;
        update: (_event: Event) => void;
    }
}
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
    import ƒ = FudgeCore;
    class LaserRotator extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        viewport: ƒ.Viewport;
        rotationSpeed: number;
        deltaTime: number;
        gameObject: ƒ.Node;
        rotationTransform: ƒ.ComponentTransform;
        constructor();
        hndEvent: (_event: Event) => void;
        start(): void;
        update: (_event: Event) => void;
    }
}
declare namespace Script {
}