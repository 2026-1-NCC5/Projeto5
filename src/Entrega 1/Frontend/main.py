import os
import cv2
from ultralytics import YOLO

# 1. Carregar o modelo customizado gerado pelo seu treinamento
# O YOLO salva os resultados na pasta 'runs/detect/' na raiz do repositório.
# Se você treinar de novo e gerar um 'train13', lembre-se de atualizar esse caminho!
caminho_modelo = r'..\..\..\runs\detect\train12\weights\best.pt'

if not os.path.exists(caminho_modelo):
    print(f"AVISO: Arquivo do modelo não encontrado em: {caminho_modelo}")
    print("O script vai tentar rodar com o yolov8n.pt original base.")
    caminho_modelo = 'yolov8n.pt'

model = YOLO(caminho_modelo)

# 2. Iniciar a captura da webcam (0 costuma ser a webcam integrada)
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Erro ao abrir a webcam")
    exit()

print("Pressione 'q' para sair.")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # 3. Executar a inferência no frame atual
    # O parâmetro conf=0.5 filtra detecções com menos de 50% de confiança
    results = model(frame, conf=0.5)

    # 4. Visualizar os resultados no frame (Desenha as caixas e labels)
    annotated_frame = results[0].plot()

    # 5. Exibir o frame na janela
    cv2.imshow("Entrega 1 - Inteligência Artifical e Aprendizado de Máquina", annotated_frame)

    # Sair se a tecla 'q' for pressionada
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Limpeza
cap.release()
cv2.destroyAllWindows()