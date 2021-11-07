import { FC, createContext } from 'react';
import { useBoolean } from '@chakra-ui/react';

type PageContextType = {
  pageLoading: boolean;
  setPageLoading: any;
  showPage: () => void;
};

const PageContext = createContext<PageContextType>({
  pageLoading: false,
  setPageLoading: null,
  showPage: () => null
});

const PageContextProvider: FC = ({ children }) => {
  const [pageLoading, setPageLoading] = useBoolean(true);

  const showPage = () => {
    const debounce = setTimeout(() => {
      setPageLoading.off();
      clearTimeout(debounce);
    }, 1000);
  };

  return (
    <PageContext.Provider value={{ pageLoading, showPage, setPageLoading }}>
      {children}
    </PageContext.Provider>
  );
};

export { PageContext, PageContextProvider };
