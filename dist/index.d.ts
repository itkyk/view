declare class Base {
    tag: string;
    refs: Record<string, HTMLElement>;
    private readonly watchFuncs;
    section: HTMLElement | null | undefined;
    watch: (() => object) | undefined;
    style: any;
    emit: undefined | (() => Record<string, () => unknown>);
    constructor(_tag: string, _section: HTMLElement);
    init(cb: () => void | null): void;
    private setWatch;
    private setEmotion;
    private startWatcher;
    removeWatch(): void;
    private addEvents;
    private getReference;
    private setEmit;
    private getEmit;
    view: () => {
        emit: (name: string) => () => unknown;
    };
    destroy(): void;
}
export declare class Component extends Base {
    constructor(props: any);
}
export declare function createComponent(_tagName: string, _class: any): any[];
export {};
//# sourceMappingURL=index.d.ts.map