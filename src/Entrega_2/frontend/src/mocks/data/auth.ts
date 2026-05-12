import { User } from '@/types';

export const usersMock: (User & { password?: string, token?: string })[] = [
  {
    id: 1,
    email: 'user1@email.com',
    password: '123',
    nome: 'User 1',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    preferences: { theme: 'dark' },
    token: 'token-adm-123',
    username: 'user1'
  },
  {
    id: 2,
    email: 'user2@email.com',
    password: '123',
    nome: 'User 2',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    preferences: { theme: 'dark' },
    token: 'token-adm-123',
    username: 'user2'
  },
];

export interface UserProjectRole {
  userId: number | string;
  projectId: number | string;
  papel: 'adm' | 'membro';
}

export const userProjectRolesMock: UserProjectRole[] = [
  { userId: 1, projectId: 1, papel: 'adm' },
  { userId: 1, projectId: 2, papel: 'membro' },
  { userId: 1, projectId: 3, papel: 'adm' },
  { userId: 1, projectId: 4, papel: 'membro' },
  { userId: 2, projectId: 1, papel: 'membro' },
  { userId: 2, projectId: 2, papel: 'adm' },
];
