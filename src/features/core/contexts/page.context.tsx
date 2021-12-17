import { FC, createContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useBoolean } from '@chakra-ui/react';

type PageContextType = {
  pageLoading: boolean;
  currentPageKey: string;
  showPage: () => void;
  changePage: (key?: string, path?: string, isReplace?: boolean, state?: any) => void;
};

const PageContext = createContext<PageContextType>({
  pageLoading: false,
  currentPageKey: '',
  showPage: () => null,
  changePage: () => null
});

const PageContextProvider: FC = ({ children }) => {
  const history = useHistory();
  const [pageLoading, setPageLoading] = useBoolean(true);
  const [currentPageKey, setCurrentPageKey] = useState('');

  const showPage = () => {
    const debounce = setTimeout(() => {
      setPageLoading.off();
      clearTimeout(debounce);
    }, 1000);
  };

  const changePage = (key?: string, path?: string, isReplace?: boolean, state?: any) => {
    setPageLoading.on();
    setCurrentPageKey(key || '');
    isReplace ? history.replace(path || '', state) : history.push(path || '', state);
  };

  return (
    <PageContext.Provider value={{ pageLoading, currentPageKey, showPage, changePage }}>
      {children}
    </PageContext.Provider>
  );
};

export { PageContext, PageContextProvider };
