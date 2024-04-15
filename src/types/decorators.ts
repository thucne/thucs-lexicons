function Logger(prefix: string) {
    return function (_: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            console.log(`[${prefix}] - ${propertyKey} - ${args}`);
            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}

export { Logger };
