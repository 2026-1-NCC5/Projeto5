import { ProjetoPapel } from '@/types';

export interface UserProjectRole {
  userId: number | string;
  projectId: number | string;
  papel: ProjetoPapel;
}

export const userProjectRolesMock: UserProjectRole[] = [
  {
    userId: 1, // Admin User
    projectId: 1, // Lideranças Empáticas
    papel: 'adm'
  },
  {
    userId: 1, // Admin User
    projectId: 2, // Sustentabilidade Urbana
    papel: 'membro'
  },
  {
    userId: 2, // Member User
    projectId: 1, // Lideranças Empáticas
    papel: 'membro'
  },
  {
    userId: 2, // Member User
    projectId: 2, // Sustentabilidade Urbana
    papel: 'adm'
  }
];
