import os
import json
import pymupdf
from PIL import Image
import io

pdf_dir = os.path.join("scratch", "products_data")
img_dest = os.path.join("public", "images", "products")
products_file = os.path.join("src", "cms", "products.json")

os.makedirs(img_dest, exist_ok=True)

# Define surgical & equipment products to extract from specific PDF pages
EQUIPMENT_DEFINITIONS = [
    # ── 1. CARE MEDICAL BR-TC SURGICAL INSTRUMENTS ──
    {
        "pdf": "CARE MEDICAL BR-TC INSTRUMENT SETS.pdf",
        "page": 1,
        "img_name": "cm_mayo_hegar_needle_holder.webp",
        "crop_box": None,
        "id": "cm-mayo-hegar-tc-needle-holder",
        "name": "CARE MEDICAL Mayo-Hegar TC Needle Holder (Gold Handle)",
        "urduName": "Mayo-Hegar TC Needle Holder",
        "category": "surgical-clinical-supplies",
        "brand": "Care Medical Instruments",
        "genericName": "Tungsten Carbide Surgical Needle Holder",
        "registrationNo": "CE / ISO 13485:2016",
        "badge": "German Grade",
        "description": "Operating room grade Mayo-Hegar Needle Holder featuring Tungsten Carbide (TC) jaws for secure needle grip without slippage. German stainless steel with gold-plated handles indicating TC inserts. Autoclavable up to 134°C.",
        "prices": { "14cm (5.5 Inch)": 28, "16cm (6.25 Inch)": 32, "18cm (7.0 Inch)": 36, "20cm (8.0 Inch)": 42 },
    },
    {
        "pdf": "CARE MEDICAL BR-TC INSTRUMENT SETS.pdf",
        "page": 2,
        "img_name": "cm_metzenbaum_tc_scissors.webp",
        "crop_box": None,
        "id": "cm-metzenbaum-tc-dissecting-scissors",
        "name": "CARE MEDICAL Metzenbaum TC Dissecting Scissors (Curved)",
        "urduName": "Metzenbaum TC Scissors",
        "category": "surgical-clinical-supplies",
        "brand": "Care Medical Instruments",
        "genericName": "Tungsten Carbide Delicate Dissecting Scissors",
        "registrationNo": "CE / ISO 13485:2016",
        "badge": "German Grade",
        "description": "Delicate curved Metzenbaum dissecting scissors engineered with tungsten carbide cutting edges for precise anatomical tissue dissection with minimal trauma. Available in multiple lengths for deep cavity and superficial surgery.",
        "prices": { "14.5cm Curved": 34, "18cm Curved": 39, "20cm Curved": 45, "23cm Curved": 52 },
    },
    {
        "pdf": "CARE MEDICAL BR-TC INSTRUMENT SETS.pdf",
        "page": 3,
        "img_name": "cm_crile_hemostatic_forceps.webp",
        "crop_box": None,
        "id": "cm-crile-hemostatic-forceps-set",
        "name": "CARE MEDICAL Crile Hemostatic Forceps (Straight & Curved)",
        "urduName": "Crile Hemostatic Forceps",
        "category": "surgical-clinical-supplies",
        "brand": "Care Medical Instruments",
        "genericName": "Artery & Hemostasis Clamping Forceps",
        "registrationNo": "CE / ISO 13485:2016",
        "badge": "CE Certified",
        "description": "High-tensile German stainless steel Crile artery forceps with full-length serrated jaws and multi-position ratchet lock. Essential for clamping blood vessels and tissue grasping during surgical operations.",
        "prices": { "14cm Straight (Box of 6)": 75, "14cm Curved (Box of 6)": 78, "16cm Curved (Box of 6)": 88 },
    },

    # ── 2. HOSPITAL FURNITURE & CLINICAL WARD INFRASTRUCTURE ──
    {
        "pdf": "Hospital Furniture PDF Catalogue (1).pdf",
        "page": 2,
        "img_name": "biogen_electric_icu_hospital_bed.webp",
        "crop_box": None,
        "id": "biogen-five-function-electric-icu-hospital-bed",
        "name": "Biogen 5-Function Motorized Electric ICU Hospital Bed with CPR Release",
        "urduName": "Motorized ICU Hospital Bed",
        "category": "medical-devices-equipment",
        "brand": "Care Medical Instruments",
        "genericName": "Motorized Electric Hospital Ward & ICU Bed",
        "registrationNo": "CE / ISO 13485 Certified",
        "badge": "Hospital Grade",
        "description": "Heavy-duty 5-function motorized electric intensive care bed with dual column Linak actuators. Features Trendelenburg / Reverse Trendelenburg tilt, one-touch emergency CPR quick release, central locking castors, and integrated backup battery.",
        "prices": { "Complete Bed with Mattress": 1850, "Bed + Central Monitor Stand": 2100 },
    },
    {
        "pdf": "Hospital Furniture PDF Catalogue (1).pdf",
        "page": 5,
        "img_name": "biogen_hydraulic_obstetric_delivery_table.webp",
        "crop_box": None,
        "id": "biogen-hydraulic-obstetric-delivery-table",
        "name": "Biogen Hydraulic Obstetric Delivery & Gynecological Operating Table",
        "urduName": "Obstetric Delivery Table",
        "category": "medical-devices-equipment",
        "brand": "Care Medical Instruments",
        "genericName": "Hydraulic Obstetric & Labor Table",
        "registrationNo": "CE / ISO 13485 Certified",
        "badge": "Maternity Ward",
        "description": "Multi-section hydraulic labor and delivery table constructed from seamless 304 stainless steel. Equipped with adjustable leg crutches, fluid collection basin, side grab handles, and foot-controlled height elevation.",
        "prices": { "Standard Delivery Unit": 1450, "Full Obstetric Kit with Basin": 1680 },
    },
    {
        "pdf": "Hospital Furniture PDF Catalogue (1).pdf",
        "page": 8,
        "img_name": "biogen_manual_examination_couch.webp",
        "crop_box": None,
        "id": "biogen-clinical-examination-couch",
        "name": "Biogen Two-Section Clinical Examination Couch with Paper Roll Holder",
        "urduName": "Examination Couch",
        "category": "medical-devices-equipment",
        "brand": "Care Medical Instruments",
        "genericName": "Hospital OPD Examination Bed",
        "registrationNo": "ISO 9001:2015",
        "badge": "Clinic Essential",
        "description": "Epoxy powder-coated tubular steel examination table with high-density anti-microbial foam cushioning. Features ratchet-assisted backrest adjustment, integrated paper roll dispenser, and stainless steel drawer storage.",
        "prices": { "Standard Clinic Model": 320, "With Under-Bed Cabinet": 410 },
    },
    {
        "pdf": "Hospital Furniture PDF Catalogue (1).pdf",
        "page": 12,
        "img_name": "biogen_stainless_steel_instrument_trolley.webp",
        "crop_box": None,
        "id": "biogen-ss-instrument-dressing-trolley",
        "name": "Biogen 304 Stainless Steel Two-Tier Instrument & Dressing Trolley",
        "urduName": "Medical Instrument Trolley",
        "category": "medical-devices-equipment",
        "brand": "Care Medical Instruments",
        "genericName": "Surgical Mayo & Dressing Cart",
        "registrationNo": "ISO 9001:2015",
        "badge": "Sterile Ward",
        "description": "Heavy-gauge Grade 304 stainless steel hospital trolley with dual deep shelves, three-sided guardrails, and noiseless anti-static swivel wheels with dual brakes. Impervious to hospital sterilizing agents.",
        "prices": { "60 x 45 x 85 cm": 165, "75 x 45 x 85 cm": 195, "90 x 50 x 85 cm": 230 },
    },
    {
        "pdf": "Hospital Furniture PDF Catalogue (1).pdf",
        "page": 16,
        "img_name": "biogen_foldable_emergency_stretcher.webp",
        "crop_box": None,
        "id": "biogen-foldable-emergency-patient-stretcher",
        "name": "Biogen Aluminum Alloy Foldable Emergency Patient Transfer Stretcher",
        "urduName": "Emergency Patient Stretcher",
        "category": "medical-devices-equipment",
        "brand": "Care Medical Instruments",
        "genericName": "Emergency Ambulance Stretcher",
        "registrationNo": "CE / EN 1865 Compliant",
        "badge": "Emergency Unit",
        "description": "High-strength aerospace aluminum alloy foldable stretcher with waterproof PVC canvas bed. Includes quick-release patient safety restraint straps and heavy-duty load-bearing support legs. Supports up to 160 kg.",
        "prices": { "Single Fold Unit": 185, "Double Fold Compact Stretcher": 225 },
    },

    # ── 3. LAPAROSCOPIC & MINIMALLY INVASIVE SURGICAL SETS ──
    {
        "pdf": "CMS - LAPROSCOPIC - ELECTRO - VATS CATALOGUE.pdf",
        "page": 1,
        "img_name": "cms_laparoscopic_maryland_grasper.webp",
        "crop_box": None,
        "id": "cms-laparoscopic-maryland-dissecting-forceps-5mm",
        "name": "CMS Laparoscopic Maryland Dissecting Forceps (5mm x 330mm)",
        "urduName": "Laparoscopic Maryland Forceps",
        "category": "surgical-clinical-supplies",
        "brand": "Genetic Pharma",
        "genericName": "Minimally Invasive Dissection Forceps",
        "registrationNo": "CE 0197 / ISO 13485",
        "badge": "Endoscopy Grade",
        "description": "360-degree rotating insulated laparoscopic Maryland dissector with monopolar electrocautery HF connection. 3-piece modular design for easy disassembly, cleaning, and complete autoclaving.",
        "prices": { "Standard 330mm Shaft": 145, "Bariatric 450mm Shaft": 175 },
    },
    {
        "pdf": "CMS - LAPROSCOPIC - ELECTRO - VATS CATALOGUE.pdf",
        "page": 3,
        "img_name": "cms_laparoscopic_reusable_trocar_set.webp",
        "crop_box": None,
        "id": "cms-laparoscopic-reusable-trocar-cannula-set",
        "name": "CMS Reusable Laparoscopic Trocar & Cannula System (5mm & 10mm)",
        "urduName": "Laparoscopic Trocar Set",
        "category": "surgical-clinical-supplies",
        "brand": "Genetic Pharma",
        "genericName": "Laparoscopic Port Entry Cannula System",
        "registrationNo": "CE 0197 / ISO 13485",
        "badge": "Autoclavable",
        "description": "Precision stainless steel trocar sleeves with silicone airtight valves and magnetic flap seals. Features pyramidal and safety conical obturators for smooth abdominal port insertion without gas leakage.",
        "prices": { "5mm Cannula + Trocar": 85, "10mm Cannula + Trocar": 110, "Complete 4-Piece Trocar Set": 340 },
    },

    # ── 4. OPHTHALMIC OPTICS & SURGERY ──
    {
        "pdf": "Eye_PDF_Catalogue[1].pdf",
        "page": 1,
        "img_name": "eye_castroviejo_corneal_scissors.webp",
        "crop_box": None,
        "id": "eye-castroviejo-corneal-micro-scissors",
        "name": "Biogen Castroviejo Micro-Corneal Ophthalmic Scissors (Curved Blades)",
        "urduName": "Castroviejo Micro Scissors",
        "category": "eye-care",
        "brand": "The Schazoo",
        "genericName": "Ophthalmic Micro-Surgical Scissors",
        "registrationNo": "CE / ISO 13485",
        "badge": "Micro Surgery",
        "description": "Ultra-fine ophthalmic micro-scissors with spring-action titanium handles and curved micro-blades. Specifically designed for delicate corneal resection, cataract surgery, and trabeculectomy procedures.",
        "prices": { "10cm Curved Blades": 65, "11cm Blunt Tip": 72 },
    },
    {
        "pdf": "Eye_PDF_Catalogue[1].pdf",
        "page": 4,
        "img_name": "eye_barraquer_wire_speculum.webp",
        "crop_box": None,
        "id": "eye-barraquer-wire-eye-speculum",
        "name": "Biogen Barraquer Ophthalmic Wire Eye Speculum (Adult & Pediatric)",
        "urduName": "Barraquer Wire Speculum",
        "category": "eye-care",
        "brand": "The Schazoo",
        "genericName": "Sterile Eye Retraction Speculum",
        "registrationNo": "CE / ISO 13485",
        "badge": "Sterile Eye Care",
        "description": "Titanium wire ophthalmic speculum engineered for gentle non-traumatic eyelid retraction during eye surgery and diagnostic slit-lamp examinations. Ultra-lightweight with non-magnetic properties.",
        "prices": { "Adult 14mm Blades (Set of 2)": 38, "Pediatric 10mm Blades (Set of 2)": 38 },
    },

    # ── 5. ORTHOPEDIC IMPLANTS & TRAUMA FIXATION ──
    {
        "pdf": "Ortho Instruments - Implant PDF 2025 SERIES.pdf",
        "page": 2,
        "img_name": "ortho_locking_compression_plate_system.webp",
        "crop_box": None,
        "id": "ortho-bone-implant-and-trauma-plating-system",
        "name": "Ortho Instruments & Titanium Locking Compression Plating System 2025",
        "urduName": "Titanium Orthopedic Plating System",
        "category": "orthopedic-rehabilitation",
        "brand": "Care Medical Instruments",
        "genericName": "Titanium Orthopedic Fracture Fixation Set",
        "registrationNo": "ISO 13485:2016 / CE 0120",
        "badge": "Implant Grade",
        "description": "Comprehensive titanium Grade 5 trauma fixation set containing anatomical locking plates (distal radius, proximal humerus, distal tibia) and self-tapping locking/cortical screws with sterilization aluminum graphic cases.",
        "prices": { "Small Fragment LCP Set": 1480, "Large Fragment Trauma Plating System": 2350 },
    },
    {
        "pdf": "Ortho Instruments - Implant PDF 2025 SERIES.pdf",
        "page": 8,
        "img_name": "ortho_bone_reduction_forceps.webp",
        "crop_box": None,
        "id": "ortho-verbrugge-bone-reduction-forceps",
        "name": "Ortho Verbrugge Bone Reduction & Holding Forceps (Speed Lock)",
        "urduName": "Bone Reduction Forceps",
        "category": "orthopedic-rehabilitation",
        "brand": "Care Medical Instruments",
        "genericName": "Orthopedic Bone Holding Forceps",
        "registrationNo": "ISO 13485:2016",
        "badge": "Trauma Surgery",
        "description": "Heavy-duty bone holding forceps featuring speed-lock threaded spindle mechanism and serrated self-centering jaws. Designed for anatomical reduction of long bone fractures during plate osteosynthesis.",
        "prices": { "24cm (9.5 Inch)": 88, "26cm (10.25 Inch)": 98, "28cm (11.0 Inch)": 115 },
    },

    # ── 6. CARE MEDICAL DENTAL SURGERY & EXTRACTION ──
    {
        "pdf": "CARE MEDICAL DENTAL PDF 2025 SERIES.pdf",
        "page": 2,
        "img_name": "dental_extraction_forceps_set.webp",
        "crop_box": None,
        "id": "dental-universal-extraction-forceps-kit-10pcs",
        "name": "CARE MEDICAL Universal Dental Extraction Forceps Kit (10 Pcs)",
        "urduName": "Dental Extraction Forceps Kit",
        "category": "oral-dental-care",
        "brand": "Care Medical Instruments",
        "genericName": "German Stainless Dental Extraction Forceps",
        "registrationNo": "CE / ISO 13485 Certified",
        "badge": "Dental Series",
        "description": "Complete 10-piece German stainless steel dental extraction forceps set covering upper incisors, premolars, upper molars, lower premolars, lower molars, and root fragments. Cross-serrated anatomical beaks for optimal tooth grip.",
        "prices": { "10-Piece Extraction Kit with Leather Case": 260, "12-Piece Deluxe Extraction Kit": 310 },
    },
    {
        "pdf": "CARE MEDICAL DENTAL PDF 2025 SERIES.pdf",
        "page": 15,
        "img_name": "dental_luxation_root_elevators.webp",
        "crop_box": None,
        "id": "dental-luxation-root-tip-elevators-set-6pcs",
        "name": "CARE MEDICAL Ergonomic Luxation & Root Tip Elevators (6 Pcs Set)",
        "urduName": "Dental Root Elevators Set",
        "category": "oral-dental-care",
        "brand": "Care Medical Instruments",
        "genericName": "Periodontal Luxating Elevator Kit",
        "registrationNo": "CE / ISO 13485",
        "badge": "Oral Surgery",
        "description": "Ultra-sharp tapered stainless steel blades with color-coded silicone handles. Designed to cut the periodontal ligament and gently expand alveolar bone for non-traumatic tooth extractions.",
        "prices": { "6-Piece Color Coded Set": 115, "Complete 8-Piece Elevator Kit": 145 },
    }
]

