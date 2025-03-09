declare module 'prettier/parser-babel' {
    const parser: any;
    export = parser;
}

declare module 'prettier/standalone' {
    export interface Options {
        parser?: string;
        plugins?: any[];
        semi?: boolean;
        singleQuote?: boolean;
        tabWidth?: number;
        useTabs?: boolean;
        printWidth?: number;
        bracketSpacing?: boolean;
    }

    export function format(source: string, options?: Options): string;
    export function check(source: string, options?: Options): boolean;
    
    const prettier: {
        format: typeof format;
        check: typeof check;
    };
    
    export default prettier;
}

declare module 'prettier' {
    export * from 'prettier/standalone';
}
