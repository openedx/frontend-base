import { ReactNode, useMemo, useState } from 'react';
import FooContext from './FooContext';

function getFoo() {
  return 'Foo';
}

interface FooProviderProps {
  children?: ReactNode,
}

export default function FooProvider({ children }: FooProviderProps) {
  const [foo, setFoo] = useState(getFoo());

  const fooContextValue = useMemo(() => ({
    foo,
    setFoo,
  }), [foo, setFoo]);

  return (
    <FooContext.Provider value={fooContextValue}>
      {children}
    </FooContext.Provider>
  );
};