print("=== Rendering High-Res PDF Catalogue Images for Products ===")
extracted_images = {}

for item in EQUIPMENT_DEFINITIONS:
    pdf_path = os.path.join(pdf_dir, item["pdf"])
    if not os.path.exists(pdf_path):
        print(f"Skipping {item['name']}, PDF not found: {pdf_path}")
        continue
    
    doc = pymupdf.open(pdf_path)
    page_index = min(item["page"], len(doc) - 1)
    page = doc.load_page(page_index)
    
    pix = page.get_pixmap(dpi=150)
    img_data = pix.tobytes("png")
    img = Image.open(io.BytesIO(img_data))
    
    out_file = os.path.join(img_dest, item["img_name"])
    img.save(out_file, format="WEBP", quality=90)
    img_url = f"/images/products/{item['img_name']}"
    extracted_images[item["id"]] = img_url
    print(f"[OK] Saved: {item['img_name']} ({img.size[0]}x{img.size[1]}px) from {item['pdf']} p.{page_index+1}")

# Load existing products
with open(products_file, "r", encoding="utf-8") as f:
    products = json.load(f)

existing_ids = {p["id"] for p in products}
updated_count = 0
added_count = 0

for item in EQUIPMENT_DEFINITIONS:
    img_url = extracted_images.get(item["id"], f"/images/products/{item['img_name']}")
    
    product_obj = {
        "id": item["id"],
        "name": item["name"],
        "urduName": item["urduName"],
        "category": item["category"],
        "description": item["description"],
        "rating": 4.9,
        "reviewsCount": 24,
        "imageUrl": img_url,
        "images": [img_url],
        "prices": item["prices"],
        "originalPrices": { k: int(v * 1.15) for k, v in item["prices"].items() },
        "inStock": True,
        "featured": True,
        "isNew": True,
        "badge": item["badge"],
        "brand": item["brand"],
        "genericName": item["genericName"],
        "registrationNo": item["registrationNo"],
        "status": "In Stock / Institutional Ready",
        "catalogueMode": True,
        "hasAuthenticPhoto": True
    }
    
    if item["id"] in existing_ids:
        # Update existing
        for idx, p in enumerate(products):
            if p["id"] == item["id"]:
                products[idx] = product_obj
                updated_count += 1
                break
    else:
        # Append new
        products.append(product_obj)
        added_count += 1

with open(products_file, "w", encoding="utf-8") as f:
    json.dump(products, f, indent=2)

print(f"\n✅ Catalog Expansion Complete!")
print(f"   Updated Existing Equipment Items: {updated_count}")
print(f"   Added New Authentic Surgical & Medical Items: {added_count}")
print(f"   Total Catalog Size: {len(products)} products")
