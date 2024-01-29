from flask import Flask, render_template, request, jsonify, send_file
from langchain.chat_models import AzureChatOpenAI
from langchain.vectorstores import FAISS
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.chains import RetrievalQA
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.prompts import PromptTemplate
import fitz
import os
from datetime import datetime   
import openai
import docx2txt
from flask_cors import CORS
import pandas as pd
import json
import re
from flask import jsonify
from tp.templates import main_system_template,cabinet_template,arch_template,scope_template,bom_template,io_template,new_template,template,com_template
from tp.commercial_questions import analytics_ques_list, download_ques_list
import googletrans as GT
from langdetect import detect
import textract
import tempfile
import glob
from pandas.io.excel._xlsxwriter import XlsxWriter
from azure.core.credentials import AzureKeyCredential
from azure.ai.formrecognizer import DocumentAnalysisClient
# from azure.ai.documentintelligence import DocumentIntelligenceClient


app = Flask(__name__)
CORS(app)

openai.api_type = "azure"
openai.api_base = "https://rfq-abb.openai.azure.com/"
openai.api_key = "192d27f4fc584d76abd8a5eb978dcedf"
openai.api_version = "2023-07-01-preview"

docai_endpoint = "https://docai-trained-bhanu.cognitiveservices.azure.com/"
docai_key = "6943fe9ad42e478a8841ae77c1b8d12e"
document_analysis_client = DocumentAnalysisClient(
                    endpoint=docai_endpoint, credential=AzureKeyCredential(docai_key)
                )

epoch =1
i_loop = 0

# Initialize necessary variables here (e.g., llm, retriever, prompt_template)
llm = AzureChatOpenAI(deployment_name="rfq", openai_api_key=openai.api_key, openai_api_version=openai.api_version, openai_api_base=openai.api_base)
embeddings = OpenAIEmbeddings(
    chunk_size=1,
    openai_api_key=openai.api_key,
    openai_api_version=openai.api_version,
    openai_api_base=openai.api_base,
    deployment_id="rfq-embeddings"
)

# Set up vector store
splits = ["example text"]  # You should replace this with your actual text data
vector_store = FAISS.from_texts(splits, embedding=embeddings)

# Set up retriever
retriever = FAISS.load_local('vector_store', embeddings).as_retriever(search_type="similarity", search_kwargs={"k": 10})

# Set up prompt template
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

# Save variables to app context
app.config['llm'] = llm
app.config['prompt_template'] = prompt_template
app.config['vectorstore'] = vector_store
app.config['retriever'] = retriever
app.config['epoch'] = 1

def process_file(file_path):
    try:
        # Your existing logic for processing the file
        embeddings = OpenAIEmbeddings(
            chunk_size=1,
            openai_api_key=openai.api_key,
            openai_api_version=openai.api_version,
            openai_api_base=openai.api_base,
            deployment_id="rfq-embeddings"
        )
        
        # Create an empty string to store the text from the file
        text = ""
        
