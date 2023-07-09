export default interface Administrator {
  administratorId: number;
  username: string;
  passwordHash: string | null;
  createdAt: string;
  isActive: boolean;
}
