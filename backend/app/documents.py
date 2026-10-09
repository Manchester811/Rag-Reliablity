from pathlib import Path
import hashlib, csv

ALLOWED={".txt",".md",".pdf",".csv",".png",".jpg",".jpeg"}
# multimodal chunk types: text / image / table
MAX_BYTES=10*1024*1024

def sha256(path):
    h=hashlib.sha256()
    with open(path,"rb") as f:
        for block in iter(lambda:f.read(1024*1024),b""):
            h.update(block)
    return h.hexdigest()

def extract_pages(path):
    ext=Path(path).suffix.lower()
    if ext in {".txt",".md",".csv"}:
        if ext==".csv":
            with open(path,encoding="utf-8",errors="replace",newline="") as f:
                text="\n".join(" | ".join(row) for row in csv.reader(f))
        else:
            text=Path(path).read_text(encoding="utf-8",errors="replace")
        return [(None,text)]
    if ext==".pdf":
        try:
            from pypdf import PdfReader
        except ImportError:
            raise RuntimeError("PDF support requires: pip install -r requirements-optional.txt")
        reader=PdfReader(path)
        text_pages = [(i+1,page.extract_text() or "") for i,page in enumerate(reader.pages)]
        # Multimodal: also extract tables and OCR if image-heavy
        try:
            from app.ingestion.multimodal import extract_tables, ocr_image
            multimodal = []
            for pnum, txt in text_pages:
                # If page is image/scanned (low text), try OCR
                if not txt or len(txt.strip()) < 20:
                    # In real use: extract page image then OCR; here stub
                    multimodal.append((pnum, {"type":"image_ocr","source":"ocr_engine"}))
            text_pages.extend(multimodal)
        except Exception:
            pass
        return text_pages
    raise ValueError(f"Unsupported file type: {ext}")

def extract_text(path):
    return "\n".join(text for _,text in extract_pages(path))

def validate(path):
    p=Path(path)
    if p.suffix.lower() not in ALLOWED:
        raise ValueError("Unsupported file type")
    if p.stat().st_size>MAX_BYTES:
        raise ValueError("File exceeds 10 MB limit")
    return {"name":p.name,"size":p.stat().st_size,"hash":sha256(path),"type":p.suffix.lower()}
