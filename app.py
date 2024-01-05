from flask import Flask, request, jsonify, render_template
import mysql.connector
from datetime import datetime

app = Flask(__name__)

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="Msangosfamily@1",
  database="sakila"
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

# CRUD operations

# Create
@app.route('/create', methods=['POST'])
def create_record():
    data = request.json
    query = "INSERT INTO actor (first_name, last_name, last_update) VALUES (%s, %s, %s)"
    values = (data['first_name'], data['last_name'], data['last_update'])
    cursor.execute(query, values)
    mydb.commit()
    return jsonify({'message': 'Record created successfully'})

# Read
@app.route('/read/<int:id>', methods=['GET'])
def read_record(id):
   query = "SELECT * FROM actor WHERE actor_id = %s"
   value = (id,)   
   cursor.execute(query, value)
   record = cursor.fetchone()   
   if record:
       record_dict = {
           'actor_id': record[0],
           'first_name': record[1],
           'last_name': record[2],
           'last_update': record[3]
       }
       return jsonify(record_dict)
   return jsonify({'message': 'Record not found'}), 404

# Retrieve all actors
@app.route('/actors', methods=['GET'])
def get_all_actors():
    query = "SELECT * FROM actor"
    cursor.execute(query)
    records = cursor.fetchall()

    actor_list = []
    for record in records:
        actor_dict = {
            'actor_id': record[0],
            'first_name': record[1],
            'last_name': record[2],
            'last_update': record[3]
        }
        actor_list.append(actor_dict)

    return jsonify(actor_list)


# Update
@app.route('/update/<int:id>', methods=['PUT'])
def update_record(id):
    data = request.json
    # Example: UPDATE your_table_name SET field1 = %s, field2 = %s WHERE id = %s
    query = "UPDATE actor SET first_name = %s, last_name = %s, last_update = %s WHERE actor_id = %s"
    values = (data['first_name'], data['last_name'], data['last_update'], id)
    cursor.execute(query, values)
    mydb.commit()
    return jsonify({'message': 'Record updated successfully'})


# Delete
@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_record(id):
    try:
        # Delete associated records from the 'film_actor' table
        delete_associated_records_query = "DELETE FROM film_actor WHERE actor_id = %s"
        value = (id,)
        cursor.execute(delete_associated_records_query, value)
        mydb.commit()

        # Now delete the record from the 'actor' table
        delete_actor_query = "DELETE FROM actor WHERE actor_id = %s"
        cursor.execute(delete_actor_query, value)
        mydb.commit()

        return jsonify({'message': 'Record deleted successfully'})
    except mysql.connector.Error as error:
        return jsonify({'message': f'Failed to delete record: {error}'}), 500


@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
