import os
import pymupdf
from PIL import Image
import io

pdf_dir = os.path.join("scratch", "products_data")
dest_dir = os.path.join("public", "images", "products")
os.makedirs(dest_dir, exist_ok=True)

targets = [
    {
        "pdf": "CARE MEDICAL BR-TC INSTRUMENT SETS.pdf",
        "output": "care_medical_br_tc_set.webp",
        "page_num": 0,
    },
    {
        "pdf": "CARE MEDICAL DENTAL PDF 2025 SERIES.pdf",
        "output": "care_medical_dental_kit.webp",
        "page_num": 0,
    },
    {
        "pdf": "CMS - LAPROSCOPIC - ELECTRO - VATS CATALOGUE.pdf",
        "output": "laparoscopic_vats_set.webp",
        "page_num": 0,
    },
    {
        "pdf": "Hospital Furniture PDF Catalogue (1).pdf",
        "output": "electric_icu_hospital_bed.webp",
        "page_num": 0,
    },
    {
        "pdf": "Ortho Instruments - Implant PDF 2025 SERIES.pdf",
        "output": "ortho_implant_trauma_system.webp",
        "page_num": 0,
    },
    {
        "pdf": "Eye_PDF_Catalogue[1].pdf",
        "output": "ophthalmic_surgical_loupes.webp",
        "page_num": 0,
    },
]

print("=== Extracting High-Res Images from Catalog PDFs ===")
for target in targets:
    pdf_path = os.path.join(pdf_dir, target["pdf"])
    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path}")
        continue
    
    doc = pymupdf.open(pdf_path)
    page = doc.load_page(target["page_num"])
    
    # Render at 150 DPI for crisp WebP display
    pix = page.get_pixmap(dpi=150)
    img_data = pix.tobytes("png")
    
    img = Image.open(io.BytesIO(img_data))
    
    # Save as optimized WebP
    out_path = os.path.join(dest_dir, target["output"])
    img.save(out_path, format="WEBP", quality=88)
    print(f"[OK] Created: {target['output']} ({img.size[0]}x{img.size[1]}px) from {target['pdf']}")

print("Done extracting PDF images!")
