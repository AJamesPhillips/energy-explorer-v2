
// https://stackoverflow.com/a/64522938/539490
export { }

declare global {
    interface Array<T> {
        first (): T | undefined
        last (): T | undefined
        find_last (predicate: (t: T) => boolean): T | undefined
    }
}



if (!Array.prototype.first) {
    Object.defineProperty(Array.prototype, "first", {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function first<T> (this: T[]): T | undefined {
            return this[0]
        }
    })
}



if (!Array.prototype.last) {
    Object.defineProperty(Array.prototype, "last", {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function last<T> (this: T[]): T | undefined {
            return this[this.length - 1]
        }
    })
}



if (!Array.prototype.find_last) {
    Object.defineProperty(Array.prototype, "find_last", {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function find_last<T> (this: T[], predicate: (t: T) => boolean): T | undefined {
            for (let index = this.length - 1; index >= 0; --index) {
                if (predicate(this[index]!)) return this[index]
            }
            return undefined
        }
    })
}


// Something is broken in the type system at the moment which causes code like this:
//
//     {["1", "2", "3"].map(value => <div key={value}> {value} </div>)}
//
// to show a TypeError of:
//
//     Type '{ children: string; key: string; className: string; }' is not assignable to type 'DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>'.
//       Property 'key' does not exist on type 'DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>'.ts(2322)
//
// The following types silence this and related errors:
//
declare module "react"
{
    // Augment all HTML element props to allow `key`
    interface HTMLAttributes<T>
    {
        key?: React.Key;
    }
    interface SVGProps<T>
    {
        key?: React.Key;
    }
}

declare module "react/jsx-runtime"
{
    namespace JSX
    {
        interface IntrinsicAttributes
        {
            key?: import("react").Key;
        }
    }
}
