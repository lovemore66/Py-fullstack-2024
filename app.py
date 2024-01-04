from flask import Flask, request, jsonify, render_template
from models import db, YourModel
import mysql.connector
mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="Msangosfamily@1",
  database="sys"
)
print(mydb)
if mydb.is_connected():
    print("Connected to the database")
else:
    print("Failed to connect to the database")


# Create a cursor object to interact with the database
cursor = mydb.cursor()

cursor.execute("SHOW DATABASES")
results = cursor.fetchall()  # Fetch all rows from the result set
for row in results:
    print(row)  # Process each row, e.g., print or perform some action
cursor.close()  # Close the cursor after fetching and processing results
mydb.close()



app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'  # Change this for other databases
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db.init_app(app)

# Create tables based on the models
with app.app_context():
    db.create_all()

# CRUD operations

# Create
@app.route('/create', methods=['POST'])
def create_record():
    # Get data from request
    # Example: data = request.json
    # Create a new record using SQLAlchemy
    # Example: new_record = YourModel(field1=data['field1'], field2=data['field2'])
    # Add the new record to the session and commit
    # Example: db.session.add(new_record)
    # db.session.commit()
    return jsonify({'message': 'Record created successfully'})

# Read
@app.route('/read/<int:id>', methods=['GET'])
def read_record(id):
    # Query the database to retrieve a record by ID
    # Example: record = YourModel.query.get(id)
    # Convert the record to a dictionary or JSON and return
    # Example: return jsonify({'id': record.id, 'field1': record.field1, 'field2': record.field2})
    return jsonify({'message': 'Record not found'}), 404

# Update
@app.route('/update/<int:id>', methods=['PUT'])
def update_record(id):
    # Query the database to retrieve the record by ID
    # Example: record = YourModel.query.get(id)
    # Update the record fields based on request data
    # Example: record.field1 = request.json['field1']
    # Commit the changes
    # Example: db.session.commit()
    return jsonify({'message': 'Record updated successfully'})

# Delete
@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_record(id):
    # Query the database to retrieve the record by ID
    # Example: record = YourModel.query.get(id)
    # Delete the record
    # Example: db.session.delete(record)
    # Commit the changes
    # Example: db.session.commit()
    return jsonify({'message': 'Record deleted successfully'})

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/favicon.ico')
def favicon():
    return 'icon'

if __name__ == '__main__':
    app.run(debug=True)
