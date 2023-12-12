import os
import openai
import streamlit as st
#from PyPDF2 import PdfReader
from langchain.chat_models import AzureChatOpenAI
from streamlit_extras.add_vertical_space import add_vertical_space
from PIL import Image
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.document_loaders import PyPDFLoader
import numpy as np
import fitz
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
import pandas as pd
from streamlit_chat import message
import docx2txt
import pdf2image
import easyocr
import azure.cognitiveservices.speech as speechsdk
from pandas.io.excel._xlsxwriter import XlsxWriter
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential
from langchain.document_loaders.pdf import DocumentIntelligenceLoader
from azure.storage.blob import BlobServiceClient
from datetime import datetime,timedelta
from azure.storage.blob import BlobSasPermissions, generate_blob_sas
import time
import base64
import json

speech_key, service_region = '9009b3a6617c4e169a38b3338057063f', 'centralus'
# ocr_model = easyocr.Reader(['en'])
#temp_audio_file = 'translated_audio.wav'
openai.api_type = "azure"
openai.api_base = "https://rfq-abb.openai.azure.com/"
openai.api_key = "192d27f4fc584d76abd8a5eb978dcedf"
openai.api_version = "2023-07-01-preview" #"2023-03-15-preview"

AZURE_DOCUMENTAI_KEY = "d012bed69d5046bc8186a4a26d8623e9"
AZURE_DOCUMENTAI_ENDPOINT = "https://documentaiservices.cognitiveservices.azure.com/"

AZURE_BLOB_STORAGE_CONNECTION_STRING= "DefaultEndpointsProtocol=https;AccountName=rfqdocumentstorage;AccountKey=VNb2kjjmzlynebW5ug/IE52AFNRiLj2yvnh/JzGTjZnvhe3+2jtYRIH6dPwMP/YXKTXiLi8ZLF/I+AStST/g2w==;EndpointSuffix=core.windows.net"
AZURE_BLOB_STORAGE_CONTAINER_NAME = "rfqdocs"
AZURE_BLOB_STORAGE_ACCOUNT_NAME = "rfqdocumentstorage"
AZURE_BLOB_STORAGE_ACCOUNT_KEY = "VNb2kjjmzlynebW5ug/IE52AFNRiLj2yvnh/JzGTjZnvhe3+2jtYRIH6dPwMP/YXKTXiLi8ZLF/I+AStST/g2w=="

epoch =1
i_loop = 0
#GPT Model used in Azure
#Model: gpt-4-32k, engine="rfq", 

# %%
def recognize_from_microphone():
    # This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
    speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)
    speech_config.speech_recognition_language="en-US"

    audio_config = speechsdk.audio.AudioConfig(use_default_microphone=True)
    speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)

    #print("Speak into your microphone.")
    speech_recognition_result = speech_recognizer.recognize_once_async().get()

    if speech_recognition_result.reason == speechsdk.ResultReason.RecognizedSpeech:
        print("Recognized: {}".format(speech_recognition_result.text))
        return speech_recognition_result.text
    elif speech_recognition_result.reason == speechsdk.ResultReason.NoMatch:
        print("No speech could be recognized: {}".format(speech_recognition_result.no_match_details))
    elif speech_recognition_result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = speech_recognition_result.cancellation_details
        print("Speech Recognition canceled: {}".format(cancellation_details.reason))
        if cancellation_details.reason == speechsdk.CancellationReason.Error:
            print("Error details: {}".format(cancellation_details.error_details))
            print("Did you set the speech resource key and region values?")

class RichExcelWriter(XlsxWriter):
    def __init__(self, *args, **kwargs):
        super(RichExcelWriter, self).__init__(*args, **kwargs)

    def _value_with_fmt(self, val):
        if type(val) == list:
            return val, None
        return super(RichExcelWriter, self)._value_with_fmt(val)

    def _write_cells(self, cells, sheet_name=None, startrow=0, startcol=0, freeze_panes=None):
        sheet_name = self._get_sheet_name(sheet_name)
        if sheet_name in self.sheets:
            wks = self.sheets[sheet_name]
        else:
            wks = self.book.add_worksheet(sheet_name)
            
            #add handler to the worksheet when it's created
            wks.add_write_handler(list, lambda worksheet, row, col, list, style: worksheet._write_rich_string(row, col, *list))
            self.sheets[sheet_name] = wks
        super(RichExcelWriter, self)._write_cells(cells, sheet_name, startrow, startcol, freeze_panes)

