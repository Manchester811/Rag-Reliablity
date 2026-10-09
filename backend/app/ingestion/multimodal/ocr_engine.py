"""OCR engine for scanned PDF pages / images — complete with error handling."""
from PIL import Image
import os

try:
    import pytesseract
    _HAS_TESSERACT = True
except ImportError:
    _HAS_TESSERACT = False

def ocr_image(path_or_pil):
    try:
        if isinstance(path_or_pil, str):
            if not os.path.exists(path_or_pil):
                raise FileNotFoundError(f"Image not found: {path_or_pil}")
            img = Image.open(path_or_pil)
        else:
            img = path_or_pil
        if not _HAS_TESSERACT:
            raise RuntimeError("pytesseract not installed — pip install pytesseract pdf2image")
        text = pytesseract.image_to_string(img)
        # Get confidence data from OCR
        data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)
        avg_conf = sum(int(d) for d in data.get('conf', []) if int(d) > 0) / max(1, len([d for d in data.get('conf', []) if int(d) > 0]))
        return {
            "text": text,
            "lang": "eng",
            "confidence": round(avg_conf, 2) if avg_conf else None,
            "status": "success"
        }
    except Exception as e:
        return {
            "text": "",
            "lang": "eng",
            "confidence": None,
            "status": "error",
            "error": str(e)
        }
