function Logger(prefix: string) {
    return function (_: any, _2: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        const originalConsole = console.log;

        descriptor.value = function (...args: any[]) {
            const prefixed = [`[${prefix}] `].concat(args);
            originalConsole.apply(console, prefixed);
            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}

export { Logger };
