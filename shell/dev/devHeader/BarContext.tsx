import { createContext, Dispatch, SetStateAction } from 'react';

interface BarContextInterface {
  bar: string,
  setBar: Dispatch<SetStateAction<string>>,
};

const BarContext = createContext<BarContextInterface>({
  bar: '',
  setBar: () => { }
});

export default BarContext;
