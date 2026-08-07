import os
import sys
import unittest
import io

# Add ai-service to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ai-service")))

from app.extractor import (
    extract_from_text,
    extract_from_pdf_bytes,
    evaluate_ocr_quality,
    clean_pdf_syntax_and_binary,
    detect_text_language,
    translate_text_to_english
)

class TestOCRAndMultilingualPipeline(unittest.TestCase):

    def test_01_english_text_pdf(self):
        sample_text = """
        TITLE: System and Method for Deep Learning Feature Classification
        
        ABSTRACT:
        A computer-implemented method for training neural network classifiers using feature vectors.
        
        CLAIMS:
        1. A computer-implemented system comprising a processor and a memory storing instructions.
        
        DESCRIPTION:
        The present invention relates generally to artificial intelligence systems.
        """
        result = extract_from_text(sample_text, filename="sample_patent.pdf")
        self.assertEqual(result["is_ocr"], False)
        self.assertEqual(result["extraction_method"], "STANDARD_TEXT")
        self.assertEqual(result["original_language"], "en")
        self.assertEqual(result["translation_used"], False)
        self.assertIn("Deep Learning Feature Classification", result["title"])

    def test_02_non_english_text_pdf_german(self):
        german_text = """
        TITLE: System und Verfahren zur Klassifizierung von Mustern mittels neuronaler Netze
        
        ABSTRACT:
        Ein computerimplementiertes Verfahren zur Trainierung von neuronalen Netzwerklassifikatoren.
        
        CLAIMS:
        1. Ein computerimplementiertes System umfassend einen Prozessor und einen Speicher.
        
        DESCRIPTION:
        Die vorliegende Erfindung betrifft künstliche Intelligenz und Mustererkennung.
        """
        result = extract_from_text(german_text, filename="german_patent.pdf")
        self.assertEqual(result["original_language"], "de")
        self.assertIn("original_title", result)
        self.assertEqual(result["original_title"], "System und Verfahren zur Klassifizierung von Mustern mittels neuronaler Netze")
        self.assertIsNotNone(result["analysis_text"])

    def test_03_non_english_text_pdf_french(self):
        french_text = """
        TITRE: Système et procédé de classification d'apprentissage profond
        
        RÉSUMÉ:
        Un procédé informatique pour entraîner des réseaux de neurones.
        
        CLAIMS:
        1. Un système informatique comprenant un processeur et une mémoire.
        """
        result = extract_from_text(french_text, filename="french_patent.pdf")
        self.assertEqual(result["original_language"], "fr")
        self.assertIn("original_title", result)

    def test_04_mixed_language_processing(self):
        mixed_text = """
        TITLE: System and Method for Pattern Recognition
        
        ABSTRACT:
        Verfahren zur Trainierung von neuronalen Netzwerklassifikatoren using dynamic feature extraction.
        
        CLAIMS:
        1. A system comprising artificial intelligence parameters.
        """
        result = extract_from_text(mixed_text, filename="mixed_patent.pdf")
        self.assertIn("original_language", result)
        self.assertIsNotNone(result["title"])

    def test_05_unsupported_language_graceful_fallback(self):
        # Test language detection fallback for unsupported code or fallback text
        lang = detect_text_language("English text for fallback validation")
        self.assertEqual(lang, "en")
        
        translated, warning = translate_text_to_english("Test text", "xyz_unsupported")
        self.assertIn("not currently supported", warning)

    def test_06_evaluate_ocr_quality_validation(self):
        good_text = "SYSTEM AND METHOD FOR NEURAL NETWORK CLASSIFICATION IN AUTOMATED PATENTS"
        is_valid, warning = evaluate_ocr_quality(good_text)
        self.assertTrue(is_valid)
        self.assertIsNone(warning)

        garbage_text = "%$# @# 010101 #$% !!"
        is_valid, warning = evaluate_ocr_quality(garbage_text)
        self.assertFalse(is_valid)
        self.assertIsNotNone(warning)

    def test_07_empty_input_protection(self):
        with self.assertRaises(ValueError):
            extract_from_text("", filename="empty.pdf")

    def test_08_pdf_syntax_cleaning(self):
        raw_pdf_bytes_str = "%PDF-1.1 % 1 0 obj << /Type /Catalog >> endobj 2 0 obj stream hello world endstream xref 0 1 0000000000 65535 f"
        cleaned = clean_pdf_syntax_and_binary(raw_pdf_bytes_str)
        self.assertNotIn("%PDF-1.1", cleaned)
        self.assertNotIn("endobj", cleaned)

    def test_09_dynamic_cpc_recommendations(self):
        from app.cpc_recommender import recommend_cpc_codes
        
        drone_text = "Autonomous flight control computer for multi-rotor unmanned aerial vehicles (UAV) and quadcopter altitude telemetry stabilization."
        crypto_text = "Decentralized blockchain verification protocol utilizing zero-knowledge proof tokens and elliptic curve digital signatures."
        biotech_text = "Recombinant plasmid vector for targeted CRISPR-Cas9 nucleotide cleavage and genomic endonuclease gene editing."
        
        drone_recs = recommend_cpc_codes(drone_text, top_k=3)
        crypto_recs = recommend_cpc_codes(crypto_text, top_k=3)
        biotech_recs = recommend_cpc_codes(biotech_text, top_k=3)
        
        # Verify drone output predictions
        self.assertEqual(drone_recs[0]["cpc_code"], "B64C 39/02")
        
        # Verify crypto output predictions
        self.assertEqual(crypto_recs[0]["cpc_code"], "H04L 9/32")
        
        # Verify biotech output predictions
        self.assertEqual(biotech_recs[0]["cpc_code"], "C12N 15/09")
        
    def test_10_weighted_representation_and_calibration_and_diversity(self):
        from app.cpc_recommender import recommend_cpc_codes
        
        # Test 1: Weighted input representation (Title x3 + Abstract x2 + Claims)
        title = "Autonomous Flight Trajectory Control System"
        abstract = "Avionics control architectures for autonomous quadcopter UAV drones."
        claims = "1. An autonomous unmanned aerial vehicle comprising rotor actuators."
        
        weighted_recs = recommend_cpc_codes("", top_k=3, title=title, abstract=abstract, claims=claims)
        self.assertEqual(weighted_recs[0]["cpc_code"], "B64C 39/02")
        
        # Test 2: Subclass Family Diversity (Top-3 predictions should not repeat same subclass)
        subclasses = [r["subclass"] for r in weighted_recs]
        self.assertGreaterEqual(len(set(subclasses)), 2)

        # Test 3: Confidence calibration & thresholding structure
        self.assertIn("confidence_level", weighted_recs[0])
        self.assertIn(weighted_recs[0]["confidence_level"], ["HIGH", "LOW"])

    def test_11_confidence_calibration_reliability_curve_engine(self):
        from app.evaluation import run_external_evaluation
        
        eval_res = run_external_evaluation()
        self.assertIn("reliability_curve", eval_res)
        self.assertEqual(len(eval_res["reliability_curve"]), 5)
        self.assertIn("expected_calibration_error", eval_res)
        self.assertIn("temperature_scaling_factor", eval_res)
        self.assertEqual(eval_res["temperature_scaling_factor"], 1.15)
        self.assertIn("overconfidence_detected", eval_res)

if __name__ == "__main__":
    unittest.main()
