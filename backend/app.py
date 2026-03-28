
from flask import Flask, request, redirect, url_for, session, flash, send_file, jsonify
from main import load_model, predict_disease
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from flask_cors import CORS
from io import BytesIO
from fpdf import FPDF



app = Flask(__name__)
# Set session cookie for cross-origin (React+Flask dev)
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True if using HTTPS
# Restrict CORS to frontend origin for local dev
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)
app.secret_key = "your_secret_key_here"

DB_NAME = "users.db"

model_data = load_model()


# --- DB connection helper must come first ---

# Place this after app = Flask(__name__) and all imports
@app.route("/session", methods=["GET"])
def session_info():
    if "user_id" in session:
        # Always re-check admin status from database for accuracy
        current_admin_status = is_admin(session.get("user_email", ""))
        # Update session if admin status changed
        if session.get("is_admin") != current_admin_status:
            session["is_admin"] = current_admin_status
        print(f"session: user_id={session['user_id']}, email={session['user_email']}, is_admin={current_admin_status}")
        return jsonify({
            "logged_in": True,
            "user": {
                "id": session["user_id"],
                "name": session["user_name"],
                "email": session["user_email"],
                "address": session["user_address"],
                "is_admin": current_admin_status
            }
        })
    else:
        return jsonify({"logged_in": False, "user": None})

# Debug endpoint to check session
@app.route("/debug_session")
def debug_session():
    return jsonify({
        "session": dict(session),
        "user_id": session.get("user_id"),
        "user_name": session.get("user_name"),
        "user_email": session.get("user_email")
    })

# --- DB connection helper must come first ---
def get_db_connection():
    """Get database connection with row factory for named column access"""
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

# Load disease info from SQLite
def load_disease_data():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM disease_info")
    rows = cursor.fetchall()
    conn.close()
    return {row['name']: {
        'description': row['description'],
        'causes': row['causes'],
        'precautions': row['precautions'],
        'image': row['image']
    } for row in rows}

disease_data = load_disease_data()

# Load doctor recommendations from JSON
def load_doctor_recommendations():
    import json
    with open('doctor_recommendations.json', 'r') as f:
        return json.load(f)

doctor_recommendations = load_doctor_recommendations()

def load_admin_emails():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT email FROM admins")
    emails = [row['email'] for row in cursor.fetchall()]
    conn.close()
    return emails

ADMIN_EMAILS = load_admin_emails()

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            address TEXT,
            password TEXT NOT NULL,
            last_login TIMESTAMP
        )
    """)
    # Check if address and last_login columns exist, if not add them
    cursor.execute("PRAGMA table_info(users)")
    columns = [col[1] for col in cursor.fetchall()]
    if 'address' not in columns:
        cursor.execute("ALTER TABLE users ADD COLUMN address TEXT")
    if 'last_login' not in columns:
        cursor.execute("ALTER TABLE users ADD COLUMN last_login TIMESTAMP")
    conn.commit()
    conn.close()

init_db()

def is_admin(email):
    """Check if user email is in admin list - queries database directly"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT 1 FROM admins WHERE email = ?", (email,))
    result = cursor.fetchone()
    conn.close()
    return result is not None


