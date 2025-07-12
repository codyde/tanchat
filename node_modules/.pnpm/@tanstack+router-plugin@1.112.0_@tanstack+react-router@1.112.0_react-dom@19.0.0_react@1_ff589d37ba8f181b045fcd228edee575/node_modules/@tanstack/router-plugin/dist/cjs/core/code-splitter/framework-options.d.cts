type FrameworkOptions = {
    package: string;
    idents: {
        createFileRoute: string;
        lazyFn: string;
        lazyRouteComponent: string;
        dummyHMRComponent: string;
    };
    dummyHMRComponent: string;
};
export declare function getFrameworkOptions(framework: string): FrameworkOptions;
export {};
