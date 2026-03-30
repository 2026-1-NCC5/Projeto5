import cv2
from ultralytics import YOLO

# 1. Carregar o modelo (substitua 'yolov8n.pt' pelo seu arquivo .pt treinado)
model = YOLO('yolov8n.pt') 

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
    cv2.imshow("PI FECAP - Contagem Inteligente", annotated_frame)

    # Sair se a tecla 'q' for pressionada
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Limpeza
cap.release()
cv2.destroyAllWindows()