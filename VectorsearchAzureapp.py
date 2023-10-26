# Import modules and libraries
from streamlit_lottie import st_lottie
from PIL import Image
from langchain.text_splitter import CharacterTextSplitter
from langchain.document_loaders import PyPDFLoader
from azure.search.documents.indexes.models import(
    SearchIndex,
    SearchFieldDataType,
    SimpleField,
    SearchField,
    SearchableField,
    VectorSearch,
    HnswVectorSearchAlgorithmConfiguration,
    HnswParameters,
    VectorSearchProfile)
from azure.search.documents.models import RawVectorQuery
from azure.search.documents.indexes import SearchIndexClient
from azure.search.documents import SearchClient
from azure.core.credentials import AzureKeyCredential
import streamlit as st
import openai
import os
import uuid
from dotenv import load_dotenv
load_dotenv()
st.lottie = st_lottie

# Set up openai and azure credentials and parameters
deployment_name = os.getenv("EMBEDDING_DEPLOYMENT_NAME")
openai.api_type = "azure"
openai.api_key = os.getenv("AZURE_OPENAI_API_KEY")
openai.api_base = os.getenv("AZURE_OPENAI_ENDPOINT")
openai.api_version = os.getenv("AZURE_OPENAI_API_VERSION")
AZURE_SEARCH_ENDPOINT = os.getenv("AZURE_SEARCH_ENDPOINT")
AZURE_SEARCH_KEY = os.getenv("AZURE_SEARCH_KEY")

image = Image.open('Images\logo.png')
st.sidebar.image(image, width=200)

# generate embeddings


def generate_embeddings(text):
    response = openai.Embedding.create(
        input=text, engine=deployment_name)
    embeddings = response['data'][0]['embedding']
    return embeddings

# upload documents to an Azure search index


def create_and_upload_documents(pdf_file):

    vector_search = VectorSearch(
        algorithms=[
            HnswVectorSearchAlgorithmConfiguration(
                name="myHnsw",
                kind="hnsw",
                parameters=HnswParameters(m=4, ef_construction=400, ef_search=500, metric="cosine",)), ],
        profiles=[
            VectorSearchProfile(
                name="myHnswProfile",
                algorithm="myHnsw",), ],)

    index_client = SearchIndexClient(
        AZURE_SEARCH_ENDPOINT, AzureKeyCredential(AZURE_SEARCH_KEY))

    # Create an index name based on the pdf file name
    index_name = "vector-search-" + pdf_file.name.split(".")[0]

    fields = [
        SimpleField(name="documentId", type=SearchFieldDataType.String,
                    filterable=True, sortable=True, key=True),
        SearchableField(name="content", type=SearchFieldDataType.String),
        SearchField(name="embedding", type=SearchFieldDataType.Collection(SearchFieldDataType.Single), searchable=True, vector_search_dimensions=1536, vector_search_profile="myHnswProfile")]

    # Create an index object with the name, fields, and vector search parameters
    index = SearchIndex(
        name=index_name,
        fields=fields,
        vector_search=vector_search)

    # Delete any existing index with the same name (optional)
    try:
        index_client.delete_index(index_name)
    except:
        pass

    # Create a new index with the index object
    result = index_client.create_index(index)

    search_client = SearchClient(endpoint=AZURE_SEARCH_ENDPOINT,
                                 index_name=index_name, credential=AzureKeyCredential(AZURE_SEARCH_KEY))

    loader = PyPDFLoader("data/"+pdf_file.name)
    pages = loader.load_and_split()
    documents = loader.load()
    text_splitter = CharacterTextSplitter(chunk_size=2000, chunk_overlap=200)
    docs = text_splitter.split_documents(documents)

    docs_list = []
    for doc in docs:
        docs_list.append({'documentId': str(uuid.uuid4()), "content": doc.page_content,
                          "embedding": generate_embeddings(doc.page_content)})

    result = search_client.upload_documents(docs_list)

    return index_name, search_client

# perform vector queries on the Azure search index


def vector_query(search_client, query):

    vector = generate_embeddings(query)

    vector_query = RawVectorQuery(vector=vector, k=3, fields="embedding")

    results = search_client.search(
        search_text=None,
        vector_queries=[vector_query],
        select=["content"])

    input_text = " "
    for result in results:
        input_text = input_text + result['content'] + " "

    return input_text

# generate chat responses


def chat_response(input_text, query):

    response = openai.ChatCompletion.create(engine="rfq", messages=[
        {"role": "system", "content": f"Answer the question based on given relevant context. Input Context:{input_text}"},
        {"role": "user", "content": query}], max_tokens=200)

    chat_response = response['choices'][0]['message']['content']

    return chat_response


# allow the user to upload a PDF file from the sidebar
pdf_file = st.sidebar.file_uploader("Upload your RFQ here", type=["pdf"])

# save the file in data folder
if pdf_file is not None:
    with open(os.path.join("data", pdf_file.name), "wb") as f:
        f.write(pdf_file.getbuffer())

# headings on the main page
st.markdown("# RFQ Chatbot :books:")

if pdf_file is not None:

    with st.spinner("Processing PDF file..."):

        index_name, search_client = create_and_upload_documents(pdf_file)

        st.write(f"Index name: {index_name}")

    query = st.text_input("Enter your query:")

    # Check if the user has entered a query
    if query:
        with st.spinner("Generating chat response..."):

            input_text = vector_query(search_client, query)

            chat_response = chat_response(input_text, query)

            # Use streamit to display the chat response
            st.write(f"Chat response: {chat_response}")
            st.balloons()

# Animation
else:
    st.lottie("https://assets5.lottiefiles.com/packages/lf20_V9t630.json",
              width=200, height=200, key="initial")
