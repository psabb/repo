# Import the required libraries
import os
import openai
import streamlit as st
from dotenv import load_dotenv
from langchain.chat_models import AzureChatOpenAI
from langchain.embeddings import OpenAIEmbeddings
load_dotenv()
import docx2txt
import pdf2image
from langchain.document_loaders import PyPDFLoader
# Set up the OpenAI API key and type
openai.api_type = "azure"
openai.api_base = "https://rfq-abb.openai.azure.com/"
openai.api_key = "192d27f4fc584d76abd8a5eb978dcedf"
openai.api_version = "2023-03-15-preview"

# Create an instance of AzureChatOpenAI and OpenAIEmbeddings
llm = AzureChatOpenAI(deployment_name="rfq", openai_api_key=openai.api_key, openai_api_base=openai.api_base, openai_api_version=openai.api_version)
embeddings = OpenAIEmbeddings(deployment_id="rfq-embeddings", chunk_size=1,openai_api_key=openai.api_key, openai_api_base=openai.api_base, openai_api_version=openai.api_version)

# Import the LangChain modules
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA

# Define a function to check the file type
def check_file_type(file_name):
    try:
        with open(file_name, 'rb') as f:
            header = f.read(4)
            if header == b'%PDF':
                return 'pdf'
            elif header  ==  b'PK\x03\x04' or header == b'PK\x03\x04\x14\x00\x06\x00':
                return 'docx'
            else :
                return 'unknown'
    # If the file cannot be opened, return 'error' as the file type
    except IOError:
        return 'error'

# Define a function to extract text from a file
def extract_text(file_name):
    detected_text_new = ''
    if check_file_type(file_name) == 'pdf':
        pdf_file = open(file_name, 'rb')
        pdf_reader = PyPDFLoader(pdf_file)
        for page in pdf_reader.pages:
            detected_text_new += page.extract_text()
    elif check_file_type(file_name) == 'docx':
        detected_text_new = docx2txt.process(file_name)
    elif check_file_type(file_name) == 'unknown':
        detected_text_new = 'unknown'
    else:
        detected_text_new = 'error'
    return detected_text_new

# Define a function to create a vector index from a text document
def create_vector_index(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    texts = text_splitter.create_documents([text])
    directory = 'Vector_Embeddings'
    vector_index_scada = FAISS.from_documents(texts, embedding=embeddings) 
    vector_index_scada.save_local(directory)
    vector_index = FAISS.load_local(directory, 
                                    OpenAIEmbeddings(openai_api_key = openai.api_key,
                                                    deployment_id = "rfq-embeddings"))
    return vector_index

# Define a function to create a question answering interface from a vector index
def create_qa_interface(vector_index):
    retriever = vector_index.as_retriever(search_type="similarity", 
                                          search_kwargs={"k":10})
    qa_interface = RetrievalQA.from_chain_type(llm=llm,
                                               chain_type="stuff", 
                                               retriever=retriever, 
                                               return_source_documents=True)
    return qa_interface

# Define the title and sidebar of the app
st.title("Ask the Doc")
st.sidebar.title("Upload a document")
file = st.sidebar.file_uploader("Choose a file", type=["pdf", "docx"])

# If a file is uploaded, process it and create a question answering interface
if file is not None:
    # Extract the text from the file
    text = extract_text(file.name)
    # Create a vector index from the text
    vector_index = create_vector_index(text)
    # Create a question answering interface from the vector index
    qa_interface = create_qa_interface(vector_index)
    # Display the file name and ask the user to enter a query
    st.write(f"You have uploaded {file.name}.")
    query = st.text_input("Enter your query:")
    # If a query is entered, get the answer from the question answering interface
    if query:
        response = qa_interface(query)
        # Display the answer and the source document
        st.write(f"Answer: {response['result']}")