# Check file extension to determine the file type
        file_extension = os.path.splitext(file_path)[1].lower()
        print("111")
        if file_extension == '.pdf':
            print("2222")
            with open(file_path, "rb") as fd:
                pdf_data = fd.read()
                print("3333")
                poller = document_analysis_client.begin_analyze_document(
                    "prebuilt-layout", pdf_data)
                print("4444")
                result = poller.result()
                text += result.content
                print(text)


        elif file_extension == '.docx':
            print("666")
            with open(file_path, "rb") as fd:
                print("777")
                pdf_data = fd.read()
                print("888")
                poller = document_analysis_client.begin_analyze_document(
                    "prebuilt-read", pdf_data)
                print("999")
                result = poller.result()
                text += result.content
                print(text)
        
        # elif file_extension == '.doc':
        #     # Convert .doc to .docx
        #     docx_file_path = file_path.replace(".doc", ".docx")
        #     word = Document(file_path)
        #     word.save(docx_file_path)
        #     print(f"Document converted to {docx_file_path}")

        #     # Analyze the converted .docx file
        #     with open(docx_file_path, "rb") as fd:
        #         print("santhu")
        #         pdf_data = fd.read()
        #         print("nikit")
        #         poller = document_analysis_client.begin_analyze_document(
        #             "prebuilt-layout", pdf_data)
        #         print("999")
        #         result = poller.result()
        #         text = result.content
        #         print(text)

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        splits = text_splitter.split_text(text)

        directory = "vector_store"
        vectorstore = FAISS.from_texts(splits, embedding=embeddings)
        vectorstore.save_local(directory)
        vector_index = FAISS.load_local('vector_store',
                                        OpenAIEmbeddings(openai_api_key=openai.api_key,
                                                        deployment_id="rfq-embeddings"))
        retriever = vector_index.as_retriever(search_type="similarity", search_kwargs={"k": 10})

        
        prompt_template = PromptTemplate.from_template(template)

        # Save values to app context
        app.config['prompt_template'] = prompt_template
        app.config['vectorstore'] = vectorstore
        app.config['retriever'] = retriever

        # Increment epoch
        app.config['epoch'] += 1

        return {'success': True, 'message': 'File processed successfully'}

    except Exception as e:
        return {'success': False, 'message': f'Error processing file: {str(e)}'}


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    # Ensure the "uploads" directory exists
    uploads_dir = os.path.join(os.getcwd(), 'uploads')
    os.makedirs(uploads_dir, exist_ok=True)

    # Save the file with an absolute path
    file_path = os.path.join(uploads_dir, file.filename)
    file.save(file_path)

    # Process the file
    process_file(file_path)

    return jsonify({'success': 'File uploaded successfully', 'file_path': file_path})

@app.route('/process', methods=['POST'])
def process():
    return jsonify({'success': 'Processing triggered'})

@app.route('/files', methods=['GET'])
def get_files():
    # Replace 'uploads' with the directory where you store the uploaded files
    uploads_dir = os.path.join(os.getcwd(), 'uploads')

    # List all files in the 'uploads' directory
    files = os.listdir(uploads_dir)

    # You can customize the response format based on your needs
    return jsonify({'files': files})


def generate_response(llm, retriever_data, prompt_template, query_text):

    qa_interface2 = RetrievalQA.from_chain_type(llm=llm,
                                                retriever=retriever_data,
                                                chain_type_kwargs={"prompt":prompt_template},  
                                                return_source_documents=True)
    return qa_interface2(query_text)['result']

@app.route('/risk_analysis', methods=['GET'])
def risk_analysis():
    try:
        # Retrieve the necessary data from the app context
        llm = app.config['llm']
        retriever = app.config['retriever']
        prompt_template = app.config['prompt_template']

        
        new_prompt_template = PromptTemplate.from_template(com_template)

        counter = 0
        total_counter = 0
        results = []

        for user_friendly_question, download_friendly_question in zip(analytics_ques_list, download_ques_list):
            generated_response = generate_response(llm, retriever, new_prompt_template, user_friendly_question)
            if 'yes, positive' in generated_response.strip().lower():
                ai_outcome = 'OK'
                counter += 1
                total_counter += 1                    
            elif 'no, negative' in generated_response.strip().lower():
                ai_outcome = 'Not OK'
                total_counter += 1                    
            else:
                ai_outcome = 'Sorry, couldn\'t find this information'   

            results.append({'Contract Terms & Condition': download_friendly_question, 'Customer_Enquiry': generated_response.strip().lower(),'Go or No-Go status as per AI': ai_outcome})

        percentage_ok = (counter / total_counter) * 100 if total_counter > 0 else 0 
        percentage_ok = round(percentage_ok, 2)

        score_message = ""

        # Determine the score message based on the percentage
        if percentage_ok < 60:
            score_message = "This contract does not meet ABB expectation 🚨"
        elif 60 <= percentage_ok < 80:
            score_message = "This contract partially meets ABB expectation ⚠️"
        else:
            score_message = "This contract meets ABB expectation 🔥"

        return jsonify({'success': True, 'results': results, 'score': counter, 'total_counter': total_counter, 'percentage_ok': percentage_ok, 'score_message': score_message})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error during risk analysis: {str(e)}'})

