import json
import csv
import os

DATASET_CSV_PATH = "ai-service/training/uspto_cpc_training_dataset.csv"
DATASET_JSON_PATH = "ai-service/training/wipo_patent_corpus.json"

# Representative sample USPTO/WIPO training dataset for CPC classification
SAMPLE_PATENT_DATA = [
    {
        "patent_id": "US11847520B2",
        "title": "System and Method for Deep Learning Feature Classification in Multi-Modal Sensor Networks",
        "abstract": "Methods and systems for training multi-layer neural network classifiers using dynamic feature extraction from multi-modal sensor arrays.",
        "claims": "1. A computer-implemented method comprising receiving sensor data streams, generating feature vectors using a convolutional neural network layer, and computing loss functions.",
        "dominant_domain": "Artificial Intelligence & Machine Learning",
        "cpc_code": "G06F 18/20",
        "cpc_title": "Pattern recognition, machine learning classifiers, statistical feature extraction"
    },
    {
        "patent_id": "US10932145B1",
        "title": "Decentralized Blockchain Verification Protocol with Zero-Knowledge Proof Signatures",
        "abstract": "A cryptographic security framework utilizing zero-knowledge proof primitives and elliptic curve digital signatures for decentralized token verification.",
        "claims": "1. A computer-implemented method comprising generating zero-knowledge proof tokens, verifying public key hashes, and validating transaction blocks.",
        "dominant_domain": "Cryptography, Cybersecurity & Blockchain",
        "cpc_code": "H04L 9/32",
        "cpc_title": "Digital signatures, message authentication, cryptographic security protocols"
    },
    {
        "patent_id": "US11540892B2",
        "title": "Recombinant Plasmid Vector for Targeted CRISPR-Cas9 Gene Editing Assays",
        "abstract": "Genetic engineering constructs and recombinant DNA vectors optimized for targeted nucleotide cleavage and gene expression modulation.",
        "claims": "1. A recombinant nucleic acid molecule comprising a promoter sequence, a guide RNA targeting domain, and a Cas9 endonuclease coding sequence.",
        "dominant_domain": "Biotechnology & Genomics",
        "cpc_code": "C12N 15/09",
        "cpc_title": "Recombinant DNA technology, genetic engineering vectors, nucleic acid mutation"
    },
    {
        "patent_id": "US11623105B2",
        "title": "Autonomous Flight Trajectory Control System for Multi-Rotor Unmanned Aerial Vehicles",
        "abstract": "Avionics control architectures for autonomous quadcopter UAV drones featuring real-time altitude telemetry sensor fusion and trajectory optimization.",
        "claims": "1. An autonomous unmanned aerial vehicle comprising a flight control processor, rotor actuators, and sensors configured to compute dynamic aerodynamic trajectories.",
        "dominant_domain": "Aerospace & Drone Avionics",
        "cpc_code": "B64C 39/02",
        "cpc_title": "Unmanned aerial vehicles, quadcopter drone flight control, rotor craft"
    },
    {
        "patent_id": "US11782104B1",
        "title": "Controlled Release Pharmaceutical Oral Dosage Form Comprising Solid Lipid Nanoparticles",
        "abstract": "Therapeutic pharmaceutical formulations comprising lipid nanoparticle carriers for enhanced bioavailability and targeted active ingredient release.",
        "claims": "1. A pharmaceutical composition comprising a therapeutic active ingredient encapsulated within solid lipid nanoparticles and a pharmaceutically acceptable carrier.",
        "dominant_domain": "Pharmaceuticals & Medicinal Chemistry",
        "cpc_code": "A61K 31/00",
        "cpc_title": "Pharmaceutical preparations, medicinal compounds, controlled release formulations"
    },
    {
        "patent_id": "US11904321B2",
        "title": "Convolutional Neural Network Hardware Accelerator for Real-Time Edge Image Processing",
        "abstract": "Integrated circuit architectures featuring systolic array multiplier units optimized for low-latency deep learning inference on edge computer vision devices.",
        "claims": "1. A hardware accelerator chip comprising a matrix multiplication unit, activation function logic, and high-bandwidth memory interfaces.",
        "dominant_domain": "Semiconductors & Integrated Circuits",
        "cpc_code": "G06N 3/02",
        "cpc_title": "Neural network hardware architectures, artificial neural networks, computing chips"
    }
]

def generate_dataset_files():
    os.makedirs(os.path.dirname(DATASET_CSV_PATH), exist_ok=True)
    
    # 1. Export CSV
    with open(DATASET_CSV_PATH, mode='w', newline='', encoding='utf-8') as csv_file:
        fieldnames = ["patent_id", "title", "abstract", "claims", "dominant_domain", "cpc_code", "cpc_title"]
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        writer.writeheader()
        for row in SAMPLE_PATENT_DATA:
            writer.writerow(row)
            
    print(f"[+] CSV Training Dataset generated at: {DATASET_CSV_PATH}")

    # 2. Export JSON
    with open(DATASET_JSON_PATH, mode='w', encoding='utf-8') as json_file:
        json.dump({"total_records": len(SAMPLE_PATENT_DATA), "patents": SAMPLE_PATENT_DATA}, json_file, indent=2)
        
    print(f"[+] JSON WIPO Patent Corpus generated at: {DATASET_JSON_PATH}")

if __name__ == "__main__":
    generate_dataset_files()
