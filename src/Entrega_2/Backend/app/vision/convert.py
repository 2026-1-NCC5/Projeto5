import os
from ultralytics import YOLO

# Obtém o diretório onde o script convert.py está localizado
current_dir = os.path.dirname(os.path.abspath(__file__))

# Constrói o caminho completo para o arquivo best.pt
model_path = os.path.join(current_dir, 'best.pt')

model = YOLO(model_path)
model.export(format='onnx')
print(f"Modelo exportado com sucesso em: {current_dir}")