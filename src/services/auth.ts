import { signUp, confirmSignUp, signIn, signOut, getCurrentUser, deleteUser } from 'aws-amplify/auth';

export interface AuthUser {
  userId: string;
  email: string;
  isSignedIn: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface ConfirmSignUpData {
  email: string;
  confirmationCode: string;
}


export async function registerUser(data: SignUpData): Promise<{ success: boolean; error?: string }> {
  try {
    await signUp({
      username: data.email,
      password: data.password,
      options: {
        userAttributes: {
          email: data.email,
        },
      },
    });
    return { success: true };
  } catch (error: any) {

    return { success: false, error: error.message || 'Registration failed' };
  }
}


export async function confirmRegistration(data: ConfirmSignUpData): Promise<{ success: boolean; error?: string }> {
  try {
    await confirmSignUp({
      username: data.email,
      confirmationCode: data.confirmationCode
    });
    return { success: true };
  } catch (error: any) {

    return { success: false, error: error.message || 'Confirmation failed' };
  }
}


export async function loginUser(data: SignInData): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const { isSignedIn } = await signIn({
      username: data.email,
      password: data.password
    });
    
    if (isSignedIn) {
      const authUser: AuthUser = {
        userId: data.email,
        email: data.email,
        isSignedIn: true,
      };
      return { success: true, user: authUser };
    }
    
    return { success: false, error: 'Login failed' };
  } catch (error: any) {

    
    let message = error?.message || 'Login failed';
    const errorCode = error?.name;
    
    if (errorCode === 'UserNotConfirmedException') {
      message = 'Account non confermato. Controlla l\'email e conferma la registrazione.';
    } else if (errorCode === 'NotAuthorizedException') {
      message = 'Credenziali non valide. Verifica email e password.';
    } else if (errorCode === 'UserNotFoundException') {
      message = 'Utente non trovato. Registrati prima di accedere.';
    }
    
    return { success: false, error: message };
  }
}


export async function logoutUser(): Promise<{ success: boolean; error?: string }> {
  try {
    await signOut();
    return { success: true };
  } catch (error: any) {

    return { success: false, error: error?.message || 'Logout failed' };
  }
}


export async function checkAuthStatus(): Promise<{ isAuthenticated: boolean; user?: AuthUser }> {
  try {
    const user = await getCurrentUser();
    
    if (user) {
      const authUser: AuthUser = {
        userId: user.username,
        email: user.signInDetails?.loginId || user.username,
        isSignedIn: true,
      };
      return { isAuthenticated: true, user: authUser };
    }
    
    return { isAuthenticated: false };
  } catch (error) {

    return { isAuthenticated: false };
  }
}


export async function deleteUserAccount(): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteUser();
    return { success: true };
  } catch (error: any) {

    return { success: false, error: error?.message || 'Failed to delete account' };
  }
}