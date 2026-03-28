# ==========================================
# 🧠 Intelligent Disease Prediction System
# Using User-Reported Symptoms
# ==========================================

import os
import re
import pickle
import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# ==========================================
# CONFIGURATION
# ==========================================

DATA_PATH = r"D:\Main Project\archive\Symptom2Disease.csv"
MODEL_DIR = "saved_models"
MODEL_PATH = os.path.join(MODEL_DIR, "best_model.pkl")

os.makedirs(MODEL_DIR, exist_ok=True)

# ==========================================
# TEXT CLEANING FUNCTION
# ==========================================

def clean_text(text):
    text = text.lower()
    text = re.sub(r"[^a-z\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

# ==========================================
# TRAINING FUNCTION
# ==========================================

def train_and_save_model():
    print("=" * 60)
    print("🔧 TRAINING MODE - Symptom to Disease Model")
    print("=" * 60)

    # Load dataset
    df = pd.read_csv(DATA_PATH)

    print("\n📊 Dataset Preview:")
    print(df.head())

    # Clean text
    df["text"] = df["text"].apply(clean_text)

    # Encode target labels
    label_encoder = LabelEncoder()
    df["label"] = label_encoder.fit_transform(df["label"])

    # Features & target
    X = df["text"]
    y = df["label"]

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # TF-IDF Vectorization
    vectorizer = TfidfVectorizer(
        max_features=5000,
        ngram_range=(1, 2),
        stop_words="english"
    )

    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)

    # Models
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000),
        "Linear SVM": LinearSVC(),
        "Naive Bayes": MultinomialNB()
    }

    best_model = None
    best_accuracy = 0
    best_model_name = ""

    print("\n🔍 Training models...\n")

    for name, model in models.items():
        model.fit(X_train_tfidf, y_train)
        y_pred = model.predict(X_test_tfidf)

        acc = accuracy_score(y_test, y_pred)
        print(f"{name} Accuracy: {acc:.4f}")

        if acc > best_accuracy:
            best_accuracy = acc
            best_model = model
            
            best_model_name = name

    print("\n✅ Best Model Selected:", best_model_name)
    print(f"🎯 Accuracy: {best_accuracy:.4f}")

    # Final evaluation
    y_final_pred = best_model.predict(X_test_tfidf)

    print("\n📊 Classification Report:")
    print(classification_report(
        y_test,
        y_final_pred,
        target_names=label_encoder.classes_
    ))

    # Save everything
    model_data = {
        "model": best_model,
        "vectorizer": vectorizer,
        "label_encoder": label_encoder,
        "model_name": best_model_name,
        "accuracy": best_accuracy
    }

    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model_data, f)

    print("\n💾 Model saved at:", MODEL_PATH)
    print("=" * 60)

    return model_data

# ==========================================
# LOAD MODEL
# ==========================================

def load_model():
    if not os.path.exists(MODEL_PATH):
        print("❌ No saved model found. Training new model...")
        return train_and_save_model()

    with open(MODEL_PATH, "rb") as f:
        model_data = pickle.load(f)

    print("✅ Loaded model:", model_data["model_name"])
    print(f"📊 Accuracy: {model_data['accuracy']:.4f}")
    return model_data

# ==========================================
# PREDICTION FUNCTION
# ==========================================

def predict_disease(model_data, user_input):
    model = model_data["model"]
    vectorizer = model_data["vectorizer"]
    label_encoder = model_data["label_encoder"]

    cleaned_input = clean_text(user_input)
    input_tfidf = vectorizer.transform([cleaned_input])

    prediction = model.predict(input_tfidf)[0]
    disease = label_encoder.inverse_transform([prediction])[0]

    return disease

# ==========================================
# INTERACTIVE MODE
# ==========================================

def interactive_mode(model_data):
    print("\n" + "=" * 60)
    print("🧠 INTELLIGENT DISEASE PREDICTION SYSTEM")
    print("=" * 60)

    while True:
        symptoms = input("\n📝 Enter symptoms (comma separated):\n> ")

        if symptoms.strip().lower() in ["exit", "quit"]:
            print("\n👋 Exiting system...")
            break

        disease = predict_disease(model_data, symptoms)

        print("\n🩺 PREDICTED DISEASE:")
        print("➡️ ", disease.upper())

        cont = input("\n🔄 Predict another? (y/n): ").strip().lower()
        if cont != "y":
            print("\n👋 Goodbye!")
            break

# ==========================================
# MAIN
# ==========================================

if __name__ == "__main__":
    print("\n🧠 Intelligent Disease Prediction System")
    print("Using User-Reported Symptoms")

    model_data = load_model()
    interactive_mode(model_data)
