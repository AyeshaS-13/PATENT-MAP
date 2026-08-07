import os
import sys
import json
import pickle
import zipfile
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

# Add ai-service app path for domain detector evaluation
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app.domain_detector import detect_domains

MODEL_DIR = "ai-service/training/saved_models"
ZIP_OUTPUT_PATH = "patent_map_models_and_dataset.zip"

def evaluate_cpc_top_k_accuracy(model, X_test, y_test, k=3):
    """Calculates Top-k accuracy where true label is in top-k predicted probabilities."""
    probs = model.predict_proba(X_test)
    classes = model.classes_
    
    top_k_correct = 0
    total = len(y_test)
    
    for i, true_label in enumerate(y_test):
        top_k_indices = np.argsort(probs[i])[::-1][:k]
        top_k_classes = classes[top_k_indices]
        if true_label in top_k_classes:
            top_k_correct += 1
            
    return round((top_k_correct / total) * 100.0, 2)

def train_and_export_all():
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    # 1. Load Dataset
    csv_path = "ai-service/training/uspto_cpc_training_dataset.csv"
    if not os.path.exists(csv_path):
        from download_training_dataset import generate_dataset_files
        generate_dataset_files()
        
    df = pd.read_csv(csv_path)
    
    # Clean and remove exact duplicate patent IDs
    df = df.drop_duplicates(subset=["patent_id"]).reset_index(drop=True)
    df["full_text"] = df["title"].fillna("") + " " + df["abstract"].fillna("") + " " + df["claims"].fillna("")
    # Weighted input representation: Title (3x weight), Abstract (2x weight), Claims (1x weight)
    df["weighted_text"] = (df["title"].fillna("") + " ") * 3 + (df["abstract"].fillna("") + " ") * 2 + df["claims"].fillna("")
    
    total_records = len(df)
    print(f"[>] Total Dataset Records: {total_records}")
    print(f"[>] Unique Patents: {df['patent_id'].nunique()}")
    print(f"[>] Unique CPC Classes: {df['cpc_code'].nunique()}")

    # 2. Prevent Data Leakage: 80% Train / 20% Unseen Test Split
    train_df, test_df = train_test_split(
        df, test_size=0.20, random_state=42, stratify=df["cpc_code"]
    )

    print(f"\n[>] Data Splits:")
    print(f"    - Training Set:   {len(train_df)} records (80%)")
    print(f"    - Unseen Test Set:{len(test_df)} records (20%)")

    # 3. Fit TF-IDF Vectorizer ONLY on Training Set
    print("\n[>] Training TF-IDF N-Gram Vectorizer (fitted ONLY on Training set)...")
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=3000, sublinear_tf=True, stop_words='english')
    X_train = vectorizer.fit_transform(train_df["weighted_text"])
    y_train = train_df["cpc_code"].values

    X_test = vectorizer.transform(test_df["weighted_text"])
    y_test = test_df["cpc_code"].values

    # 4. Fit Random Forest Classifier with Class Weighting
    print("[>] Training Balanced Random Forest Ensemble CPC Classifier Model...")
    rf_classifier = RandomForestClassifier(n_estimators=100, max_depth=30, class_weight='balanced', random_state=42)
    rf_classifier.fit(X_train, y_train)

    # 5. Empirical Evaluation on Unseen Test Set
    y_pred_test = rf_classifier.predict(X_test)
    top1_acc = round(accuracy_score(y_test, y_pred_test) * 100.0, 2)
    top3_acc = evaluate_cpc_top_k_accuracy(rf_classifier, X_test, y_test, k=3)

    report_dict = classification_report(y_test, y_pred_test, output_dict=True)
    macro_p = round(report_dict["macro avg"]["precision"] * 100.0, 2)
    macro_r = round(report_dict["macro avg"]["recall"] * 100.0, 2)
    macro_f1 = round(report_dict["macro avg"]["f1-score"] * 100.0, 2)
    weighted_f1 = round(report_dict["weighted avg"]["f1-score"] * 100.0, 2)

    cm = confusion_matrix(y_test, y_pred_test, labels=rf_classifier.classes_).tolist()

    # 6. Evaluate Rule-Based Domain Detector on Unseen Test Set
    domain_correct = 0
    for _, row in test_df.iterrows():
        res = detect_domains(row["full_text"])
        pred_dom = res["dominant_domain"]["name"]
        if pred_dom.lower() == str(row["dominant_domain"]).lower():
            domain_correct += 1

    domain_accuracy = round((domain_correct / len(test_df)) * 100.0, 2)

    print("\n=================================================")
    print("      EMPIRICAL MACHINE LEARNING AUDIT METRICS   ")
    print("=================================================")
    print(f" CPC Classification Top-1 Accuracy: {top1_acc}%")
    print(f" CPC Classification Top-3 Accuracy: {top3_acc}%")
    print(f" CPC Precision (Macro):            {macro_p}%")
    print(f" CPC Recall (Macro):               {macro_r}%")
    print(f" CPC Macro F1-Score:               {macro_f1}%")
    print(f" CPC Weighted F1-Score:            {weighted_f1}%")
    print(f" Domain Detector Top-1 Accuracy:   {domain_accuracy}%")
    print("=================================================\n")

    # Save Model Artifacts
    vectorizer_path = os.path.join(MODEL_DIR, "cpc_tfidf_vectorizer.pkl")
    with open(vectorizer_path, "wb") as f:
        pickle.dump(vectorizer, f)

    classifier_path = os.path.join(MODEL_DIR, "cpc_classifier_rf.pkl")
    with open(classifier_path, "wb") as f:
        pickle.dump(rf_classifier, f)

    # Export Empirical Model Card
    model_card = {
        "model_architecture": "Hybrid TF-IDF N-Gram Vectorizer + Random Forest Ensemble",
        "dataset_metrics": {
            "total_records": total_records,
            "unique_patents": df['patent_id'].nunique(),
            "unique_cpc_classes": df['cpc_code'].nunique(),
            "training_set_size": len(train_df),
            "unseen_test_set_size": len(test_df),
            "data_leakage_prevented": True,
            "stratified_split": True
        },
        "empirical_evaluation_unseen_test_set": {
            "cpc_top1_accuracy": f"{top1_acc}%",
            "cpc_top3_accuracy": f"{top3_acc}%",
            "cpc_precision_macro": f"{macro_p}%",
            "cpc_recall_macro": f"{macro_r}%",
            "cpc_macro_f1_score": f"{macro_f1}%",
            "cpc_weighted_f1_score": f"{weighted_f1}%",
            "domain_classification_accuracy": f"{domain_accuracy}%",
            "confusion_matrix_classes": list(rf_classifier.classes_),
            "confusion_matrix": cm
        },
        "exported_binaries": [
            "cpc_tfidf_vectorizer.pkl",
            "cpc_classifier_rf.pkl",
            "uspto_cpc_training_dataset.csv",
            "wipo_patent_corpus.json"
        ]
    }
    
    model_card_path = os.path.join(MODEL_DIR, "model_card.json")
    with open(model_card_path, "w", encoding="utf-8") as f:
        json.dump(model_card, f, indent=2)

    # 7. Zip Downloadable Artifact Archive
    with zipfile.ZipFile(ZIP_OUTPUT_PATH, 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipf.write("ai-service/training/uspto_cpc_training_dataset.csv", arcname="uspto_cpc_training_dataset.csv")
        zipf.write("ai-service/training/wipo_patent_corpus.json", arcname="wipo_patent_corpus.json")
        zipf.write(vectorizer_path, arcname="saved_models/cpc_tfidf_vectorizer.pkl")
        zipf.write(classifier_path, arcname="saved_models/cpc_classifier_rf.pkl")
        zipf.write(model_card_path, arcname="saved_models/model_card.json")

    print(f"[+] Downloadable ZIP archive updated at: {ZIP_OUTPUT_PATH}")

if __name__ == "__main__":
    train_and_export_all()

