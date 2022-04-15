declare class Base {
    tag: string;
    refs: Record<string, HTMLElement>;
    private readonly watchFuncs;
    section: HTMLElement | null | undefined;
    watch: (() => object) | undefined;
    style: any;
    constructor(_tag: string);
    init(cb: () => void | null): void;
    setWatch(): void;
    setEmotion: () => void;
    startWatcher: (keys: any) => void;
    removeWatch(): void;
    _addEvents: () => void;
    getReference(): void;
    destroy(): void;
}
export declare class Page extends Base {
    constructor(_tag: string, num?: null);
}
export declare class Component extends Base {
    constructor(props: any);
}
export declare function createComponent(_tagName: string, _class: any): any[];
export {};
//# sourceMappingURL=index.d.ts.map