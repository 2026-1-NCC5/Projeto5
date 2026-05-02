import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# 1. Carregar a matriz gerada na Entrega 1
df = pd.read_csv('matriz_imagem_alimento.csv')

def aplicar_transformacao_csv(dataframe, matriz_a):
    """
    Aplica a transformação linear T(v) = A.v nas coordenadas X e Y do CSV.
    """
    # Extrair coordenadas como vetores [x, y]
    coords = dataframe[['Coluna_X', 'Linha_Y']].values
    
    # Aplicar a multiplicação matricial: v' = A * v
    # Transpomos para multiplicar (2x2) por (2xN)
    coords_transformadas = np.dot(matriz_a, coords.T).T
    
    # Criar novo dataframe com as coordenadas transformadas mantendo as cores RGB
    df_result = dataframe.copy()
    df_result['Coluna_X'] = coords_transformadas[:, 0]
    df_result['Linha_Y'] = coords_transformadas[:, 1]
    
    return df_result

def visualizar_resultado(df_orig, df_trans, titulo):
    # Encontrar limites para manter a proporção na visualização
    plt.figure(figsize=(10, 5))
    
    # Reconstrução simplificada para plotagem (Scatter plot preserva a geometria das coordenadas)
    # Usamos cores normalizadas (0-1) para o matplotlib
    colors = df_trans[['Red', 'Green', 'Blue']].values / 255.0
    
    plt.scatter(df_trans['Coluna_X'], -df_trans['Linha_Y'], c=colors, s=1, marker='s')
    plt.title(titulo)
    plt.axis('equal')
    plt.show()

# --- DEFINIÇÃO DAS MATRIZES ---

# A. Reflexão Vertical
M_ref = np.array([[-1, 0], 
                  [ 0, 1]])

# B. Escalonamento (Redução 50%)
M_esc = np.array([[0.5, 0], 
                  [0, 0.5]])

# C. Rotação (45 graus)
theta = np.radians(45)
M_rot = np.array([[np.cos(theta), -np.sin(theta)],
                  [np.sin(theta),  np.cos(theta)]])

# D. Cisalhamento Horizontal
M_cis = np.array([[1, 0.2], 
                  [0, 1]])

# --- EXECUÇÃO ---

print("Processando transformações lineares sobre a matriz de pixels...")

# Exemplo: Aplicando Cisalhamento
df_cisalhado = aplicar_transformacao_csv(df, M_cis)
visualizar_resultado(df, df_cisalhado, "Cisalhamento Horizontal (via Multiplicação Matricial)")

# Exemplo: Aplicando Escalonamento
df_reduzido = aplicar_transformacao_csv(df, M_esc)
visualizar_resultado(df, df_reduzido, "Escalonamento (via Multiplicação Matricial)")

# Exemplo: Aplicando Rotação
df_rotacionado = aplicar_transformacao_csv(df, M_rot)
visualizar_resultado(df, df_rotacionado, "Rotação (via Multiplicação Matricial)")

# Exemplo: Aplicando Reflexão Vertical
df_refletido = aplicar_transformacao_csv(df, M_ref)
visualizar_resultado(df, df_refletido, "Reflexão Vertical (via Multiplicação Matricial)")