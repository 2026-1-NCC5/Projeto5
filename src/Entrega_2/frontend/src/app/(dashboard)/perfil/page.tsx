'use client';

import { useState, useEffect, useRef } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { useAuth } from '@/hooks/useAuth';
import styles from './page.module.css';

export default function PerfilPage() {
  const { user, refreshUser, isLoading: contextLoading } = useProject();
  const { updateProfile, isLoading: isSaving } = useAuth();
  
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [celular, setCelular] = useState('');
  const [avatar, setAvatar] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setNome(user.nome || '');
      setSobrenome(user.sobrenome || '');
      setUsername(user.username || '');
      setEmail(user.email || '');
      setCelular(user.celular || '');
      setAvatar(user.avatar || 'https://ui-avatars.com/api/?name=' + user.nome + '&background=6366f1&color=fff');
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile({
        nome,
        sobrenome,
        username,
        email,
        celular,
        avatar
      });
      
      alert('Perfil atualizado com sucesso!');
      await refreshUser();
      setIsEditing(false);
    } catch (error: any) {
      alert(error.message || 'Erro ao atualizar perfil.');
    }
  };

  if (contextLoading || !user) {
    return <div className={styles.loading}>Carregando perfil...</div>;
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Meu Perfil</h1>
        <p className={styles.subtitle}>Gerencie suas informações pessoais e configurações de conta.</p>
      </header>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              <img src={avatar} alt={nome} className={styles.avatar} />
              <button 
                type="button"
                className={styles.cameraBtn}
                onClick={() => fileInputRef.current?.click()}
                title="Alterar Foto"
              >
                <span className="material-symbols-outlined">photo_camera</span>
              </button>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*"
              onChange={handleAvatarChange}
            />
            <h3 className={styles.sidebarName}>{user.nome} {user.sobrenome}</h3>
            <p className={styles.sidebarRole}>Administrador</p>
          </div>
          
          <nav className={styles.nav}>
            <div className={`${styles.navItem} ${styles.navItemActive}`}>
              <span className="material-symbols-outlined">person</span>
              Dados Pessoais
            </div>
          </nav>
        </div>

        <div className={styles.mainContent}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Dados Pessoais</h2>
              {!isEditing && (
                <button 
                  type="button"
                  className={styles.editToggleBtn}
                  onClick={() => setIsEditing(true)}
                >
                  <span className="material-symbols-outlined">edit</span>
                  Editar Perfil
                </button>
              )}
            </div>

            <form onSubmit={handleSave} className={styles.form}>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="nome">Nome</label>
                  <input 
                    id="nome"
                    type="text" 
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    disabled={!isEditing}
                    required 
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="sobrenome">Sobrenome</label>
                  <input 
                    id="sobrenome"
                    type="text" 
                    value={sobrenome}
                    onChange={(e) => setSobrenome(e.target.value)}
                    disabled={!isEditing}
                    required 
                  />
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="username">Username</label>
                  <input 
                    id="username"
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={!isEditing}
                    required 
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">E-mail</label>
                  <input 
                    id="email"
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing}
                    required 
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="celular">Telefone / Celular</label>
                <input 
                  id="celular"
                  type="text" 
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                  placeholder="(00) 00000-0000"
                  disabled={!isEditing}
                />
              </div>

              {isEditing && (
                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    className={styles.cancelBtn}
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className={styles.saveBtn}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              )}
            </form>
          </section>

          <section className={styles.section} style={{ marginTop: '2rem' }}>
            <h2 className={styles.sectionTitle}>Informações da Conta</h2>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>ID do Usuário:</span>
              <span className={styles.infoValue}>{user.id}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Membro desde:</span>
              <span className={styles.infoValue}>
                {new Date().toLocaleDateString('pt-BR')}
              </span>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
