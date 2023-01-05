
(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
       var event_cols = [{
            id: "eventid",
            dataType: tableau.dataTypeEnum.string
            //numberFormat: tableau.numberFormatEnum.number
        }, {
            id: "description",
            alias: "description",
            dataType: tableau.dataTypeEnum.string
        },  {
            id: "isactive",
            alias: "isactive",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "eventtype",
            alias: "eventtype",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "contenttype",
            alias: "contenttype",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "createtimestamp",
            alias: "createtimestamp",
            dataType: tableau.dataTypeEnum.string
        },
         {
            id: "livestart",
            alias: "livestart",
            dataType: tableau.dataTypeEnum.string
        },
         {
            id: "liveend",
            alias: "liveend",
            dataType: tableau.dataTypeEnum.string
        }];


        var event_table = {
            id: "Event",
            alias: "Event",
            columns: event_cols
        };
        var attendee_cols = [{
            id: "eventid",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "email",
            alias: "email",
            dataType: tableau.dataTypeEnum.string
        },  {
            id: "userstatus",
            alias: "userstatus",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "engagementscore",
            alias: "engagementscore",
            dataType: tableau.dataTypeEnum.float
        },
        {
            id: "liveminutes",
            alias: "liveminutes",
            dataType: tableau.dataTypeEnum.float
        },
        {
            id: "askedquestions",
            alias: "askedquestions",
            dataType: tableau.dataTypeEnum.float
        },
        {
            id: "answeredpolls",
            alias: "answeredpolls",
            dataType: tableau.dataTypeEnum.float
        },
        {
            id: "answeredsurveys",
            alias: "answeredsurveys",
            dataType: tableau.dataTypeEnum.float
        }
        ];

        var attendee_table = {
            id: "Attendee",
            alias: "Attendee",
            columns: attendee_cols
        };

        var registrant_cols = [{
            id: "eventid",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "firstname",
            alias: "firstname",
            dataType: tableau.dataTypeEnum.string
        },  {
            id: "lastname",
            alias: "lastname",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "email",
            alias: "email",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "company",
            alias: "company",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "zip",
            dataType: tableau.dataTypeEnum.int
        }
        ,
        {
            id: "city",
            dataType: tableau.dataTypeEnum.string
        }
        ,
        {
            id: "state",
            dataType: tableau.dataTypeEnum.string
        }
        ,
        {
            id: "country",
            dataType: tableau.dataTypeEnum.string
        }];

        var registrant_table = {
            id: "Registrant",
            alias: "Registrant",
            columns: registrant_cols
        };

        var survey_cols = [{
            id: "eventid",
            dataType: tableau.dataTypeEnum.string
            
        }, {
            id: "surveyid",
            alias: "surveyid",
            dataType: tableau.dataTypeEnum.string
        },  {
            id: "surveycode",
            alias: "surveycode",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "question",
            alias: "question",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "responses",
            alias: "responses",
            dataType: tableau.dataTypeEnum.int
        },
        {
            id: "choice1",
            alias: "choice1",
            dataType: tableau.dataTypeEnum.float
        },
         {
            id: "choice2",
            alias: "choice2",
            dataType: tableau.dataTypeEnum.float
        },
         {
            id: "choice3",
            alias: "choice3",
            dataType: tableau.dataTypeEnum.float
        },
        {
            id: "choice4",
            alias: "choice4",
            dataType: tableau.dataTypeEnum.float
        },
         {
            id: "choice5",
            alias: "choice5",
            dataType: tableau.dataTypeEnum.float
        }];


        var survey_table = {
            id: "Survey",
            alias: "Survey",
            columns: survey_cols
        };


        schemaCallback([event_table, attendee_table, registrant_table, survey_table]);
        
    };


    eventIDs = [];
    var counter = 1;
    // Download the data
    myConnector.getData = function(table, doneCallback) {

     console.log('Table is : '+table.tableInfo.id);
            
            const attendee_URL = 'https://cors-for-wdc.herokuapp.com/https://api.on24.com/v2/client/49268/attendee?startDate=2023-01-05';
            const registrant_URL = 'https://cors-for-wdc.herokuapp.com/https://api.on24.com/v2/client/49268/registrant?startDate=2023-01-05';
             const event_URL = 'https://cors-for-wdc.herokuapp.com/https://api.on24.com/v2/client/49268/event?startDate=2023-01-05';
             const survey_URL = 'https://cors-for-wdc.herokuapp.com/https://api.on24.com/v2/client/49268/event';
           
           //console.log('Access Token: '+tableau.username);

function customizer(objValue, srcValue) {
    if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
    }
}

