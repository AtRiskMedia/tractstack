import React from 'react';
import { DrupalContext } from '../../context';

export const useLazyLogout = () => {
  const { logoutUser } = React.useContext(DrupalContext);
  const [execute, setExecute] = React.useState<boolean>(false);

  React.useEffect(() => {
    async function loadData() {
      // Typescript checks
      if (!logoutUser) return;

      try {
        if (execute) {
          logoutUser();
          setExecute(false);
        }
      } catch (error) {
        setExecute(false);
      }
    }
    loadData();
  }, [execute]);

  const logout = () => setExecute(true);
  return [logout];
};