@app.route('/process_input', methods=['POST'])
def process_input():
    try:
        # Retrieve necessary data from the app context
        llm = app.config['llm']
        retriever = app.config['retriever']
        prompt_template = app.config['prompt_template']

        # Extract user input from the request payload
        user_input = request.json['user_input']

        # Generate response using OpenAI and other data
        generated_response = generate_response(llm, retriever, prompt_template, user_input)
        
        print(generated_response)
        return jsonify({'success': True, 'generated_response': generated_response})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error processing input: {str(e)}'})  


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
            wks.set_column(0, 0, 40)
            wks.set_column(1, 5, 70)
            # Add handler to the worksheet when it's created
            wks.add_write_handler(list, lambda worksheet, row, col, list, style: worksheet._write_rich_string(row, col, *list))
            self.sheets[sheet_name] = wks
        super(RichExcelWriter, self)._write_cells(cells, sheet_name, startrow, startcol, freeze_panes)        

def create_excel_with_formatting_local(df, filename, sheet_name):
    """
    The create_excel_with_formatting function takes a DataFrame, filename, and sheet_name as input.
    It then creates an Excel file with the specified name and adds a worksheet to it with the specified name.
    The function then applies bold formatting to any text in the DataFrame that is surrounded by HTML <b></b> tags.
    
    :param df: Pass in the dataframe that will be converted to excel
    :param filename: Name the excel file that will be created
    :param sheet_name: Name the sheet in the excel file
    :return: A pandas excelwriter object
    """

    writer = RichExcelWriter(filename)

    workbook = writer.book
    bold = workbook.add_format({'text_wrap': True})
    format1 = workbook.add_format({"bg_color": "#FFC7CE", "font_color": "#9C0006"})

    # Added Below code for excel wrapping
    if sheet_name not in writer.sheets:
        writer.sheets["Output"] = writer.book.add_worksheet("Output")
        worksheet = writer.sheets["Output"]

        worksheet.set_column(0, 0, 40, bold)
        worksheet.set_column(1, 5, 70, bold)

        header_format = workbook.add_format(
            {
                "bold": True,
                "text_wrap": True,
                "valign": "top",
                "fg_color": "#ADD8E6",
                "border": 1,
                "align": "center",  # Center alignment added
            }
        )
        
         # Function to convert HTML bold tags to Excel bold formatting
    def convert_html_tags(text):
        if isinstance(text, float):
            return ' '
        if '<b>' not in text:
            return text
        parts = re.split(r'(<b>|</b>)', text)
        formatted_parts = [bold if part == '<b>' else part for part in parts if part != '</b>']
        return formatted_parts

    # Apply the function to each cell in the DataFrame
    for col in df.columns:
        df[col] = df[col].apply(convert_html_tags)


    
        try:
            output = df.to_excel(writer, sheet_name="Output", startrow=1, header=False, index=False)

            for col_num, value in enumerate(df.columns.values):
                worksheet.write(0, col_num , value, header_format)

            writer.close()
        except AttributeError:
            pass

        return output




