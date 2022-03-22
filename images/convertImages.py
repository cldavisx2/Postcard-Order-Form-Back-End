'''
    We want to generate thumbnails for all the images
    we will do this by going through every image in the images to convert folder
    and using PIL to resize then save them in the thumbnail folder
    we will also save the fullsize image in the fullsize folder, this seems 
    unnessesary but the file size is reduced somewhat by doing so which is nice

'''
from glob import glob
from PIL import Image

def convertImage(imageName):
    #open the image and get the size
    img = Image.open(f'images_to_convert/{imageName}')
    w,h = img.size

    #we want the thumbnail height to be 150px
    #so we need to calculate the width
    newHeight = 150
    newWidth = int((newHeight/h)*w)

    #now resize the image
    thumb = img.resize((newWidth,newHeight))

    #now save the img(s)
    thumb.save(f'thumbnails/{imageName}')
    img.save(f'fullsize/{imageName}')
    
    print(f'{imageName} saved')

#get a list of all the img names
#returns 'images_to_convert\\imgname', we dont want the first part, hence file[18:]
imgs = [file[18:] for file in glob("images_to_convert/*jpg")]

#go through all the images and convert them
for i in imgs:
    convertImage(i)

