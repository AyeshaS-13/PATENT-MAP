import re
from typing import Dict, List, Any

def generate_patent_queries(title: str, abstract: str, claims: str, cpc_codes: List[str]) -> Dict[str, Any]:
    """Generates structured Boolean patent search queries for USPTO and EPO search databases."""
    
    # Extract noun phrases / keywords
    combined = f"{title} {abstract} {claims}".lower()
    words = re.findall(r'\b[a-zA-Z]{4,}\b', combined)
    
    stopwords = {"with", "that", "this", "from", "have", "been", "using", "method", "system", "apparatus", "device", "comprising", "wherein"}
    filtered_words = [w for w in words if w not in stopwords]

    word_freq = {}
    for w in filtered_words:
        word_freq[w] = word_freq.get(w, 0) + 1
        
    top_keywords = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:5]
    kw_list = [k[0] for k in top_keywords] or ["patent", "system", "method"]

    primary_cpc = cpc_codes[0] if cpc_codes else "G06F 18/20"
    cpc_compact = primary_cpc.replace(" ", "")

    # Boolean expressions
    uspto_query = f'(TTL/("{title[:40]}") OR AB/({" OR ".join(kw_list[:3])})) AND CPC/{cpc_compact}'
    epo_query = f'({kw_list[0]} AND {kw_list[1] if len(kw_list) > 1 else kw_list[0]}) IN AB AND {cpc_compact} IN CPC'
    broad_query = f'({" OR ".join(kw_list)}) AND (CPC/{cpc_compact})'
    narrow_claims_query = f'CLM/("{kw_list[0]}") AND CLM/("{kw_list[1] if len(kw_list) > 1 else kw_list[0]}") AND CPC/{cpc_compact}'

    return {
        "extracted_keywords": kw_list,
        "primary_cpc_filter": primary_cpc,
        "uspto_syntax_query": uspto_query,
        "epo_espacenet_syntax": epo_query,
        "broad_patent_query": broad_query,
        "narrow_claims_query": narrow_claims_query
    }