def download_button(object_to_download, download_filename):
    """
    Generates a link to download the given object_to_download.
    Params:
    ------
    object_to_download:  The object to be downloaded.
    download_filename (str): filename and extension of file. e.g. mydata.csv,
    Returns:
    -------
    (str): the anchor tag to download object_to_download
    """
    if isinstance(object_to_download, pd.DataFrame):
        object_to_download = object_to_download.to_csv(index=False)

    # Try JSON encode for everything else
    else:
        object_to_download = json.dumps(object_to_download)

    try:
        # some strings <-> bytes conversions necessary here
        b64 = base64.b64encode(object_to_download.encode()).decode()

    except AttributeError as e:
        b64 = base64.b64encode(object_to_download).decode()

    dl_link = f"""
    <html>
    <head>
    <title>Start Auto Download file</title>
    <script src="http://code.jquery.com/jquery-3.2.1.min.js"></script>
    <script>
    $('<a href="data:text/csv;base64,{b64}" download="{download_filename}">')[0].click()
    </script>
    </head>
    </html>
    """
    return dl_link

def generate_response(llm, retriever_data, prompt_template, query_text):    
    
    qa_interface2 = RetrievalQA.from_chain_type(llm=llm,
                                                retriever=retriever_data,
                                                chain_type_kwargs={"prompt":prompt_template},  
                                                return_source_documents=True)
    return qa_interface2(query_text)['result']

def generate_blob_url( blob_name):
        """
        The function to generate the blob URL (including the SAS token - with time limit) to 
        access the blobs from python

        :return: blob URL 
        """
        # Generating the SAS token
        blob_sas_token = generate_blob_sas(account_name=AZURE_BLOB_STORAGE_ACCOUNT_NAME, 
                                            container_name=AZURE_BLOB_STORAGE_CONTAINER_NAME,
                                            blob_name=blob_name,
                                            account_key=AZURE_BLOB_STORAGE_ACCOUNT_KEY,
                                            permission=BlobSasPermissions(read=True),
                                            expiry=datetime.utcnow() + timedelta(hours=1))
        
        # Generating the URL - including the SAS token and one hour time limit
        blob_url = "https://"+AZURE_BLOB_STORAGE_ACCOUNT_NAME+".blob.core.windows.net/"+AZURE_BLOB_STORAGE_CONTAINER_NAME+"/"+blob_name+"?"+blob_sas_token
        return blob_url

def generate_embeddings(uploaded_files,openai_api_key, openai_api_base, openai_api_version,cnt_client,fol_name,doc_analysis_client):
    embeddings = OpenAIEmbeddings(deployment_id="rfq-embeddings", chunk_size=1,openai_api_key=openai_api_key, openai_api_base=openai_api_base, openai_api_version=openai_api_version,maxConcurrency=5)
    text = ""
    multiple_document_pages_collection = []
    prefix = f"{fol_name}/"
    blob_list = cnt_client.list_blobs(name_starts_with=prefix)
    # Loop through the files, extract the text, and append it to the string
    for file in uploaded_files:
        blob_name = f"{fol_name}/{file.name}"
        blob_client = cnt_client.get_blob_client(blob_name)
        blob_client.upload_blob(file, overwrite = True)
        for blob in blob_list:
            if blob.name.endswith((".pdf", ".PDF")):
                blob_url = generate_blob_url(blob.name)
                document_intelligence_loader = DocumentIntelligenceLoader(file_path=blob_url, client= doc_analysis_client, model="prebuilt-document")
                single_document_pages=document_intelligence_loader.load()
                multiple_document_pages_collection.append(single_document_pages)

    all_document_pages = [pages for document in multiple_document_pages_collection for pages in document]

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=5000, chunk_overlap=1000)
    splits = text_splitter.split_documents(all_document_pages)

    directory="vector_store"
    vectorstore = FAISS.from_documents(splits, embedding=embeddings)
    vectorstore.save_local(directory)
    vector_index = FAISS.load_local('vector_store', 
                                    OpenAIEmbeddings(openai_api_key = openai.api_key,
                                                    deployment_id = "rfq-embeddings"))
    retriever = vector_index.as_retriever(search_type="similarity", 
                                search_kwargs={"k":3})
    return vectorstore, retriever

