import math
import re
from typing import Dict, List, Any

# Standardized WIPO / USPTO Patent Technology Domain Taxonomy
EXTENDED_DOMAIN_TAXONOMY = {
    "Artificial Intelligence & Machine Learning": [
        "machine learning", "deep learning", "neural network", "transformer", "attention mechanism",
        "training model", "dataset", "backpropagation", "loss function", "convolutional", "reinforcement",
        "prediction", "classifier", "nlp", "feature vector", "gradient descent", "embedding", "artificial intelligence",
        "supervised learning", "unsupervised learning", "inference", "tensor", "generative", "llm"
    ],
    "Computer Vision & Image Processing": [
        "computer vision", "image processing", "object detection", "bounding box", "facial recognition",
        "segmentation", "pixel", "convolutional neural network", "pattern recognition", "feature extraction",
        "video stream", "depth map", "image classification", "camera sensor"
    ],
    "Software & Distributed Systems": [
        "software", "database", "distributed system", "cloud computing", "microservice", "rest api",
        "compiler", "operating system", "data structure", "memory management", "virtual machine",
        "thread", "asynchronous", "server", "middleware", "framework"
    ],
    "Cryptography, Cybersecurity & Blockchain": [
        "cryptography", "encryption", "cipher", "blockchain", "digital signature", "public key",
        "private key", "hash function", "authentication", "zero knowledge", "tokenization",
        "security protocol", "firewall", "vulnerability", "decryption", "threat detection", "cybersecurity",
        "key exchange", "elliptic curve", "smart contract", "access control"
    ],
    "Telecommunications & Wireless Networks": [
        "5g", "6g", "cellular", "bandwidth", "beamforming", "antenna", "spectrum", "base station",
        "latency", "modulation", "transceiver", "mimo", "packet loss", "radio frequency", "wireless",
        "signal", "transmission", "carrier", "network protocol", "lte"
    ],
    "Pharmaceuticals & Medicinal Chemistry": [
        "pharmaceutical", "medicinal", "drug", "tablet", "capsule", "dosage", "therapeutic",
        "compound", "active ingredient", "formulation", "inhibitor", "pharmacology", "bioavailability",
        "molecular", "synthesis", "organic compound", "receptor", "treatment method"
    ],
    "Biotechnology & Genomics": [
        "gene", "dna", "rna", "crispr", "cas9", "genetic sequence", "recombinant", "plasmid",
        "antibody", "antigen", "vaccine", "enzyme", "protein engineering", "microorganism", "biomarker",
        "cell culture", "genomic", "expression", "assay", "clone"
    ],
    "Medical Devices & Healthcare Technology": [
        "biosensor", "heart rate", "ecg", "eeg", "surgical instrument", "catheter", "stent",
        "diagnostic device", "patient monitoring", "prosthetic", "medical imaging", "ultrasound",
        "clinical", "physiological", "implant", "medical device", "endoscope"
    ],
    "Semiconductors & Integrated Circuits": [
        "semiconductor", "transistor", "integrated circuit", "wafer", "gate", "drain", "source",
        "lithography", "silicon", "doping", "microelectronics", "vias", "interconnect", "fet", "cmos"
    ],
    "Electrical Energy & Power Electronics": [
        "battery", "cell", "electrolyte", "anode", "cathode", "capacitor", "inverter", "converter",
        "power supply", "voltage", "current", "transformer", "electric grid", "charging", "energy storage"
    ],
    "Mechanical Engineering & Fluid Systems": [
        "engine", "turbine", "valve", "piston", "hydraulic", "pneumatic", "gearbox", "compressor",
        "bearing", "transmission", "combustion", "heat exchanger", "shaft", "mechanical", "fluid", "actuator"
    ],
    "Aerospace & Drone Avionics": [
        "drone", "uav", "quadcopter", "aircraft", "rotor", "flight control", "aerodynamic",
        "propulsion", "avionics", "altitude", "thrust", "telemetry", "autonomous flight", "satellite", "wing"
    ],
    "Automotive & Autonomous Vehicles": [
        "vehicle", "automobile", "autonomous driving", "steering", "braking", "powertrain", "chassis",
        "lidar", "radar", "driver assistance", "ev", "electric vehicle", "battery pack"
    ]
}

def detect_domains(text: str) -> Dict[str, Any]:
    """High-precision weighted domain classification based on text content."""
    if not text or not text.strip():
        return {
            "dominant_domain": {"name": "Unclassified Patent", "percentage": 0.0},
            "dependent_domains": []
        }

    lowered = text.lower()
    
    # Split text into sections if headers present to apply section weights
    title_text = ""
    abstract_text = ""
    claims_text = lowered

    title_match = re.search(r'(?:TITLE|Patent Title)[:\s]+(.*?)(?=\n\n|\bABSTRACT\b|$)', text, re.IGNORECASE | re.DOTALL)
    abstract_match = re.search(r'(?:ABSTRACT)[:\s]+(.*?)(?=\n\n|\bCLAIMS\b|$)', text, re.IGNORECASE | re.DOTALL)
    
    if title_match:
        title_text = title_match.group(1).lower()
    if abstract_match:
        abstract_text = abstract_match.group(1).lower()

    scores = {}
    matched_evidence = {}

    for domain, keywords in EXTENDED_DOMAIN_TAXONOMY.items():
        score = 0.0
        evidence_words = []

        for kw in keywords:
            pattern = r'\b' + re.escape(kw) + r'\b'
            
            # Count in Title (3.0x weight)
            title_count = len(re.findall(pattern, title_text)) if title_text else 0
            # Count in Abstract (2.0x weight)
            abstract_count = len(re.findall(pattern, abstract_text)) if abstract_text else 0
            # Count in Claims / Description (1.0x weight)
            body_count = len(re.findall(pattern, lowered))

            total_matches = title_count + abstract_count + body_count

            if total_matches > 0:
                evidence_words.append(kw)
                kw_weight = len(kw.split()) * 2.0
                score += (title_count * 3.0 + abstract_count * 2.0 + body_count * 1.0) * kw_weight

        scores[domain] = score
        matched_evidence[domain] = evidence_words

    total_score = sum(scores.values())

    if total_score == 0:
        return {
            "dominant_domain": {"name": "General Engineering & Applied Technology", "percentage": 100.0},
            "dependent_domains": []
        }

    # Sort domains by weighted score descending
    sorted_domains = sorted(scores.items(), key=lambda x: x[1], reverse=True)

    dominant_name, dominant_score = sorted_domains[0]
    dominant_pct = round((dominant_score / total_score) * 100, 1)

    dependent_domains = []
    for name, score in sorted_domains[1:]:
        if score > 0:
            pct = round((score / total_score) * 100, 1)
            dependent_domains.append({
                "name": name,
                "percentage": pct,
                "keywords_matched": matched_evidence[name][:3]
            })

    return {
        "dominant_domain": {
            "name": dominant_name,
            "percentage": dominant_pct,
            "keywords_matched": matched_evidence[dominant_name][:5]
        },
        "dependent_domains": dependent_domains[:4]
    }
