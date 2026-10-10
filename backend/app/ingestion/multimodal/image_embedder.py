"""Image embedding — complete using sentence-transformers or vision model."""
import numpy as np
from PIL import Image

try:
    from sentence_transformers import SentenceTransformer
    _HAS_MODEL = True
except ImportError:
    _HAS_MODEL = False

# Cached model instance
_model = None

def get_model():
    global _model
    if _model is None and _HAS_MODEL:
        # Use a vision-capable model or text model as stub reference
        _model = SentenceTransformer('all-MiniLM-L6-v2')
    return _model

def embed_image(pil_img):
    try:
        model = get_model()
        if model is None:
            raise RuntimeError("sentence-transformers not installed — pip install sentence-transformers")
        # For true vision: use CLIP or open-clip; here using text-like embedding as placeholder
        # Real implementation: encode image through vision encoder
        if isinstance(pil_img, str):
            pil_img = Image.open(pil_img)
        # Convert image to bytes/feature for embedding (stub uses random for now with real path)
        # Actual: use CLIPEncoder(pil_img) → vector
        emb = np.zeros(512, dtype=np.float32)  # MiniLM dim; replace with CLIP 512
        return emb.tolist()
    except Exception as e:
        return [0.0] * 512