def save_diagnostic_result(user_id, user_email, user_name, address, symptoms, disease, accuracy):
    """Save diagnostic result to SQLite database"""
    conn = get_db_connection()
    cursor = conn.cursor()
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    cursor.execute(
        """
        INSERT INTO diagnostics (user_id, user_email, user_name, address, symptoms, disease, accuracy, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (user_id, user_email, user_name, address, symptoms, disease, accuracy, timestamp)
    )
    conn.commit()
    result_id = cursor.lastrowid
    conn.close()
    return {
        "id": result_id,
        "user_id": user_id,
        "user_email": user_email,
        "user_name": user_name,
        "address": address,
        "symptoms": symptoms,
        "disease": disease,
        "accuracy": accuracy,
        "timestamp": timestamp
    }

@app.route("/")
def welcome():
    # React frontend handles this route
    return jsonify({"message": "Welcome to Disease Prediction System API"})

@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        if request.is_json:
            data = request.get_json()
            name = data.get("name")
            address = data.get("address")
            email = data.get("email")
            password = generate_password_hash(data.get("password"))
        else:
            name = request.form["name"]
            address = request.form["address"]
            email = request.form["email"]
            password = generate_password_hash(request.form["password"])

        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO users (name, email, address, password) VALUES (?, ?, ?, ?)",
                (name, email, address, password)
            )
            conn.commit()
            conn.close()
            if request.is_json:
                return jsonify({"success": True, "message": "Account created successfully! Please login."})
            else:
                flash("Account created successfully! Please login.", "success")
                return redirect(url_for("login"))
        except sqlite3.IntegrityError:
            if request.is_json:
                return jsonify({"success": False, "message": "Email already exists. Try another one."}), 400
            else:
                flash("Email already exists. Try another one.", "danger")

    if request.is_json:
        return jsonify({"success": False, "message": "Invalid request method."}), 405
    # React frontend handles signup page
    return jsonify({"success": False, "message": "Please use React frontend for signup"})

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        if request.is_json:
            data = request.get_json()
            email = data.get("email")
            password = data.get("password")
        else:
            email = request.form["email"]
            password = request.form["password"]

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()

        if user and check_password_hash(user['password'], password):
            # Update last login time
            cursor.execute(
                "UPDATE users SET last_login = ? WHERE id = ?",
                (datetime.now().strftime('%Y-%m-%d %H:%M:%S'), user['id'])
            )
            conn.commit()
            
            # Check admin status
            admin_status = is_admin(email)
            print(f"Login: {email} - is_admin: {admin_status}")
            
            session["user_id"] = user['id']
            session["user_name"] = user['name']
            session["user_email"] = user['email']
            session["user_address"] = user['address']
            session["is_admin"] = admin_status
            conn.close()
            if request.is_json:
                return jsonify({"success": True, "message": "Login successful!", "user": {"id": user['id'], "name": user['name'], "email": user['email'], "address": user['address'], "is_admin": admin_status}})
            else:
                flash("Login successful!", "success")
                return redirect(url_for("home"))
        else:
            conn.close()
            if request.is_json:
                return jsonify({"success": False, "message": "Invalid email or password."}), 401
            else:
                flash("Invalid email or password.", "danger")

    if request.is_json:
        return jsonify({"success": False, "message": "Invalid request method."}), 405
    # React frontend handles login page
    return jsonify({"success": False, "message": "Please use React frontend for login"})

@app.route("/logout")
def logout():
    # React frontend handles logout page
    return jsonify({"success": True, "message": "Logged out successfully"})

@app.route("/logout_confirm")
def logout_confirm():
    session.clear()
    flash("Logged out successfully.", "info")
    # Check if request is from React (JSON request)
    if request.is_json or request.headers.get('Accept') == 'application/json':
        return jsonify({"success": True, "message": "Logged out successfully"})
    return redirect(url_for("login"))


@app.route("/predict", methods=["POST"])
def predict():
    if "user_id" not in session:
        return jsonify({"success": False, "message": "Unauthorized. Please login."}), 401
        
    data = request.get_json()
    symptoms = data.get("symptoms", "")
    disease = predict_disease(model_data, symptoms)
    info = disease_data.get(disease, {})
    accuracy = model_data.get("accuracy", 0)
    
    # Save diagnostic result to database
    diagnostic = save_diagnostic_result(
        user_id=session["user_id"],
        user_email=session["user_email"],
        user_name=session["user_name"],
        address=session.get("user_address", ""),
        symptoms=symptoms,
        disease=disease,
        accuracy=f"{accuracy:.2%}"
    )

    # Get doctor recommendation
    doctor_info = doctor_recommendations.get(disease, {
        "doctor": "General Physician",
        "description": "Primary care physician for general health concerns"
    })

    return jsonify({
        "success": True,
        "disease": disease,
        "description": info.get("description"),
        "causes": info.get("causes"),
        "precautions": info.get("precautions"),
        "image": info.get("image", "default.jpg"),
        "accuracy": f"{accuracy:.2%}",
        "diagnostic_id": diagnostic["id"],
        "doctor": doctor_info.get("doctor"),
        "doctor_description": doctor_info.get("description")
    })

@app.route("/download_report", methods=["POST"])
def download_report():
    if "user_id" not in session:
        return redirect(url_for("login"))
    
    data = request.get_json()
    user_name = data.get("user_name", "")
    symptoms = data.get("symptoms", "")
    disease = data.get("disease", "")
    description = data.get("description", "")
    causes = data.get("causes", "")
    precautions = data.get("precautions", "")
    accuracy = data.get("accuracy", "")
    
    try:
        # Create simple PDF using fpdf2 with standard fonts only
        pdf = FPDF()
        pdf.add_page()
        pdf.set_auto_page_break(auto=True, margin=10)
        
        # Title
        pdf.set_font("Helvetica", 'B', 14)
        pdf.set_text_color(0, 0, 0)
        pdf.cell(0, 8, "INTELLIGENT DISEASE PREDICTION SYSTEM", 0, 1, 'L')
        
        pdf.set_font("Helvetica", 'B', 10)
        pdf.cell(0, 6, "MEDICAL ANALYSIS REPORT", 0, 1, 'L')
        
        # Date
        pdf.set_font("Helvetica", '', 8)
        pdf.cell(0, 5, f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", 0, 1, 'R')
        
        pdf.ln(3)
        
        # Patient Info
        pdf.set_font("Helvetica", 'B', 9)
        pdf.cell(40, 5, "Patient Name:", 0, 0)
        pdf.set_font("Helvetica", '', 9)
        pdf.cell(0, 5, str(user_name)[:40], 0, 1)
        
        pdf.set_font("Helvetica", 'B', 9)
        pdf.cell(40, 5, "Symptoms:", 0, 0)
        pdf.set_font("Helvetica", '', 9)
        pdf.cell(0, 5, str(symptoms)[:40], 0, 1)
        
        pdf.ln(2)
        
        # Disease
        pdf.set_font("Helvetica", 'B', 12)
        pdf.set_text_color(30, 80, 150)
        pdf.cell(0, 8, f"Predicted Disease: {str(disease)[:40]}", 0, 1, 'L')
        pdf.set_text_color(0, 0, 0)
        
        pdf.ln(4)
        
        # About
        pdf.set_font("Helvetica", 'B', 9)
        pdf.cell(0, 6, "About This Condition:", 0, 1, 'L')
        pdf.set_font("Helvetica", '', 9)
        pdf.multi_cell(0, 4, str(description)[:400])

        # Causes (heading left, above data)
        pdf.ln(2)
        pdf.set_font("Helvetica", 'B', 9)
        pdf.cell(0, 6, "Common Causes:", 0, 1, 'L')
        pdf.set_font("Helvetica", '', 9)
        pdf.multi_cell(0, 4, str(causes)[:400])

        # Precautions (heading left, above data)
        pdf.ln(2)
        pdf.set_font("Helvetica", 'B', 9)
        pdf.cell(0, 6, "Recommended Precautions:", 0, 1, 'L')
        pdf.set_font("Helvetica", '', 9)
        pdf.multi_cell(0, 4, str(precautions)[:400])
        
        pdf.ln(3)
        
        # Disclaimer
        pdf.set_font("Helvetica", 'B', 8)
        pdf.set_text_color(150, 100, 0)
        pdf.cell(0, 5, "DISCLAIMER & MODEL ACCURACY", 0, 1)
        pdf.set_font("Helvetica", '', 8)
        pdf.set_text_color(100, 70, 0)
        pdf.cell(0, 5, f"Model Accuracy: {accuracy}", 0, 1)
        disclaimer = "This application provides initial guidance based on machine learning and does NOT replace professional medical advice. Please consult a qualified healthcare professional."
        pdf.multi_cell(0, 4, disclaimer)
        
        # Get PDF output
        pdf_output = pdf.output(dest='S')
        if isinstance(pdf_output, str):
            pdf_bytes = pdf_output.encode('latin-1')
        else:
            pdf_bytes = pdf_output
            
        pdf_buffer = BytesIO(pdf_bytes)
        
        return send_file(
            pdf_buffer,
            mimetype="application/pdf",
            as_attachment=True,
            download_name=f"diagnosis_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        )
    except Exception as e:
        print(f"PDF Error: {str(e)}")
        # Fallback: text file
        text_content = f"""MEDICAL DIAGNOSIS REPORT
{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

Patient: {user_name}
Symptoms: {symptoms}
Predicted Disease: {disease}

ABOUT: {description}
CAUSES: {causes}
PRECAUTIONS: {precautions}

Accuracy: {accuracy}
Disclaimer: Not a replacement for professional medical advice.
"""
        return send_file(
            BytesIO(text_content.encode()),
            mimetype="text/plain",
            as_attachment=True,
            download_name=f"diagnosis_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        )

@app.route("/admin_panel")
def admin_panel():
    # Always return JSON for API requests
    if "user_id" not in session:
        return jsonify({"success": False, "message": "Please login to access admin panel"}), 401
    
    # Re-check admin status from database directly  
    email = session.get('user_email', '')
    actual_admin_status = is_admin(email)
    
    if not actual_admin_status:
        return jsonify({"success": False, "message": "Admin access required"}), 403
    
    # Get all users
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, address, last_login FROM users ORDER BY last_login DESC")
    users = [dict(row) for row in cursor.fetchall()]

    # Read diagnostics from SQLite
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM diagnostics")
    diagnostics = [dict(row) for row in cursor.fetchall()]
    conn.close()

    # Group diagnostics by user_id
    user_diagnostics = {}
    for diag in diagnostics:
        user_id = diag.get("user_id")
        if user_id not in user_diagnostics:
            user_diagnostics[user_id] = []
        user_diagnostics[user_id].append(diag)

    # Sort by timestamp (most recent first)
    for uid in user_diagnostics:
        user_diagnostics[uid].sort(key=lambda x: x.get("timestamp", ""), reverse=True)

    user_name = session.get("user_name")
    return jsonify({
        "success": True,
        "users": users,
        "user_diagnostics": user_diagnostics,
        "user_name": user_name
    })

@app.route("/admin/user/<int:user_id>")
def admin_user_history(user_id):
    """Get diagnostics for a specific user (admin only)"""
    if "user_id" not in session:
        return jsonify({"success": False, "message": "Please login"}), 401
    
    email = session.get('user_email', '')
    if not is_admin(email):
        return jsonify({"success": False, "message": "Admin access required"}), 403
    
    # Get user info
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, address, last_login FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    conn.close()
    
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404
    
    # Get user's diagnostics
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM diagnostics WHERE user_id = ? ORDER BY timestamp DESC", (user_id,))
    diagnostics = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return jsonify({
        "success": True,
        "user": dict(user),
        "diagnostics": diagnostics
    })

@app.route("/history")
def history():
    if "user_id" not in session:
        # Check if this is a JSON/API request
        if request.is_json or request.headers.get('Accept') == 'application/json':
            return jsonify({"success": False, "message": "Unauthorized"}), 401
        return redirect(url_for("login"))
    user_id = session["user_id"]
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM diagnostics WHERE user_id = ? ORDER BY timestamp DESC", (user_id,))
    diagnostics = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify({
        "success": True,
        "diagnostics": diagnostics,
        "user_name": session.get("user_name")
    })

# Download previous report by id
@app.route("/download_report/<int:diag_id>")
def download_report_by_id(diag_id):
    if "user_id" not in session:
        return redirect(url_for("login"))
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM diagnostics WHERE id = ? AND user_id = ?", (diag_id, session["user_id"]))
    diag = cursor.fetchone()
    conn.close()
    if not diag:
        flash("Report not found.", "danger")
        return redirect(url_for("history"))
    # Reuse the PDF generation logic
    info = disease_data.get(diag["disease"], {})
    from fpdf import FPDF
    from io import BytesIO
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=10)
    pdf.set_font("Helvetica", 'B', 14)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 8, "INTELLIGENT DISEASE PREDICTION SYSTEM", 0, 1, 'L')
    pdf.set_font("Helvetica", 'B', 10)
    pdf.cell(0, 6, "MEDICAL ANALYSIS REPORT", 0, 1, 'L')
    pdf.set_font("Helvetica", '', 8)
    pdf.cell(0, 5, f"Generated: {diag['timestamp']}", 0, 1, 'R')
    pdf.ln(3)
    pdf.set_font("Helvetica", 'B', 9)
    pdf.cell(40, 5, "Patient Name:", 0, 0)
    pdf.set_font("Helvetica", '', 9)
    pdf.cell(0, 5, str(diag['user_name'])[:40], 0, 1)
    pdf.set_font("Helvetica", 'B', 9)
    pdf.cell(40, 5, "Symptoms:", 0, 0)
    pdf.set_font("Helvetica", '', 9)
    pdf.cell(0, 5, str(diag['symptoms'])[:40], 0, 1)
    pdf.ln(2)
    pdf.set_font("Helvetica", 'B', 12)
    pdf.set_text_color(30, 80, 150)
    pdf.cell(0, 8, f"Predicted Disease: {str(diag['disease'])[:40]}", 0, 1, 'L')
    pdf.set_text_color(0, 0, 0)
    pdf.ln(4)
    pdf.set_font("Helvetica", 'B', 9)
    pdf.cell(0, 6, "About This Condition:", 0, 1, 'L')
    pdf.set_font("Helvetica", '', 9)
    pdf.multi_cell(0, 4, str(info.get("description", ""))[:400])
    pdf.ln(2)
    pdf.set_font("Helvetica", 'B', 9)
    pdf.cell(0, 6, "Common Causes:", 0, 1, 'L')
    pdf.set_font("Helvetica", '', 9)
    pdf.multi_cell(0, 4, str(info.get("causes", ""))[:400])
    pdf.ln(2)
    pdf.set_font("Helvetica", 'B', 9)
    pdf.cell(0, 6, "Recommended Precautions:", 0, 1, 'L')
    pdf.set_font("Helvetica", '', 9)
    pdf.multi_cell(0, 4, str(info.get("precautions", ""))[:400])
    pdf.ln(3)
    pdf.set_font("Helvetica", 'B', 8)
    pdf.set_text_color(150, 100, 0)
    pdf.cell(0, 5, "DISCLAIMER & MODEL ACCURACY", 0, 1)
    pdf.set_font("Helvetica", '', 8)
    pdf.set_text_color(100, 70, 0)
    pdf.cell(0, 5, f"Model Accuracy: {diag['accuracy']}", 0, 1)
    disclaimer = "This application provides initial guidance based on machine learning and does NOT replace professional medical advice. Please consult a qualified healthcare professional."
    pdf.multi_cell(0, 4, disclaimer)
    pdf_output = pdf.output(dest='S')
    if isinstance(pdf_output, str):
        pdf_bytes = pdf_output.encode('latin-1')
    else:
        pdf_bytes = pdf_output
    pdf_buffer = BytesIO(pdf_bytes)
    return send_file(
        pdf_buffer,
        mimetype="application/pdf",
        as_attachment=True,
        download_name=f"diagnosis_report_{diag['timestamp'].replace(':','-').replace(' ','_')}.pdf"
    )

if __name__ == "__main__":
    app.run(debug=True)