function sleeper(ms) {
    return function(x) {
      return new Promise(resolve => setTimeout(() => resolve(x), ms));
    };
  }

async function ExecuteRequest(url, data) {

    // As this is a recursive function, we need to be able to pass it the prevous data. Here we either used the passed in data, or we create a new objet to hold our data.
    data = data || {};
   

    await axios.get(url, {
        headers: {
                  'accessTokenKey': tableau.username,
                'accessTokenSecret': tableau.password
        
                }
    }).then(sleeper(1000)).then(response => {

        // We merge the returned data with the existing data
        _.mergeWith(data, response.data, customizer);
       
        // We check if there is more paginated data to be obtained
        if ((url.search('survey')==-1) && response.data.currentpage <response.data.pagecount-1) {
            let page = response.data.currentpage+1;
       
        
        if(url.search('attendee')!=-1) {
            useURL = attendee_URL;

        }
        if (url.search('event')!=-1) {
                useURL = event_URL;
            }

            if (url.search('registrant')!=-1) {
                useURL = registrant_URL;
            }
        
            let newurl = useURL+'&pageoffset='+page;
           // console.log('Recursive request: '+newurl);
          
            return ExecuteRequest(newurl, data);
        }
        if((url.search('survey')!=-1)){
            //for (var i = 1, len = eventIDs.length; i < len; i++)
            while(counter<eventIDs.length){
                let newurl = survey_URL+'/'+eventIDs[counter]+'/survey';
                counter++;
                return ExecuteRequest(newurl, data);
            }
        }

    });

    return data;
}



if(table.tableInfo.id === 'Attendee') {

const attendee_promise = ExecuteRequest("https://cors-for-wdc.herokuapp.com/https://api.on24.com/v2/client/49268/attendee?startDate=2023-01-05").then(data => {
    
    if (table.tableInfo.id == "Attendee") {
                var feat = data;
               
                        tableData = [];
                     
                    // Iterate over the JSON object
                    for (var i = 0, len = feat.attendees.length; i < len; i++) {
                        tableData.push({
                                "eventid": feat.attendees[i].eventid,
                                "email": feat.attendees[i].email,
                                "userstatus": feat.attendees[i].userstatus,
                                "engagementscore": feat.attendees[i].engagementscore,
                                "liveminutes": feat.attendees[i].liveminutes, 
                                "askedquestions": feat.attendees[i].askedquestions,
                                "answeredpolls": feat.attendees[i].answeredpolls,
                                "answeredsurveys": feat.attendees[i].answeredsurveys
                        });
                    }
    
                    //table.appendRows(tableData);
                    chunkData(table, tableData);
                    doneCallback();
                }
});
}

if(table.tableInfo.id === 'Registrant') {

    const attendee_promise = ExecuteRequest("https://cors-for-wdc.herokuapp.com/https://api.on24.com/v2/client/49268/registrant?startDate=2023-01-05").then(data => {
        
        if (table.tableInfo.id == "Registrant") {
                    var feat = data;
                   
                            tableData = [];
                         
                        // Iterate over the JSON object
                        for (var i = 0, len = feat.registrants.length; i < len; i++) {
                            tableData.push({
                                "eventid": feat.registrants[i].eventid,
                                "firstname": feat.registrants[i].firstname,
                                "lastname": feat.registrants[i].lastname,
                                "email": feat.registrants[i].email,
                                "company": feat.registrants[i].company,
                                "zip": feat.registrants[i].zip,
                                "city": feat.registrants[i].city,
                                "state": feat.registrants[i].state,
                                "country": feat.registrants[i].country
                            });
                        }
        
                        //table.appendRows(tableData);
                        chunkData(table, tableData);
                        doneCallback();
                    }
    });
    }




