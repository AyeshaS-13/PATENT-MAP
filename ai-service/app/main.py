from fastapi import FastAPI, HTTPException, File, UploadFile, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import base64

from app.extractor import extract_from_text, extract_from_pdf_bytes
from app.domain_detector import detect_domains
from app.cpc_recommender import recommend_cpc_codes
from app.explainer import generate_ai_explanation
from app.query_gen import generate_patent_queries
from app.prior_art import search_prior_art, compare_patents

app = FastAPI(
    title="PATENT MAP AI & NLP Microservice",
    description="CPC-Based Patent Classification, Domain Detection, AI Rationale & Prior Art Search Engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextPayload(BaseModel):
    text: str = Field(..., description="Raw patent text or abstract/claims")

class PDFBase64Payload(BaseModel):
    filename: Optional[str] = "patent.pdf"
    base64_data: str

class CPCExplainPayload(BaseModel):
    text: str
    cpc_code: str
    cpc_description: str

class QueryGenPayload(BaseModel):
    title: str = ""
    abstract: str = ""
    claims: str = ""
    cpc_codes: List[str] = []

class ComparePayload(BaseModel):
    source_text: str
    target_patent_id: str

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "PATENT MAP AI Microservice", "version": "1.0.0"}

@app.post("/extract-content")
def extract_content_endpoint(payload: TextPayload):
    try:
        result = extract_from_text(payload.text)
        return {"success": True, "data": result}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal extraction error: {str(e)}")

@app.post("/extract-pdf")
async def extract_pdf_endpoint(file: UploadFile = File(...)):
    try:
        pdf_bytes = await file.read()
        result = extract_from_pdf_bytes(pdf_bytes, filename=file.filename or "patent.pdf")
        return {"success": True, "data": result}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")

@app.post("/detect-domain")
def detect_domain_endpoint(payload: TextPayload):
    try:
        result = detect_domains(payload.text)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Domain detection failed: {str(e)}")

@app.post("/recommend-cpc")
def recommend_cpc_endpoint(payload: TextPayload):
    try:
        results = recommend_cpc_codes(payload.text)
        return {"success": True, "data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CPC recommendation failed: {str(e)}")

@app.post("/explain-ai")
def explain_ai_endpoint(payload: CPCExplainPayload):
    try:
        result = generate_ai_explanation(payload.text, payload.cpc_code, payload.cpc_description)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI explanation failed: {str(e)}")

@app.post("/generate-query")
def generate_query_endpoint(payload: QueryGenPayload):
    try:
        result = generate_patent_queries(payload.title, payload.abstract, payload.claims, payload.cpc_codes)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query generation failed: {str(e)}")

@app.post("/prior-art-search")
def prior_art_search_endpoint(payload: TextPayload):
    try:
        results = search_prior_art(payload.text)
        return {"success": True, "data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prior art search failed: {str(e)}")

@app.post("/compare-patents")
def compare_patents_endpoint(payload: ComparePayload):
    try:
        result = compare_patents(payload.source_text, payload.target_patent_id)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Patent comparison failed: {str(e)}")
