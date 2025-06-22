import { createContext, Dispatch, SetStateAction } from 'react';

interface FooContextInterface {
  foo: string,
  setFoo: Dispatch<SetStateAction<string>>,
};

const FooContext = createContext<FooContextInterface>({
  foo: '',
  setFoo: () => { }
});

export default FooContext;
