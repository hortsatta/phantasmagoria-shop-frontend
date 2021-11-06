import { FC, createContext, useEffect, useState } from 'react';
import { useBoolean } from '@chakra-ui/react';

type PageContextType = {
  pageLoading: boolean;
  setCurrentPath: any;
  showPage: () => void;
};

const PageContext = createContext<PageContextType>({
  pageLoading: false,
  setCurrentPath: () => null,
  showPage: () => null
});

const PageContextProvider: FC = ({ children }) => {
  const [pageLoading, setPageLoading] = useBoolean(true);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setPageLoading.on();
  }, [currentPath]);

  const showPage = () => {
    const debounce = setTimeout(() => {
      setPageLoading.off();
      clearTimeout(debounce);
    }, 1000);
  };

  return (
    <PageContext.Provider value={{ pageLoading, setCurrentPath, showPage }}>
      {children}
    </PageContext.Provider>
  );
};

export { PageContext, PageContextProvider };