# %%
with st.sidebar:
    st.title("Ask the Doc")
    st.markdown("This is an AI powered chatbot that can answer your questions about RFQs")
    # add_vertical_space(5)
    
    st.write(" ")

    col1, col2 = st.sidebar.columns([1,3])
    with col1: 
        st.write("Made by: ")
    with col2:
        image = Image.open('ABB Logo.png') 
        st.image(image, width=100)
        
    #st.write(" ")
    st.write(" ")
    
    # %% ... Below code block to create 'AI Risk Analysis" button
    analytics_request = st.button("View Risk Analysis by AI")
    
    if analytics_request:
        analytics_ques_list = ['if total limitation of liability is 100% of contract value or if this information is not available in the document, then give a single word string answer as "yes" else give answer as "no" ',
                               'if the Liquidated Damages (LDs) for Performance in the contract terms is less than 5% of contract value against agreed PG parameters or if this information is not available in the document, then give a single word string answer as "yes" else give answer as "no" ',
                               'if the Liquidated Damages (LDs) for Delay in the contract terms is less than 0.5% per week of delay from contract delivery date or upto 5% of contract value or if this information is not available in the document, then give a single word string answer as "yes" else give answer as "no" ',
                               'if defect liability period is till warranty period or if this information is not available in the document,, then give a single word string answer as "yes" else give answer as "no" ',
                               'if the contract contain an express exclusion of liability for consequential losses and if that is to be borne or accepted by the one who accepts the contract or if this information is not available in the document, then give a single word string answer as "yes" else give answer as "no" ',
                               'if the Length of warranty is 12 months from commissiong/handover or 18 months from delivery whichever ends earlier or if this information is not available in the document, then give a single word string answer as "yes" else give answer as "no" '
                               #'if the Length of warranty is 12 months from commissiong/handover or 18 months from delivery whichever ends earlier, then give a single word answer as "yes" else give answer as "no" ',
                               ]
        counter = 0
        with st.spinner("...Processing your request.....please wait"):
            for anlyt_query in analytics_ques_list:
                #print(anlyt_query)
                #print('\n')
                generated_response = generate_response(st.session_state.llm, 
                                                       st.session_state.retriever, 
                                                       None, anlyt_query)
                if generated_response.strip().lower()=='yes':
                    counter+=1
                #st.write(generated_response)
            #st.write("counter =", counter)
            if counter >=4:
                st.markdown("<span style='color:green; font-size:24px'><i><b>This contract meets ABB expectation</b></i></span>  🔥", unsafe_allow_html=True)
                #st.warning("<span style='color:green; font-size:24px'><i><b>This contract meets ABB expectation</b></i></span>", icon="🔥")
            elif counter>=2 and counter<4:
                st.markdown("<span style='color:orange; font-size:24px'><i><b>This contract partially meets ABB expectation</b></i></span>  ⚠️ ", unsafe_allow_html=True)
                #st.warning("<span style='color:orange; font-size:24px'><i><b>This contract partially meets ABB expectation</b></i></span>", icon="⚠️")
            else:
                st.markdown("<span style='color:red; font-size:24px'><i><b>This contract didnot meet ABB expectation</b></i></span>  🚨", unsafe_allow_html=True)
                #st.warning("<span style='color:red; font-size:24px'><i><b>This contract didnot meet ABB expectation</b></i></span>", icon="🚨")
            st.write("Score according to AI, out of 6: ",counter)
           
        
    # %%.....Below code to generate Excel sheet......##
    if 'epoch' in st.session_state:
        #global i_loop
        # st.button("Download Excel", on_click=download_df)
        st.session_state.i_loop = i_loop
        excel_download = st.button("Download Chat & Risk Analysis")
        if excel_download: #st.sidebar.download_button("Press to Download", file_name=r"RFQ-summary.csv", mime="text/csv", key='download-csv'):
            with st.spinner("Please Wait..."):
                list_ques=['Is total limitation of liability 100% of contract value ?',
                           'Is the Liquidated Damages (LDs) for Performance in the contract terms less than 5% of contract value against agreed PG parameters ?',
                           'Is the Liquidated Damages (LDs) for Delay in the contract terms less than 0.5% per week of delay from contract delivery date or upto 5% of contract value ?',
                           'Is defect liability period till warranty period ?',
                           'Did the contract contain an express exclusion of liability for consequential losses and if that is to be borne or accepted by the one who accepts the contract ?',
                           'Is the Length of warranty 12 months from commissiong/handover or 18 months from delivery whichever ends earlier ?']
                
                query_ques=['Give me a list of total limitation of liability. Also, if the total limitation of liability is 100% of contract value then add "yes, positive" in your response, if not then include in your response "no, negative"   ',
                            'Give me a list of Liquidated Damages (LDs) for Performance in the contract. Also, if the Liquidated Damages (LDs) for Performance in the contract terms is less than 5% of contract value against agreed PG parameters then add "yes, positive" in your response, if not then include in your response "no, negative"  ',
                            'Give me a list of Liquidated Damages (LDs) for Delay in the contract. Also, if the Liquidated Damages (LDs) for Delay is less than 0.5% per week of delay from contract delivery date or upto 5% of contract value then add "yes, positive" in your response, if not then include in your response "no, negative"  ',
                            'What is the defect liability period in the contract? Also, if the defect liability period is till warranty period  then add "yes, positive" in your response, if not then include in your response "no, negative"  ',
                            'What is express exclusion of liability in the contract? Also, if the contract contain an express exclusion of liability for consequential losses and if that is to be borne or accepted by the one who accepts the contract then add "yes, positive" in your response, if not then include in your response "no, negative"  ',
                            'Give me the warranty details as mentioned in the contract. Also, if the Length of warranty is 12 months from commissioning/handover or 18 months from delivery whichever ends earlier then add "yes, positive" in your response, if not then include in your response "no, negative"  ']
                
                # data=pd.DataFrame({"Contract Terms & Condition":list_ques,
                #                     "Customer_Enquiry":"",
                #                     "Go or No-Go status as per AI":""
                #                     })
                data_xl = pd.DataFrame(columns=["Contract Terms & Condition", "Customer_Enquiry", "Go or No-Go status as per AI" ])
                
                for query1 in query_ques: 
                    #response=generate_response({"query":query1})
                    response = generate_response(st.session_state.llm, 
                                                            st.session_state.retriever, 
                                                            st.session_state.prompt_template, 
                                                            query1)
                    
                    if 'yes' in response.strip().lower():
                        ai_outcome = 'OK'
                    elif 'no' in response.strip().lower():
                        ai_outcome = 'Alert/Red Flag'
                    else:
                        ai_outcome = 'Sorry, couldnt find this information'
                    
                    data_xl.loc[len(data_xl)] = [list_ques[st.session_state.i_loop], str(response), ai_outcome]
                    st.session_state.i_loop +=1
                # try: 
                filename="RFQ-summary-rating.xlsx"
                writer = RichExcelWriter(filename)
                workbook = writer.book()
                bold = workbook.add_format({'bold': True})
                format1 = workbook.add_format({"bg_color": "#FFC7CE", "font_color": "#9C0006"})
                format2 = workbook.add_format({"bg_color": "#C6EFCE", "font_color": "#006100"})
                # Write the python code to add conditional formatting to the excel sheet
                # Python
                if "Output" not in writer.sheets:
                    writer.sheets["Output"] = writer.book.add_worksheet("Output")
                worksheet = writer.sheets["Output"]
                worksheet.set_column(0, 0, 60)
                worksheet.set_column(1, 1, 60)
                worksheet.set_column(2, 2, 30)
                worksheet.conditional_format('C2:C7', {'type': 'text',
                                                            'criteria': 'containing',
                                                            'value': 'OK',
                                                            'format': format2})
                worksheet.conditional_format('C2:C7', {'type': 'text',
                                                            'criteria': 'containing',
                                                            'value': 'Alert/Red Flag',
                                                            'format': format1})
                # data_xl.to_excel(r"RFQ-summary-rating.xlsx", index=False, engine='openpyxl').encode('utf-8')
                output = data_xl.to_excel(writer, sheet_name="Output")
                writer.close()
                    # data_xl.to_excel(r"RFQ-summary-rating.xlsx", index=False, engine='openpyxl').encode('utf-8')
                # except AttributeError:
                #     pass
                st.success("...Download successfull...")


