export interface Question {
  id: string;
  label: string;
}

export type OptionsMap = {
  option1: Question[];
  option2: Question[];
  option3: Question[];
  option4: Question[];
  option5: Question[];
};

const optionsMap: OptionsMap = {
  option1: [
    {
      id: "1",
      label: "Give the Summary of Liabilities and consequential losses?",
    },
    {
      id: "2",
      label: "What are the payment terms/conditions and Price Formats?",
    },
    {
      id: "25",
      label: "Give the summary of the document",
    },
    {
      id: "26",
      label: "List the ABB products in the document",
    },
    {
      id: "27",
      label:
        "Briefly summarize the installation procedures (if any) in the document",
    },
    {
      id: "28",
      label:
        "If product catalog show the detailed specifications/configuration of the product",
    },
    {
      id: "29",
      label:
        "If product catalog list the applications and benefits of the product",
    },
    {
      id: "30",
      label: "List the standards/clauses mentioned in the document",
    },
    {
      id: "31",
      label:
        "Summarize payment terms, agreement conditions, limitations/liabilities etc.",
    },
    {
      id: "32",
      label: "What are the Governing laws, claims, and dispute mechanisms?",
    },
  ],
  option2: [
    {
      id: "3",
      label: "What are the suspension and termination rights and clauses?",
    },
    {
      id: "4",
      label:
        "What are the Liquidated Damages (LDs) for Performance and Delays?",
    },
    {
      id: "5",
      label: "Give the Summary of liabilities and consequential losses",
    },
    {
      id: "6",
      label: "What are the payment terms & conditions and Price Formats?",
    },
    {
      id: "7",
      label: "What are the suspension and termination rights and clauses?",
    },
    {
      id: "8",
      label:
        "What are the Liquidated Damages (LDs) for Performance and Delays?",
    },
    {
      id: "9",
      label:
        "What are penalty amounts or liability for Delayed Liquidated Damages?",
    },
    {
      id: "10",
      label: "List the Guarantees/warranty terms and clauses",
    },
    {
      id: "11",
      label: "What are the Governing laws, claims, and dispute mechanisms?",
    },
    {
      id: "12",
      label: "Who has the dispute resolution authority in this Contract?",
    },
  ],
  option3: [
    {
      id: "13",
      label:
        "Which systems among DCS, SIS, FGS, ICSS etc. are in the document?",
    },
    {
      id: "14",
      label: "What is the scope of work for all the identified systems?",
    },
    {
      id: "15",
      label:
        "Briefly summarize system architecture along with standards, support systems etc.",
    },
    {
      id: "16",
      label: "What are the redundancies in the architecture and/or design?",
    },
    {
      id: "17",
      label: "List the hardware and/or software design requirements",
    },
    {
      id: "18",
      label: "List the Bill of materials (BOM) for all the identified systems",
    },
    {
      id: "19",
      label: "Give the technical specs and standards for making DCS cabinets",
    },
    {
      id: "20",
      label: "Give the technical specs and standards for making SIS cabinets",
    },
    {
      id: "21",
      label: "Give the technical specs and standards for making FGS cabinets",
    },
    {
      id: "22",
      label: "Give the technical specs and standards for making ICSS cabinets",
    },
    {
      id: "23",
      label:
        "Give configuration/specs, info & quantities for Input modules (analog & digital)",
    },
    {
      id: "24",
      label:
        "Give configuration/specs, info & quantities for Output modules (analog & digital)",
    },
  ],
  option4: [
    {
      id: "33",
      label: "Give the dates for start, end, and extension of the project",
    },
    {
      id: "34",
      label: "Give the Summary of liabilities and consequential losses",
    },
    {
      id: "35",
      label: "What are the payment terms & conditions and Price Formats?",
    },
    {
      id: "36",
      label:
        "List the money retention, advance payment & insurance conditions?",
    },
    {
      id: "37",
      label: "What are the suspension and termination rights and clauses?",
    },
    {
      id: "38",
      label:
        "What are the Liquidated Damages (LDs) for Performance and Delays?",
    },
    {
      id: "39",
      label:
        "What are penalty amounts or liability for Delayed Liquidated Damages?",
    },
    {
      id: "40",
      label: "List the Guarantees/warranty terms and clauses",
    },
    {
      id: "41",
      label: "What are the Governing laws, claims, and dispute mechanisms?",
    },
    {
      id: "42",
      label:
        "List notice provisions, performance security & local country requirements",
    },
  ],
  option5: [
    {
      id: "1",
      label: "Give the Summary of Liabilities and consequential losses?",
    },
    {
      id: "2",
      label: "What are the payment terms/conditions and Price Formats?",
    },
    {
      id: "25",
      label: "Give the summary of the document",
    },
    {
      id: "26",
      label: "List the ABB products in the document",
    },
    {
      id: "27",
      label:
        "Briefly summarize the installation procedures (if any) in the document",
    },
    {
      id: "28",
      label:
        "If product catalog show the detailed specifications/configuration of the product",
    },
    {
      id: "29",
      label:
        "If product catalog list the applications and benefits of the product",
    },
    {
      id: "30",
      label: "List the standards/clauses mentioned in the document",
    },
    {
      id: "31",
      label:
        "Summarize payment terms, agreement conditions, limitations/liabilities etc.",
    },
    {
      id: "32",
      label: "What are the Governing laws, claims, and dispute mechanisms?",
    },
  ],
};

export default optionsMap;
