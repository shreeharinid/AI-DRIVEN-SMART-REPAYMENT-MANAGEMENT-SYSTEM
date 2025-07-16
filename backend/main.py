import mysql.connector
from flask_cors import CORS
from flask import *
import os
import sqlite3 as sq
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsRegressor
import bcrypt

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
UPLOAD_FOLDER = 'static'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load the dataset
df = pd.read_csv('check.csv')

# Separate features (X) and target (y)
X = df.drop('Loan Eligibility', axis=1).values
y = df['Loan Eligibility'].values

# Normalize numerical features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Create and train the Random Forest model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
confusion = confusion_matrix(y_test, y_pred)
report = classification_report(y_test, y_pred)
def loaneligableamount(income_per_month, expenses_per_month, max_emi_ratio=0.3):
        # Calculate net disposable income
        disposable_income = income_per_month - expenses_per_month
        # Maximum EMI allowed (as a percentage of net disposable income)
        max_emi = disposable_income * max_emi_ratio
        # Eligible loan amount without considering interest (direct multiplication)
        eligible_loan_amount = max_emi * 60
        return  round(eligible_loan_amount, 2)

    
def customer(s):
    engine=sq.connect("data.db")
    sample=pd.read_csv("static/"+s)
    sample.to_sql('customer', con=engine, if_exists='append', index=False)
def repaymentamount(loan_amount_new,income_new):
   
    # Generate synthetic dataset (replace with real data)
    np.random.seed(42)
    num_samples = 1000
    loan_amount = np.random.randint(100000, 10000000, num_samples)  # Loan amounts between 100k and 10M
    interest_rate = np.random.uniform(5, 15, num_samples)           # Interest rate between 5% and 15%
    income = np.random.randint(30000, 200000, num_samples)          # Monthly income between 30k and 200k
    tenure = np.random.randint(12, 360, num_samples)                # Tenure between 12 months and 30 years
    emi = (loan_amount * (interest_rate / 12 / 100) * (1 + interest_rate / 12 / 100) ** tenure) / ((1 + interest_rate / 12 / 100) ** tenure - 1)

    # Create DataFrame
    data = pd.DataFrame({
        'LoanAmount': loan_amount,
        'InterestRate': interest_rate,
        'Income': income,
        'Tenure': tenure,
        'EMI': emi
    })

    # Split data into features and target
    X = data[['LoanAmount', 'InterestRate', 'Income']]
    y_emi = data['EMI']
    y_tenure = data['Tenure']

    # Train/test split
    X_train, X_test, y_emi_train, y_emi_test = train_test_split(X, y_emi, test_size=0.2, random_state=42)
    _, _, y_tenure_train, y_tenure_test = train_test_split(X, y_tenure, test_size=0.2, random_state=42)

    # Feature scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Train KNN Regressor for EMI prediction
    knn_emi = KNeighborsRegressor(n_neighbors=5)
    knn_emi.fit(X_train_scaled, y_emi_train)

    # Train KNN Regressor for Tenure prediction
    knn_tenure = KNeighborsRegressor(n_neighbors=5)
    knn_tenure.fit(X_train_scaled, y_tenure_train)

    # Function to predict multiple repayment plans
    def generate_ai_repayment_options(loan_amount, interest_rate, income):
        # New borrower input (loan details)
        new_data = np.array([[loan_amount, interest_rate, income]])
        new_data_scaled = scaler.transform(new_data)
        
        # Predict EMI and Tenure for the input
        predicted_emi = knn_emi.predict(new_data_scaled)
        predicted_tenure = knn_tenure.predict(new_data_scaled)
        
        # Generate multiple repayment options (vary EMI and tenure)
        tenure_options = np.linspace(max(12, predicted_tenure[0] - 60), min(360, predicted_tenure[0] + 60), 10)
        
        repayment_options = []
        for tenure in tenure_options:
            emi = calculate_emi(loan_amount, interest_rate, tenure)
            repayment_options.append({
                'Tenure (Months)': int(tenure),
                'EMI (INR)': round(emi, 2),
                'Total Interest (INR)': round(emi * tenure - loan_amount, 2),
                'Total Payment (INR)': round(emi * tenure, 2)
            })
        
        return pd.DataFrame(repayment_options)

    # Calculate EMI function
    def calculate_emi(loan_amount, interest_rate, tenure_months):
        monthly_rate = interest_rate / (12 * 100)
        emi = loan_amount * monthly_rate * (1 + monthly_rate) ** tenure_months / ((1 + monthly_rate) ** tenure_months - 1)
        return emi

    # Example input
   
    interest_rate_new = 7.5     # 7.5% annual interest
    

    # Get multiple repayment options
    repayment_options_df = generate_ai_repayment_options(loan_amount_new, interest_rate_new, income_new)

    # Display the options
 
    return repayment_options_df.values.tolist()
