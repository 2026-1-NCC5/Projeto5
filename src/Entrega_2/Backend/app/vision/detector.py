import os
import cv2
import numpy as np
import base64
from ultralytics import YOLO
from app.core.logger import logger

class YOLODetector:
    def __init__(self, model_path=None):
        if model_path is None:
            self.model_path = os.path.join(os.path.dirname(__file__), "best.pt")
        else:
            self.model_path = model_path
        self.model = None
        self.load_model()

    def load_model(self):
        if not os.path.exists(self.model_path):
            self.model_path = 'yolov8n.pt'
        
        self.model = YOLO(self.model_path)

    def detect_from_base64(self, base64_str: str, conf=0.5):
        if not self.model:
            return []

        try:
            if "," in base64_str:
                base64_str = base64_str.split(",")[1]

            img_bytes = base64.b64decode(base64_str)
            np_arr = np.frombuffer(img_bytes, np.uint8)
            frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            
            if frame is None:
                return []

            results = self.model(frame, conf=conf, verbose=False)
            detected_items = []
            
            for r in results:
                for box in r.boxes:
                    class_id = int(box.cls[0])
                    class_name = self.model.names[class_id]
                    detected_items.append(class_name)
                    
            return detected_items

        except Exception as e:
            logger.error(f"Error during inference: {e}")
            return []

detector = YOLODetector()
