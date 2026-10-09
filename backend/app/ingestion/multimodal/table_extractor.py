"""Table extraction — complete with fallback."""

def extract_tables(pdf_path, pages="all"):
    results = []
    # Try camelot first
    try:
        import camelot
        tables = camelot.read_pdf(pdf_path, pages=pages, flavor="lattice")
        for t in tables:
            results.append({
                "page": t.page,
                "data": t.df.to_dict(),
                "bbox": (t._bbox[0], t._bbox[1], t._bbox[2], t._bbox[3]),
                "method": "camelot"
            })
    except Exception as e:
        # Fallback to pdfplumber
        try:
            import pdfplumber
            with pdfplumber.open(pdf_path) as pdf:
                for i, page in enumerate(pdf.pages):
                    table = page.extract_table()
                    if table:
                        results.append({
                            "page": i + 1,
                            "data": table,
                            "bbox": None,
                            "method": "pdfplumber"
                        })
        except Exception as e2:
            results.append({"page": None, "data": [], "bbox": None, "method": "failed", "error": str(e2)})
    return results