if(table.tableInfo.id === 'Event') {

  const event_promise = ExecuteRequest("https://cors-for-wdc.herokuapp.com/https://api.on24.com/v2/client/49268/event?startDate=2023-01-05").then(data => {
  
    if (table.tableInfo.id == "Event") {
                var feat = data;
                //console.log('Event ID: '+feat.events[0].eventid);
                //console.log('Response: '+feat.events[0].livestart);
                //console.log('Feat: '+ new Date(feat.events[0].livestart));

                        tableData = [];
                        //var feat2 = JSON.parse(data);
                    // Iterate over the JSON object
                    for (var i = 0, len = feat.events.length; i < len; i++) {
                        eventIDs[i]=feat.events[i].eventid;
                    tableData.push({
                        "eventid": feat.events[i].eventid,
                        "description": feat.events[i].description,
                        "isactive": feat.events[i].isactive,
                        "eventtype": feat.events[i].eventtype,
                        "contenttype": feat.events[i].contenttype,
                        "createtimestamp": new Date(feat.events[i].createtimestamp),
                        "livestart": new Date(feat.events[i].livestart),
                        "liveend": new Date(feat.events[i].liveend)
                        
                    });
                }
    
                    //table.appendRows(tableData);
                    chunkData(table, tableData);
                    doneCallback();
                }
});
}

if(table.tableInfo.id === 'Survey') {
    console.log('first event: '+eventIDs[0]);

    const survey_promise = ExecuteRequest("https://cors-for-wdc.herokuapp.com/https://api.on24.com/v2/client/49268/event/"+eventIDs[0]+"/survey").then(data => {
    
      if (table.tableInfo.id == "Survey") {
                  var feat = data;
                
                     tableData = [];
                        
                      // Iterate over the JSON object

                      for(j=0;j<feat.surveys.length;j++){
                      for (var i = 0, len = feat.surveys[j].surveyquestions.length; i < len-1; i++) {
                          if(feat.surveys[j].surveyquestions[i].responses>0){
                      tableData.push({
                          "eventid": feat.surveys[j].surveyid.substr(0,7),
                          "surveyid": feat.surveys[j].surveyid,
                          "surveycode": feat.surveys[j].surveycode,
                          "question": feat.surveys[j].surveyquestions[i].question,
                          "responses": feat.surveys[j].surveyquestions[i].responses,
                          "choice1": feat.surveys[j].surveyquestions[i].surveyanswer[0].percentage || '',
                          "choice2": feat.surveys[j].surveyquestions[i].surveyanswer[1].percentage || '',
                          "choice3": feat.surveys[j].surveyquestions[i].surveyanswer[2].percentage || '',
                          "choice4": feat.surveys[j].surveyquestions[i].surveyanswer[3].percentage || '',
                          "choice5": feat.surveys[j].surveyquestions[i].surveyanswer[4].percentage || ''
                      });
                    }
                  }
                }
      
                      //table.appendRows(tableData);
                      chunkData(table, tableData);
                      doneCallback(); 
                  }
  });
  }



    };

    function chunkData(table, tableData){
        console.log('Table : '+table.tableInfo.id+ ' Length :'+tableData.length);
        var row_index = 0;
        var size = 100;
        while (row_index < tableData.length){
             table.appendRows(tableData.slice(row_index, size + row_index));
             row_index += size;
             console.log('In row: '+ row_index)
           // tableau.reportProgress("Getting row: " + row_index);
         }
     }

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            var accessTokenKey = $('#accessTokenKey').val().trim();
            tableau.username = accessTokenKey;
            var accessTokenSecret = $('#accessTokenSecret').val().trim();
            tableau.password = accessTokenSecret;
            tableau.connectionName = "ON24WebDataConn"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
