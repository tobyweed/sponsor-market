from flask_sqlalchemy import SQLAlchemy
from passlib.hash import pbkdf2_sha256 as sha256

db = SQLAlchemy() #Necessary to declare this here instead of server to avoid circular imports


# Event models
'''
One model (EventInfo) has most of the important fields,
another (Event) has all of the date and location info.

The eventinfo to event relationship is one to many.
There is another one to many join for event types, and another for images.
'''
class EventInfo(db.Model):
    __tablename__ = 'event_info'

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(120), nullable = False)

    events = db.relationship("Event", order_by=Event.id, back_populates="event_info")
    #Promoter
    #event
    #event type

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


class Event(db.Model):
    __tablename__ = 'event'

    id = db.Column(db.Integer, primary_key = True)

    event_info = db.relationship("EventInfo", back_populates="events")
    #Promoter
    #event
    #event type

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


#represents users
class UserModel(db.Model):
    __tablename__ = 'users'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(120), unique = True, nullable = False)
    password = db.Column(db.String(120), nullable = False)
    firstName = db.Column(db.String(120))
    lastName = db.Column(db.String(120))
    email = db.Column(db.String(120))
    phoneNumber = db.Column(db.String(120))
    proPic = db.Column(db.String(120))
    organization = db.Column(db.String(120))
    promoter_name = db.Column(db.String(120), db.ForeignKey('promoters.name'))

    promoter = db.relationship("PromoterModel", back_populates="users")

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_by_username(cls, username):
       return cls.query.filter_by(username = username).first()

    @classmethod
    def return_all(cls):
        def to_json(x):
            return {
                'username': x.username,
                'password': x.password
            }
        return {'users': list(map(lambda x: to_json(x), UserModel.query.all()))}

    @classmethod
    def delete_all(cls):
        try:
            num_rows_deleted = db.session.query(cls).delete()
            db.session.commit()
            return {'message': '{} row(s) deleted'.format(num_rows_deleted)}
        except:
            return {'message': 'Something went wrong'}

    @staticmethod
    def generate_hash(password):
        return sha256.hash(password)

    @staticmethod
    def verify_hash(password, hash):
        return sha256.verify(password, hash)


class PromoterModel(db.Model):
    __tablename__ = 'promoters'

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(120), unique = True, nullable = False)

    users = db.relationship("UserModel", order_by=UserModel.id, back_populates="promoter")

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_by_name(cls, name):
       return cls.query.filter_by(name = name).first()

    @classmethod
    def return_all(cls):
        def to_json(x):
            return {
                'name': x.name
            }
        return {'users': list(map(lambda x: to_json(x), PromoterModel.query.all()))}



#for when a user logs out, so we can disable their keys
class RevokedTokenModel(db.Model):
    __tablename__ = 'revoked_tokens'
    id = db.Column(db.Integer, primary_key = True)
    jti = db.Column(db.String(120))

    def add(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def is_jti_blacklisted(cls, jti):
        query = cls.query.filter_by(jti = jti).first()
        return bool(query)
