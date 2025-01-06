import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.multioutput import MultiOutputRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
import joblib

# Step 1: Load the Data
# Load the dataset
df = pd.read_csv('extracted_text.csv')
print(df.head())

# Prepare the labels
# Assuming the scores are stored in columns 'E_score', 'S_score', 'G_score', and 'Total_score'
labels = df[['E_score', 'S_score', 'G_score', 'Total_score']].values
texts = df['content'].values

# Split the data into training and validation sets
train_texts, val_texts, train_labels, val_labels = train_test_split(texts, labels, test_size=0.2, random_state=42)

# Step 2: Load GloVe Embeddings
# Download GloVe embeddings (e.g., glove.6B.50d.txt) from https://nlp.stanford.edu/projects/glove/
# Place the file in the same directory as this script

def load_glove_embeddings(glove_path):
    embeddings_index = {}
    with open(glove_path, encoding='utf-8') as f:
        for line in f:
            values = line.split()
            word = values[0]
            coefs = np.asarray(values[1:], dtype='float32')
            embeddings_index[word] = coefs
    return embeddings_index

glove_path = 'glove.6B.50d.txt'  # Update this path if necessary
embeddings_index = load_glove_embeddings(glove_path)
embedding_dim = 50  # Dimension of GloVe embeddings (e.g., 50 for glove.6B.50d.txt)

# Step 3: Convert Text to GloVe Vectors
def document_to_vector(doc, embeddings_index, embedding_dim):
    words = doc.split()
    vector = np.zeros((embedding_dim,))
    count = 0
    for word in words:
        if word in embeddings_index:
            vector += embeddings_index[word]
            count += 1
    if count > 0:
        vector /= count  # Average the embeddings
    return vector

# Convert all documents to GloVe vectors
X_train_glove = np.array([document_to_vector(doc, embeddings_index, embedding_dim) for doc in train_texts])
X_val_glove = np.array([document_to_vector(doc, embeddings_index, embedding_dim) for doc in val_texts])

# Step 4: Train a Random Forest Regressor
# Use MultiOutputRegressor to predict all 4 scores simultaneously
model = MultiOutputRegressor(RandomForestRegressor(n_estimators=100, random_state=42))
model.fit(X_train_glove, train_labels)

# Step 5: Evaluate the Model
val_preds = model.predict(X_val_glove)

# Calculate MAE and MSE for each score
for i, score in enumerate(['E_score', 'S_score', 'G_score', 'Total_score']):
    mae = mean_absolute_error(val_labels[:, i], val_preds[:, i])
    mse = mean_squared_error(val_labels[:, i], val_preds[:, i])
    print(f"{score} - MAE: {mae}, MSE: {mse}")

# Step 6: Save the Model and GloVe Embeddings
# Save the trained model
joblib.dump(model, 'esg_regressor_glove.pkl')

# Save the GloVe embeddings (optional, for reuse)
np.save('glove_embeddings.npy', embeddings_index)

# Step 7: Inference on New Text
def predict_esg_scores(new_text, model, embeddings_index, embedding_dim):
    # Convert the new text to a GloVe vector
    new_text_vector = document_to_vector(new_text, embeddings_index, embedding_dim).reshape(1, -1)
    # Predict the scores
    predicted_scores = model.predict(new_text_vector)
    return predicted_scores

# Example: Predict scores for a new ESG report
new_text = "This is a new ESG report discussing environmental sustainability and social responsibility."
predicted_scores = predict_esg_scores(new_text, model, embeddings_index, embedding_dim)
print("Predicted Scores (E, S, G, Total):", predicted_scores)