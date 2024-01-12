 # Define the list of risk analysis questions
analytics_ques_list = ['Give me a list of total limitation of liability. Also, if the total limitation of liability or aggregrate of liability is not exceeding "100%" of contract value (or purchase order price or MUSD 10) then add "yes, positive" in your response, if not then include in your response "no, negative"   ',
                    'Is total limitation of liability with carveouts/exceptions or with complaints?. Also, if the total limitation of liability is with carve outs then add "yes, positive" in your response, if not then include in your response "no, negative"  ', 
                    'Give me a list of Liquidated Damages (LDs) for Performance in the contract. Also, if the Liquidated Damages (LDs) for Performance in the contract terms is less than (or shall not exceed) "5%" of contract value (or purchase order value) against agreed PG parameters then add "yes, positive" in your response, if not then include in your response "no, negative"  ',
                    'Give me a list of Liquidated Damages (LDs) for Delay in the contract. Also, if the Liquidated Damages (LDs) for Delay is less than 0.5% per week of delay from contract delivery date or if the Liquidated Damages (LDs) for Delay is less than (or shall not exceed) "5%" of contract value then add "yes, positive" in your response, if not then include in your response "no, negative"  ',
                    'What is express exclusion of liability in the contract? Also, if the contract contain an express exclusion of liability for consequential losses and if that is to be borne or accepted by the one who accepts the contract then add "yes, positive" in your response, if not then include in your response "no, negative"  ',
                    'Is Force Majeure clause mentioned in the contract and acceptable? Also, if Force Majeure is not acceptable in the contract then add "yes, positive" in your response, if not then include in your response "no, negative"  ',
                    'Give me the warranty details as mentioned in the contract. Also, if the Length of warranty is 12 months from commissioning/handover or 18 months from delivery whichever ends earlier then add "yes, positive" in your response, if not then include in your response "no, negative"  ',
                    'Give me the list of customer rights for suspension and termination (along with mentioned clauses). Also, if the termination clause is satisfactory as to profit coverage to the company then add "yes, positive" in your response, if not then include in your response "no, negative"  ',
                    'Has ABB has the right to suspend for customers breach? Also, if ABBs termination right for customers breach (e.g. non payment) is included in the document then add "yes, positive" in your response, if not then include in your response "no, negative"  ',
                    'Is there a clause entitling the customer to terminate for convenience? Also, if the clause entitling the customer to terminate for convenience is satisfactory as to profit coverage to ABB then add "yes, positive" in your response, if not then include in your response "no, negative"  ',
                    'Is there Warranty start latest clause in the document? Also, if Repair/replacement is customers exclusive remedy then add "yes, positive" in your response, if not then include in your response "no, negative"  ',
                    'Does the replaced/repaired part carry an evergreen warranty (unlimited in time)? If yes then add "yes, positive" in your response, if not then include in your response "no, negative"  ',
                    'Is ABB entitled to cost compensation for delays caused by customer? If yes then add "yes, positive" in your response, if not then include in your response "no, negative"   ',
                    'Is ABB entitled to time extension for delays caused by customer? If yes then add "yes, positive" in your response, if not then include in your response "no, negative"   ',
                    'Give me the advance payment and retention terms as mentioned in the contract. Also, if the advance payment is "10%" or more than "10%" of the full contract value then add "yes, positive" in your response, if not then include in your response "no, negative"  ',
                    'What are the payment terms and Price Format (Price/Full Cost Model & Cash Flow Payment Terms)? Also, if the price format is lumpsum/fixed price or unit rate or both then add "yes, positive" in your response, if not then include in your response "no, negative"  '
                    ]

download_ques_list = ['Is total limitation of liability "100%" of contract value ?',
                    'Is total limitation of liability with carve outs / exceptions?', 
                    'Is the Liquidated Damages (LDs) for Performance in the contract terms less than "5%" of contract value against agreed PG parameters ?',
                    'Is the Liquidated Damages (LDs) for Delay in the contract terms less than "0.5%" per week of delay from contract delivery date or upto "5%" of contract value ?', 
                    'Did the contract contain an express exclusion of liability for consequential losses and if that is to be borne or accepted by the one who accepts the contract ?', 
                    'Is Force Majeure clause mentioned in the contract and acceptable?',
                    'Is the Length of warranty 12 months from commissiong/handover or 18 months from delivery whichever ends earlier ?', 
                    'Has the Customer the right to suspend for ABBs breach? Is there a clause entitling the customer to terminate for convenience?',
                    'Has ABB the right to suspend for customers breach?',
                    'Is there a clause entitling the customer to terminate for convenience?',
                    'Is there Warranty start latest clause in the document? Is Repair/replacement customers exclusive remedy?',
                    'Does the replaced/repaired part carry an evergreen warranty (unlimited in time)?',
                    'Is ABB entitled to cost compensation for delays caused by customer?',
                    'Is ABB entitled to time extension for delays caused by customer?',
                    'Any Advance payment and retention?',
                    'What are the payment terms and Price Format?'
                    ]
                