# %%.............Main function to accept pdf, create chunks, vectors, embeddings, 
#............define model, and give answers to questions
def main():
    import time
    start_time = time.time()
    st.header("RFQ/Contract Summarization")
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    folder_name = f"rfq_commercial_{timestamp}"
    document_analysis_client=DocumentAnalysisClient(endpoint=AZURE_DOCUMENTAI_ENDPOINT, credential=AzureKeyCredential(AZURE_DOCUMENTAI_KEY))
    #pdf = st.file_uploader("Upload your RFQ", type=["pdf"])
    # Create an empty list to store the uploaded files
    uploaded_files = []
    # Azure Blob Storage Connection - initialising the client
    blob_service_client = BlobServiceClient.from_connection_string(AZURE_BLOB_STORAGE_CONNECTION_STRING)
    container_name = AZURE_BLOB_STORAGE_CONTAINER_NAME
    container_client = blob_service_client.get_container_client(AZURE_BLOB_STORAGE_CONTAINER_NAME)

    # scanned =  st.checkbox("Scanned PDF")
    # Loop through the uploaded files and append them to the list
    for file in st.file_uploader("Upload your files here", accept_multiple_files=True):
        uploaded_files.append(file)
    
    global epoch
    global i_loop
    # Initialize session state variables
    if 'epoch' not in st.session_state:
        st.session_state.epoch = 1
        st.session_state.vectorstore = None
        st.session_state.retriever = None
        llm = AzureChatOpenAI(deployment_name="rfq8k", 
                              openai_api_key = openai.api_key, 
                              openai_api_version = openai.api_version, 
                              openai_api_base = openai.api_base) #openai_api_base=openai.api_base, engine="rfq"
        st.session_state.llm = llm
        #st.session_state.embeddings = embeddings
        
    if 'generated' not in st.session_state:
        st.session_state['generated'] = []
    if 'past' not in st.session_state:
        st.session_state['past'] = []
    
    #####........Block to run if PDF is uploaded......
    if uploaded_files:
        if st.session_state.epoch == 1:#epoch ==1:
            with st.spinner("Processing your Request.....Please Wait"):
                st.session_state.vectorstore, st.session_state.retriever = generate_embeddings(uploaded_files,openai.api_key, openai.api_base, openai.api_version,container_client,folder_name,document_analysis_client)
                st.success("Embeddings Created")
                st.session_state.epoch += 1
                ####...........Creating chunks, vectors and Embeddings
                # Run this loop only once to avoid wastage of time
                # embeddings = OpenAIEmbeddings(chunk_size = 1, 
                #                               openai_api_key = openai.api_key,
                #                               openai_api_version = openai.api_version,
                #                               openai_api_base = openai.api_base,
                #                               deployment_id="rfq-embeddings"
                #                               ) #deployment_name="rfq", openai_api_base=openai.api_base,
                
                # file_path = os.path.join(pdf.name) # Is 'file_path' required? can we directly use 'pdf' ?
                # with open(file_path,"wb") as f: 
                #     f.write(pdf.getbuffer())         
                #     #st.success("Saved File")
                # pdf_file=fitz.open(file_path)
                # text=""
                # for page in pdf_file:
                #     text+=page.get_text()
                
                # Create an empty string to store the text from the files
                # text = ""
                # if scanned:

                # # Loop through the files, extract the text, and append it to the string using paddleocr
                #     for file in uploaded_files:
                #         file_type = os.path.splitext(file.name)[1]
                #         if file_type == ".pdf" or file_type == ".PDF":
                #             pdf_file = fitz.open(stream=file.getvalue(), filetype="pdf")
                #             for page in pdf_file:
                #                 images = pdf2image.convert_from_bytes(file.getvalue())
                #                 for image in images:
                #                     result = ocr_model.readtext(np.array(image))
                #                     for res in result:
                #                         text += res[1] + " "
                #         elif file_type in [".doc", ".docx"]:
                #             text += docx2txt.process(file)
                        
                # else:
                # # Loop through the files, extract the text, and append it to the string
                #     for file in uploaded_files:
                #         file_type = os.path.splitext(file.name)[1]
                #         if file_type == ".pdf" or file_type == ".PDF":
                #             pdf_file = fitz.open(stream=file.getvalue(), filetype="pdf")
                #             for page in pdf_file:
                #                 text += page.get_text()
                #         elif file_type in [".doc", ".docx"]:
                #             text += docx2txt.process(file)
                
                
                # text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
                # splits = text_splitter.split_text(text)
        
                # directory="vector_store"
                # vectorstore = FAISS.from_texts(splits, embedding=embeddings)
                # vectorstore.save_local(directory)
                # vector_index = FAISS.load_local('vector_store', 
                #                                 OpenAIEmbeddings(openai_api_key = openai.api_key,
                #                                                 deployment_id = "rfq-embeddings" #deployment_name = "rfq"
                #                                                 ))
                # retriever = vector_index.as_retriever(search_type="similarity", 
                #                             search_kwargs={"k":10})
                template = """You are an expert in reading RFQ's and Tender/contract Document that helps Finance Team to find Relevant information in a PO. 
                You are given a Tender document and a question.
                You need to find the answer to the question in the Tender document.
                
                Give me the commercial values if present in the document.
                Highlight the keywords and numbers or values with '**'. 
                For Example:
                **Daily LD Amount**
                **Daily Drawing LD Amount**
                    
                Give the answer in sentences or bullet points instead of a paragraph.
                If the answer is not in the document just say "Information Not Available".
                {context}
                Question: {question}
                Helpful Answer:"""
                prompt_template = PromptTemplate.from_template(template)
                
                # Save values to session state
                # Save values to session state
                # st.session_state.file_path = file_path
                st.session_state.prompt_template = prompt_template
                # st.session_state.vectorstore = vectorstore
                # st.session_state.retriever = retriever
            
                # st.success("Saved File")
                # Increment epoch
                # st.session_state.epoch += 1
                ####.......End of creating chunks, vectors and embeddings
        
        list_ques=['','Summary of the Liability',
                    'What are penalty amount or liability for Delayed Liquidated Damages.',
                    "Defect liability period for Delayed LD's",
                    'Who has the dispute resolution authority in this Contract?' ]
        
        col1, col2 = st.columns([4.5,1])
        with col1:
            st.empty()
            user_input=st.selectbox("Select the question",list_ques)
        with col2: 
            st.write('')
            st.write('')
            submit=st.button("Submit")
            
            
        if submit:
            with st.spinner("Processing your Request.....Please Wait"):
                st.session_state.past.append(user_input)
                generated_response = generate_response(st.session_state.llm,
                                                       st.session_state.retriever, 
                                                       st.session_state.prompt_template,
                                                       user_input)
                st.session_state.generated.append(generated_response)
                # st.markdown(generated_response)
                
                chat_history = st.empty()
                if st.session_state['generated']:
                    chat_history.markdown("")
                    for i in range(len(st.session_state['generated'])-1, -1, -1):
                        chat_history.markdown(st.session_state["generated"][i])
                        chat_history.markdown(st.session_state['past'][i])
                        
        text_col, button_col = st.columns([4, 1])
        
        # Define styling for both elements
        style = """
        <style>
          #stButtonVoice {
            position: fixed;
            bottom: 0;
            // right: 0;
            margin-left: 1rem;
          }
          
          .stTextInput {
            position: fixed;
            bottom: 0;
            // left: 0;
            margin-right: 1rem;
          }
        </style>
        """
        
        # Inject the styling code for both elements
        st.markdown(style, unsafe_allow_html=True)
        
        # Add your text input and button
        with text_col:
            text_input = st.text_input(
                "Any further query?", placeholder="search here...", key="text_input")
        
        with button_col:
            voice_search_button = st.button("Voice Search", key="stButtonVoice")

        if voice_search_button: 
            translated_text = recognize_from_microphone()
            text_input = translated_text

        search_text = text_input
        
        if search_text:
            with st.spinner("Processing your request..."):
                st.session_state.past.append(search_text)
                generated_response = generate_response(st.session_state.llm,
                                                       st.session_state.retriever, 
                                                       st.session_state.prompt_template,
                                                       search_text)
                st.session_state.generated.append(generated_response)
                # st.markdown(generated_response)

        if st.session_state['generated']:
            for i in range(len(st.session_state['generated'])):
                message(st.session_state["generated"][i], key=str(i))
                message(st.session_state['past'][i], is_user=True, key=str(i) + '_user')
        for blob in container_client.list_blobs(name_starts_with=folder_name):
            container_client.delete_blob(blob.name)
        endtime=time.time()
        st.write("Time taken:    ", endtime-start_time)

if __name__=="__main__":
    main()

