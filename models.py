from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class YourModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # Add your model fields here