@app.route('/generate_excel', methods=['GET'])
def generate_excel():
    try:
        print("\n\n hello world \n\n")
        # Retrieve necessary data from the app context
        llm_tech = app.config['llm']
        retriever_tech = app.config['retriever']
        vectorstore = app.config['vectorstore']

        f = open("keywords.json")
        data = json.load(f)
        arch_keywords = data['Keywords']['Architecture']
        system_keywords = data['Keywords']['System']
        bom = data['Keywords']['BOM']
        not_bom = data['Keywords']['Not_BOM']
        main_sys = data['Keywords']['Main_System']


        # Generate responses for each template
        main_system_prompt = PromptTemplate.from_template(main_system_template,partial_variables={"keywords":main_sys})
        input_query = "What are the main systems in the RFQ?"
        main_systems = generate_response(llm_tech, retriever_tech, main_system_prompt, input_query)
        main_systems = main_systems.split(',')
        df = pd.DataFrame({"Systems": main_systems, "Scope": "", "Architecture": "", "BOM": "", "Cabinet": "", "IO": ""})


        cabinet_prompt = PromptTemplate.from_template(cabinet_template)
        for system in df['Systems'].to_list():
            input_query = f"What are the specifications for making a cabinet of {system.strip()}?"
            cabinet_response = generate_response(llm_tech, retriever_tech, cabinet_prompt, input_query)
            df.loc[df['Systems'] == system, ['Cabinet']] = cabinet_response


        arch_prompt = PromptTemplate.from_template(arch_template, partial_variables={"keywords": arch_keywords})
        input_query = f"Give the system architecture which includes following elements {system_keywords} and it is not mandatory to have all the elements in the architecture. "
        arch_response = generate_response(llm_tech, retriever_tech, arch_prompt, input_query)
        df.loc[df['Systems'] == main_systems[0], ['Architecture']] = arch_response

        scope_prompt = PromptTemplate.from_template(scope_template)
        for system in main_systems:
            input_query = f"Summarize the scope for {system.strip()} in just one or two lines."
            scope_response = generate_response(llm_tech, retriever_tech, scope_prompt, input_query)
            df.loc[df['Systems'] == system, ['Scope']] = scope_response

        bom_prompt = PromptTemplate.from_template(bom_template, partial_variables={"bom": bom})
        for system in main_systems:
            input_query = f"Give the Bill of Materials (BOM) in {system.strip()}."
            bom_response = generate_response(llm_tech, retriever_tech, bom_prompt, input_query)
            df.loc[df['Systems'] == system, ['BOM']] = bom_response

        io_prompt = PromptTemplate.from_template(io_template)
        for system in main_systems:
            input_query = f"I/O Specification for {system.strip()}."
            io_response = generate_response(llm_tech, retriever_tech, io_prompt, input_query)
            df.loc[df['Systems'] == system, ['IO']] = io_response

        # Create the full path for the Excel file
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        excel_filename = os.path.join(os.path.expanduser("~"), "Downloads", f"Technical_Report_{timestamp}.xlsx")
        df.to_excel(excel_filename, index=False)

        # Apply formatting to the generated Excel file
        create_excel_with_formatting_local(df, excel_filename, sheet_name='Output')

        return jsonify({'success': True, 'message': f'file generated successfully'})

    except Exception as e:
        return jsonify({'success': False, 'message': f'Error generating Excel file: {str(e)}'})

@app.route('/generate_legal_excel', methods=['GET'])
def download_legal():
    try:
       
        llm = app.config['llm']
        retriever = app.config['retriever']
        
        with open('prompt.json', 'r') as file:
            data = json.load(file)

        topic = [item['topic'] for item in data['legal']]
        query_ques = [item['instruction'] for item in data['legal']]
      
        data_xl = pd.DataFrame(columns=["Topic", "query", "output"])

        new_template = """You are an expert in reading RFQ's and Tender/contract Document that helps Finance Team to find Relevant information. 
        {context}
        Question: {question}
        Helpful Answer:
        """
        new_prompt_template = PromptTemplate.from_template(new_template)
      
        i = 0
        for query1 in query_ques:
            response = generate_response(llm, retriever, new_prompt_template, query1)
            data_xl.loc[len(data_xl)] = [topic[i], query1, str(response)]
            i += 1
        
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        excel_filename = os.path.join(os.path.expanduser("~"), "Downloads", f"Legal_Report_{timestamp}.xlsx")
        data_xl.to_excel(excel_filename, index=False)

        create_excel_with_formatting_local(data_xl, excel_filename, sheet_name='Sheet1')

        return jsonify({'success': True, 'message': f'File "{excel_filename}" generated successfully'})

    except Exception as e:
        return jsonify({'success': False, 'message': f'Error generating Excel file: {str(e)}'})

            
if __name__ == '__main__':
    app.run(debug=True)