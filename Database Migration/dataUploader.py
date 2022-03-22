'''
    All of the images and their associated tags are currently stored
    in an SQLite3 database, need to migrate this into MongoDB

    Target Format for each image: 
    {name:'name',tags:['tag1','tag2']}

    Mongo DB: Found_Image
    Collection: Images

'''
from pymongo import MongoClient
import certifi#prevents ssl verification error when connecting to Mongo
import sqlite3

def getImages():
    c.execute('''SELECT name From images''')
    #this returns a list of tuples
    fetched_imgs = c.fetchall()
    #make it into an array
    imgs = [x[0] for x in fetched_imgs]
    return imgs

def getTags(img):
    #returns all the tags for the given image
    c.execute('''SELECT tags FROM images WHERE name = ?''',(img,))
    tags_tuple = c.fetchall()
    #convert from a tuple
    if tags_tuple[0][0] == None:
        tags = []
    else:
        tags = tags_tuple[0][0].split(',')
    #make sure none of the tags are '', because some are, for some reason...
    if '' in tags:
        tags.remove('')
    return tags

def uploadImages(imgs):
    #uploads all the images along with their associated tags
    for i in imgs:
        dbimage = {'name':i,'tags':getTags(i)}
        collection.insert_one(dbimage)
        print(f'{i} has been uploaded')

#connecto to SQLite3 DB
db = sqlite3.connect("database")
c = db.cursor()

#connect to MongoDB
user = ''
password = ''
dbName = 'Found_Image'
collectionName = 'Images'
cluster = f'mongodb+srv://{user}:{password}@mycluster.4aivn.mongodb.net/{dbName}?retryWrites=true&w=majority'
client = MongoClient(cluster,tlsCAFile=certifi.where())
mongodb = client[dbName]
collection = mongodb[collectionName]

#get the images and upload them
imgs = getImages()
uploadImages(imgs)

print('Done!')
