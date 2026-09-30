// প্রমাণীকরণ ধরন — টোকেন জোড়া ও নিরাপদ ব্যবহারকারী আকার।
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult extends TokenPair {
  user: AuthUser;
}
