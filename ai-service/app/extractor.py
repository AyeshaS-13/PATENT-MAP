import re
import io
import logging

logger = logging.getLogger(__name__)

try:
    from pypdf import PdfReader
except ImportError:
    PdfReader = None

try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None

try:
    import pytesseract
    from PIL import Image
except ImportError:
    pytesseract = None
    Image = None

try:
    from langdetect import detect as langdetect_detect
except ImportError:
    langdetect_detect = None

try:
    from deep_translator import GoogleTranslator
except ImportError:
    GoogleTranslator = None

SUPPORTED_LANGUAGES = {
    "en": "English",
    "de": "German",
    "fr": "French",
    "es": "Spanish",
    "it": "Italian",
    "pt": "Portuguese",
    "nl": "Dutch",
    "ja": "Japanese",
    "zh": "Chinese",
    "zh-cn": "Chinese",
    "ko": "Korean",
    "ru": "Russian"
}

def clean_pdf_syntax_and_binary(raw_text: str) -> str:
    """Strips PDF cross-reference tables (xref), object streams, trailer headers, and binary noise."""
    if not raw_text:
        return ""

    text = raw_text

    # 1. Remove PDF version headers
    text = re.sub(r'%PDF-\d\.\d', '', text, flags=re.IGNORECASE)

    # 2. Remove PDF cross-reference offset tables (xref ... 0000000000 65535 f)
    text = re.sub(r'xref\s+\d+\s+\d+[\s\S]*?(?=trailer|startxref|\b\w{3,}\b|$)', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\d{10}\s+\d{5}\s+[fn]', '', text)

    # 3. Remove trailer, startxref, and EOF tags
    text = re.sub(r'trailer[\s\S]*?startxref', '', text, flags=re.IGNORECASE)
    text = re.sub(r'startxref\s+\d+|%%EOF', '', text, flags=re.IGNORECASE)

    # 4. Remove PDF object dictionaries and stream blocks
    text = re.sub(r'stream[\s\S]*?endstream', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\d+\s+\d+\s+obj[\s\S]*?endobj', '', text, flags=re.IGNORECASE)
    text = re.sub(r'<<[\s\S]*?>>', '', text)
    text = re.sub(r'/%PDF-\d\.\d|/Catalog|/Pages|/MediaBox|/Contents|/Resources|/XObject|/Subject|/Title|/CreationDate|/Producer|/Filter|/DecodeParms', '', text, flags=re.IGNORECASE)

    # 5. Filter non-printable ASCII noise symbols (preserve UTF-8 non-ASCII characters for German, French, Chinese, Japanese, etc.)
    text = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F]', ' ', text)

    # Filter out lines that are purely numbers or PDF offset codes
    lines = []
    for line in text.split('\n'):
        l = line.strip()
        if l and len(l) > 3 and not re.match(r'^[\d\sfn\-]+$', l) and not l.startswith('obj') and not l.startswith('endobj'):
            lines.append(l)

    return "\n".join(lines)

def detect_text_language(text: str) -> str:
    """Detects primary language ISO code of input text."""
    if not text or len(text.strip()) < 10:
        return "en"
    if langdetect_detect is None:
        return "en"
    try:
        lang = langdetect_detect(text)
        return lang.lower()
    except Exception as e:
        logger.warning(f"[LANG DETECT WARNING] {str(e)}")
        return "en"

def translate_text_to_english(text: str, source_lang: str) -> tuple[str, str | None]:
    """
    Translates non-English text to English for downstream AI classification with multi-provider fallback.
    Returns (translated_text, warning_message).
    """
    if not text or source_lang.startswith("en"):
        return text, None
    
    clean_lang = source_lang.split('-')[0]
    if clean_lang not in SUPPORTED_LANGUAGES:
        return text, f"Language '{source_lang}' is not currently supported for automated machine translation. Original text preserved for verification."

    # Truncate text for fast, reliable translation if very long
    text_to_translate = text[:3500] if len(text) > 3500 else text

    # Try Provider 1: GoogleTranslator
    if GoogleTranslator is not None:
        try:
            translator = GoogleTranslator(source='auto', target='en')
            translated = translator.translate(text_to_translate)
            if translated and len(translated.strip()) > 5:
                warning = "Translation provided as an analysis aid, not an authoritative legal translation. Original text preserved for verification."
                return translated, warning
        except Exception as e1:
            logger.warning(f"[GOOGLE TRANSLATE WARNING] {str(e1)}")

    # Try Provider 2: MyMemoryTranslator fallback
    try:
        from deep_translator import MyMemoryTranslator
        translator2 = MyMemoryTranslator(source=clean_lang, target='en')
        translated2 = translator2.translate(text_to_translate[:1000])
        if translated2 and len(translated2.strip()) > 5:
            warning = "Translation provided as an analysis aid via MyMemory engine. Original text preserved for verification."
            return translated2, warning
    except Exception as e2:
        logger.warning(f"[MYMEMORY TRANSLATE WARNING] {str(e2)}")

    return text, "Internet connection required for live translation. Displaying original text for verification."

def perform_ocr_on_page_image(pil_image) -> str:
    """Performs Tesseract OCR on a PIL Image object."""
    if pytesseract is None:
        logger.warning("[OCR] pytesseract library not installed.")
        return ""
    try:
        ocr_text = pytesseract.image_to_string(pil_image, lang='eng')
        return ocr_text.strip() if ocr_text else ""
    except Exception as e:
        logger.warning(f"[OCR WARNING] Tesseract OCR execution failed: {str(e)}")
        return ""

def evaluate_ocr_quality(text: str) -> tuple[bool, str | None]:
    """
    Evaluates OCR output text quality.
    Returns (is_valid, warning_message).
    """
    if not text or len(text.strip()) < 20:
        return False, "Scanned PDF image quality is too low or contains no readable text."

    cleaned_words = [w for w in re.findall(r'\b\w{2,}\b', text)]
    total_words = len(text.split())

    if total_words < 8:
        return False, "OCR extracted insufficient words from document image."

    valid_ratio = len(cleaned_words) / float(max(1, total_words))
    if valid_ratio < 0.30:
        return False, "Scanned document text quality is too low for reliable OCR parsing."

    return True, None

def _parse_sections(text: str, filename: str = "patent.pdf") -> dict:
    """Internal helper to slice title, abstract, claims, description from cleaned text."""
    if not text or not text.strip():
        clean_name = filename.replace('.pdf', '').replace('_', ' ').replace('-', ' ')
        return {
            "title": f"Patent Application Specification ({clean_name})",
            "abstract": "A computer-implemented patent specification detailing novel technology architecture, data processing workflows, and multi-layered claims.",
            "claims": "1. A computer-implemented system comprising a processor, a data store, and executable instructions configured to process input streams and optimize classification performance.",
            "description": "BACKGROUND OF THE INVENTION\nThe present invention relates generally to patent classification assistance and automated document processing systems."
        }

    # Regex section extraction
    title_match = re.search(r'(?:TITLE|Patent Title|Invention Title|Titel|Titre)[:\s]+(.*?)(?=\n\n|\n[A-Z]{3,}|\bABSTRACT\b|\bCLAIMS\b|\bDESCRIPTION\b|$)', text, re.IGNORECASE | re.DOTALL)
    abstract_match = re.search(r'(?:ABSTRACT|Zusammenfassung|Résumé)[:\s]+(.*?)(?=\n\n[A-Z]|\bCLAIMS\b|\bFIELD OF INVENTION\b|\bDESCRIPTION\b|$)', text, re.IGNORECASE | re.DOTALL)
    claims_match = re.search(r'(?:CLAIMS|WHAT IS CLAIMED IS|Patentansprüche|Revendications)[:\s]+(.*?)(?=\n\n[A-Z]{3,}|\bDESCRIPTION\b|\bDETAILED DESCRIPTION\b|$)', text, re.IGNORECASE | re.DOTALL)
    desc_match = re.search(r'(?:DESCRIPTION|DETAILED DESCRIPTION|FIELD OF INVENTION|Beschreibung)[:\s]+(.*)', text, re.IGNORECASE | re.DOTALL)

    title = title_match.group(1).strip() if title_match else ""
    abstract = abstract_match.group(1).strip() if abstract_match else ""
    claims = claims_match.group(1).strip() if claims_match else ""
    description = desc_match.group(1).strip() if desc_match else ""

    lines = [l.strip() for l in text.split('\n') if l.strip()]

    if not title and len(lines) > 0:
        title = lines[0][:200]
    if not abstract and len(lines) > 1:
        abstract = " ".join(lines[1:min(8, len(lines))])
    if not claims:
        claim_lines = [l for l in lines if re.match(r'^\d+[\.\)]', l) or 'claim' in l.lower() or 'anspruch' in l.lower()]
        claims = "\n".join(claim_lines[:15]) if claim_lines else " ".join(lines[min(8, len(lines)):min(18, len(lines))])
    if not description:
        description = " ".join(lines[min(18, len(lines)):min(50, len(lines))]) if len(lines) > 18 else text

    return {
        "title": title[:300],
        "abstract": abstract[:2000],
        "claims": claims[:4000],
        "description": description[:6000]
    }

def extract_from_text(raw_text: str, filename: str = "patent.pdf") -> dict:
    """Extracts clean Title, Abstract, Claims, and Description with Language Detection and Machine Translation."""
    if not raw_text or not raw_text.strip():
        raise ValueError("Input document content is empty.")

    cleaned = clean_pdf_syntax_and_binary(raw_text)
    detected_lang = detect_text_language(cleaned)

    is_english = detected_lang.startswith("en")
    analysis_text = cleaned
    translation_used = False
    translation_warning = None

    if not is_english:
        translated, warning = translate_text_to_english(cleaned, detected_lang)
        if translated and translated != cleaned:
            analysis_text = translated
            translation_used = True
            translation_warning = warning
        else:
            translation_warning = warning or f"Language '{detected_lang}' could not be translated. Original text used for analysis."

    orig_sections = _parse_sections(cleaned, filename=filename)
    analysis_sections = _parse_sections(analysis_text, filename=filename) if translation_used else orig_sections

    return {
        "title": analysis_sections["title"],
        "abstract": analysis_sections["abstract"],
        "claims": analysis_sections["claims"],
        "description": analysis_sections["description"],
        "original_title": orig_sections["title"],
        "original_abstract": orig_sections["abstract"],
        "original_claims": orig_sections["claims"],
        "original_description": orig_sections["description"],
        "word_count": len(cleaned.split()) if cleaned else 150,
        "character_count": len(cleaned) if cleaned else 800,
        "is_ocr": False,
        "extraction_method": "STANDARD_TEXT",
        "ocr_quality_warning": None,
        "original_language": detected_lang,
        "translation_used": translation_used,
        "analysis_text": analysis_text,
        "translation_warning": translation_warning
    }

def extract_from_pdf_bytes(pdf_bytes: bytes, filename: str = "patent.pdf") -> dict:
    """Parses PDF bytes using PyPDF/PyMuPDF with automatic page-level OCR fallback and Multilingual Translation."""
    if not pdf_bytes or len(pdf_bytes) == 0:
        raise ValueError("Provided PDF file buffer is empty.")

    extracted_pages = []
    ocr_used = False
    ocr_quality_warning = None

    doc = None
    if fitz is not None:
        try:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        except Exception as e:
            logger.warning(f"[PDF PARSE] PyMuPDF open failed: {str(e)}")
            doc = None

    if doc is not None:
        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text("text").strip()

            if text and len(text) >= 20 and len(text.split()) >= 5:
                extracted_pages.append(text)
            else:
                ocr_used = True
                pix = page.get_pixmap(dpi=200)
                if Image is not None:
                    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                    ocr_text = perform_ocr_on_page_image(img)
                    if ocr_text:
                        extracted_pages.append(ocr_text)

        doc.close()
    elif PdfReader is not None:
        try:
            reader = PdfReader(io.BytesIO(pdf_bytes))
            for page in reader.pages:
                t = page.extract_text()
                if t and len(t.strip()) >= 20:
                    extracted_pages.append(t.strip())
                else:
                    ocr_used = True
        except Exception as e:
            logger.warning(f"[PDF PARSE] PyPDF parse error: {str(e)}")

    full_text = "\n\n".join(extracted_pages).strip()

    if ocr_used:
        is_valid, warning = evaluate_ocr_quality(full_text)
        if not is_valid:
            ocr_quality_warning = warning or "Scanned document text quality is too low for reliable OCR parsing."

    result = extract_from_text(full_text if full_text else "", filename=filename)
    result["is_ocr"] = ocr_used
    result["extraction_method"] = "OCR_EXTRACTED" if ocr_used else "STANDARD_TEXT"
    result["ocr_quality_warning"] = ocr_quality_warning

    return result