def customerloan(s,sd):
    engine=sq.connect("data.db")
    sample=pd.read_csv("static/"+sd)
    sample.to_sql('customer', con=engine, if_exists='append', index=False)
    sampleloan=pd.read_csv("static/"+s)
    sampleloan.to_sql('customer_loan', con=engine, if_exists='append', index=False)
    unique_customers_df = sampleloan.groupby(['customerid', 'loanno']).agg({
    'Loan Amount': 'first',  # First loan amount per customer and loan number
    'Interest Rate (%)': 'first',  # First interest rate per loan
    'EMI Amount': 'first',  # First EMI amount per loan
     'Repayment Period (Months)': 'first',  # First EMI amount per loan
     'Outstanding Balance Amount':'first',
     'Bank Statement':'first',
      'payment': ['sum', lambda x: (x == 0).sum()]  # Sum of 1s (ontime) and count of 0s (offtime)
}).reset_index()

    unique_customers_df.columns = ['customerid', 'loanno', 'Loan Amount', 'Interest Rate (%)', 'EMI Amount','Repayment Period (Months)','Outstanding Balance Amount', 'Bank Statement','ontime_payment', 'offtime_payment']
    result = unique_customers_df.groupby('customerid').agg({
    'EMI Amount': 'sum',
    'ontime_payment': 'sum',
    'offtime_payment': 'sum',
    'loanno': 'count'  # Count the number of loans per customer
}).reset_index()
    # Rename the 'loanno' column to 'loan_count' for clarity
    result.rename(columns={'loanno': 'loan_count'}, inplace=True)
    merged_df = pd.merge(result, sample, left_on='customerid', right_on='Customerid')
    # Drop the duplicate 'Customer ID' column
    merged_df.drop(columns=['Customerid'], inplace=True)
    data=merged_df.values.tolist()
    scaler = StandardScaler()
    X = merged_df.drop(['customerid', 'CustomerName'], axis=1)  # Exclude non-numeric columns for scaling
    scaler.fit(X)  # Fit the scaler on the original DataFrame before applying to the test data

    # Transform the Not Eligible test data
    not_eligible_test_scaled = scaler.transform(X)

    # Reshape if needed (for 1D input)
    not_eligible_test_scaled = not_eligible_test_scaled.reshape((not_eligible_test_scaled.shape[0], -1))

    # Make prediction
    not_eligible_prediction = model.predict(not_eligible_test_scaled)
    
    # Convert prediction to eligibility status
    eligibility_status = 'Eligible' if not_eligible_prediction[0] == 1 else 'Not Eligible'
    if eligibility_status=='Eligible':
        loanamount=loaneligableamount(data[0][6], data[0][1]+data[0][7], 0.3)
        print(loanamount)
        if loanamount>=0:
            plans=repaymentamount(loanamount,data[0][1]+data[0][7])
            value={"eligibility_status":eligibility_status,"loanamount":loanamount,"plans":plans}
            print(value)
            return value
        else:
           return {"eligibility_status":'Not Eligible'}
    else:
        return {"eligibility_status":eligibility_status}
    
@app.route('/upload', methods=['POST'])
def file():
    if 'file' not in request.files:
        return jsonify(message='No file part'), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify(message='No selected file'), 400
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
    if(request.form["reason"]=="first"):
        customer(file.filename)
        data='File successfully uploaded'
        return jsonify(message=data,file=file.filename), 200
    if(request.form["reason"]=="second"):
        data=customerloan(file.filename,"sample.csv")
        print(data)
        return jsonify(message=data,file=file.filename), 200
    

@app.route('/reg', methods=['POST'])
def reg():
    r=request.json
    s=sq.connect("data.db")
    hashed_password = bcrypt.hashpw(r["password"].encode('utf-8'), bcrypt.gensalt())
    s.execute("create table if not exists user(uid integer primary key autoincrement, name varchar(1000),password varchar(1000),role varchar(100),email varchar(100))")
    s.execute("insert into user (name,password,role,email) values (?,?,?,?)",(r["name"],hashed_password,r["role"],r["email"]))
    s.commit()
    return 's'


@app.route('/', methods=['POST'])
def log():
    r = request.json
    s = sq.connect("data.db")
    
    # Fetch the user with the given email
    user = s.execute("SELECT * FROM user WHERE email=?", (r["email"],)).fetchone()
    
    # If user exists, verify the password
    if user and bcrypt.checkpw(r["password"].encode('utf-8'), user[2]):  # user[2] is the hashed password from DB (bytes)
        return jsonify({"uid": user[0], "name": user[1], "role": user[3], "email": user[4]})
    else:
        return jsonify({"error": "Invalid email or password"}), 401

@app.route('/viewuser', methods=['POST'])
def viewuser():
    r=request.json
    s=sq.connect("data.db")
    x="""SELECT 
    c.customerid, 
    cl.loanno, 
    MAX(c.Income) AS Income, 
    MAX(c.AverageMonthlyExpenditure) AS AverageMonthlyExpenditure, 
    MAX(c.CreditScore) AS CreditScore, 
    MAX(cl.`Loan Amount`) AS `Loan Amount`, 
    MAX(cl.`Interest Rate (%)`) AS `Interest Rate (%)`, 
    MAX(cl.`Repayment Period (Months)`) AS `Repayment Period (Months)`, 
    MAX(cl.`EMI Amount`) AS `EMI Amount`, 
    COUNT(CASE WHEN cl.payment = 1 THEN 1 END) AS OnTimePayments, 
    COUNT(CASE WHEN cl.payment = 0 THEN 1 END) AS OffTimePayments
FROM 
    customer c 
JOIN 
    customer_loan cl ON c.customerid = cl.Customerid 
WHERE 
    c.customerid = '{0}'
GROUP BY 
    c.customerid, cl.loanno;""".format(r["uid"])
    
    d=s.execute(x).fetchall()
    s.commit()
    print(d)
    return jsonify(d)



if __name__ == '__main__':
    app.run(debug=True)