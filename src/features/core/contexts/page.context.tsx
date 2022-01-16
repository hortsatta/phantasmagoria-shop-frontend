import { FC, createContext, useState, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const history = useHistory();
  const [pageLoading, setPageLoading] = useBoolean(true);
  const [currentPageKey, setCurrentPageKey] = useState('');

  const showPage = useCallback(() => {
    const debounce = setTimeout(() => {
      setPageLoading.off();
      clearTimeout(debounce);
    }, 1000);
  }, []);

  const changePage = useCallback(
    (key?: string, path?: string, isReplace?: boolean, state?: any) => {
      if (location.pathname.replace(/\//g, '') === path?.replace(/\//g, '')) {
        return;
      }
      setPageLoading.on();
      setCurrentPageKey(key || '');
      isReplace ? history.replace(path || '', state) : history.push(path || '', state);
    },
    [location]
  );

  return (
    <PageContext.Provider value={{ pageLoading, currentPageKey, showPage, changePage }}>
      {children}
    </PageContext.Provider>
  );
};

export { PageContext, PageContextProvider };
