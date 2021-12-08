export interface IUser {
  uid: string;
  email: string | null;
  photoURL?: string | null;
  displayName?: string | null;
  emailVerified: boolean;
}
