import React from 'react';
import { useClerk } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";

/**
 * Componente de menu de usuário para ações de conta.
 * @returns {JSX.Element}
 */
const UserMenu = () => {
  const { signOut } = useClerk();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      // Redireciona para a home após o logout para evitar estados órfãos
      await signOut({ redirectUrl: '/' });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
        aria-label={t('auth.logout')}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span>{t('auth.logout')}</span>
      </button>
    </div>
  );
};

export default UserMenu;