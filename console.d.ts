/*
this prevents vs code from importing the console
ty brandon
https://github.com/Microsoft/TypeScript/issues/30471#issuecomment-474963436
*/

declare module 'console' {
    export = typeof import('console')
}
