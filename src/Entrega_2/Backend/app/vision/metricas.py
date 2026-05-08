from ultralytics import YOLO

# 1. Carrega o seu modelo treinado
model = YOLO('best.pt')

# 2. Roda a validação no seu dataset
# Nota: Você precisará apontar para o seu dataset para gerar a matriz real
metrics = model.val(data='caminho/para/seu/dataset.yaml') 

# O YOLO salvará automaticamente um arquivo chamado 'confusion_matrix.png'
# na pasta 'runs/detect/val/'