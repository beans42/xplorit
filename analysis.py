import pandas as pd
from sklearn.tree import DecisionTreeClassifier
music_data = pd.read_csv('music.csv')
X = music_data.drop(columns = ['score'])
y = music_data['score']

model = DecisionTreeClassifier()
model.fit(X,y)


#Prediction for someone who is 21 years old and has a BMI of 21
predictions = model.predict([[21, 21]])
predictions

print("according to your age and BMI, your fitness level is " + predictions + " According to the rest of the population")

predictions = str(predictions)
new_pred = predictions.replace("%", "")



if new_pred == "['90']":
    print('You are amazing, and super active!')

if new_pred == "['50']":
    print('nice score!, however you can do better!  Keep playing the game and improve ')
else:
    print('Keep practising to make your mark!')

#Note:  "We are using this machine learning model to predict the performance of individuals with certain age and BMI."
        # using this data, we can encourage people to do better as they can compare their stats to other people with similar
            # body types
        # In this example, we are finding the BMI of an individual that is 21 years olf with a BMI of 21