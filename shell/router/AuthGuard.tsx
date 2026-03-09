import React, { useEffect, useState } from 'react';

import { ensureAuthenticatedUser, getAuthenticatedUser } from '../../runtime/auth';

interface AuthGuardProps {
  children: React.ReactNode,
  requireAuthenticatedUser?: boolean,
}

/**
 * AuthGuard component ensures authentication before rendering children
 */
const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuthenticatedUser = false,
}) => {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // no auth required
      if (!requireAuthenticatedUser) {
        setIsChecking(false);
        return;
      }

      // user already authenticated
      const user = getAuthenticatedUser();
      if (user) {
        setIsChecking(false);
        return;
      }

      // User not authenticated but route requires auth
      const redirectUrl = `${window.location.origin}${window.location.pathname}${window.location.search}`;
      try {
        await ensureAuthenticatedUser(redirectUrl);
      } catch (error) {
        if ((error as Error & { isRedirecting?: boolean })?.isRedirecting) return;
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [requireAuthenticatedUser]);

  if (isChecking && requireAuthenticatedUser) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
