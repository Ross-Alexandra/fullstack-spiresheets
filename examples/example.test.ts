// requireActual ensures you get the real file
// instead of an automock
// we use import type and <typeof ...> to still get types
import type * as Example from './index';
const {exampleTestFunction} = jest.requireActual<typeof Example>('./index');

describe('The function called by the example tests', () => {
    test('Should always return 42', () => {
        expect(exampleTestFunction()).toBe(42);
    });
});

// required to make the isolatedModules config happy
export {}
