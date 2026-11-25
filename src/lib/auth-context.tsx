import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export interface Workspace {
  id: string;
  name: string;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  workspace: Workspace | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
  refreshWorkspace: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDefaultWorkspace = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('workspaces')
      .select('id, name')
      .eq('owner_id', userId)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      setWorkspace(data);
      return;
    }

    // Fallback in case a user existed before the trigger ran
    const { data: created } = await supabase
      .from('workspaces')
      .insert({ owner_id: userId, name: 'Personal Workspace' })
      .select('id, name')
      .single();

    setWorkspace(created ?? null);
  }, []);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      const nextSession = data.session ?? null;
      setSession(nextSession);
      if (nextSession?.user) {
        await loadDefaultWorkspace(nextSession.user.id);
      }
      if (active) setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!active) return;
      setSession(nextSession ?? null);
      if (nextSession?.user) {
        await loadDefaultWorkspace(nextSession.user.id);
      } else {
        setWorkspace(null);
      }
      setLoading(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [loadDefaultWorkspace]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    return { error: error ? error.message : null };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    if (error) {
      return { error: error.message, needsConfirmation: false };
    }
    return { error: null, needsConfirmation: !data.session };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setWorkspace(null);
  };

  const refreshWorkspace = async () => {
    if (session?.user) {
      await loadDefaultWorkspace(session.user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        workspace,
        loading,
        signIn,
        signUp,
        signOut,
        refreshWorkspace,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
