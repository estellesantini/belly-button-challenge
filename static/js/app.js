// Read in samples.json from the url below
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and call bar chart function
d3.json(url).then(function(jsonData) {
  createDropdown(jsonData.names);
  createBarChart(jsonData, jsonData.names[0]);
  createBubbleChart(jsonData, jsonData.names[0]);
  createDemographicInfo(jsonData, jsonData.names[0]);
});

// Use D3 to select the dropdown menu
function createDropdown(names) {
    let dropdownMenu = d3.select("#selDataset");
    dropdownMenu.selectAll("option")
      .data(names)
      .enter()
      .append("option")
      .text(name => name)
      .attr("value", name => name);
}

// Use Plotly to generate bar chart
function createBarChart(data, subjectId) {
    // Find the sample data for test subject "subjectId"
    let testSubject = data.samples.find(sample => sample.id === subjectId);

    // Get the first 10 OTUs for plotting
    otuIdSlice = testSubject.otu_ids.slice(0, 10);
    otuLabelSlice = testSubject.otu_labels.slice(0, 10);
    sampleValueSlice = testSubject.sample_values.slice(0, 10);

    // Generate bar plot
    let trace = {
      x: sampleValueSlice.reverse(),
      y: otuIdSlice.map(otu => `OTU ${otu}`).reverse(),
      text: otuLabelSlice.reverse(),
      name: "OTU",
      type: "bar",
      orientation: "h"
    };
    Plotly.newPlot("bar", [trace], {});
}

// Use Plotly to generate bubble chart
function createBubbleChart(data, subjectId) {
    // Find the sample data for test subject "subjectId"
    let testSubject = data.samples.find(sample => sample.id === subjectId);

    // Get the subject data
    otuIds = testSubject.otu_ids;
    otuLabels = testSubject.otu_labels;
    sampleValues = testSubject.sample_values;

    // Generate bubble plot
    let trace = {
      x: otuIds.reverse(),
      y: sampleValues.reverse(),    
      text: otuLabels.reverse(),
      mode: 'markers',
      marker: {
        size: sampleValues.reverse(),
        color: otuIds.reverse()
      },
    };
    let layout = {
      xaxis: { title: "OTU IDs" },
      height:500,
      width:1000
    };
    Plotly.newPlot("bubble", [trace], layout);
}

function createDemographicInfo(data, subjectId) {
  // Find the sample data for test subject "subjectId"
  console.log('Samples', data.samples);
  console.log('Metadata', data.metadata);
  let subjectMetadata = data.metadata.find(metadata => metadata.id === subjectId);

  // Set up metadata content string 
  let metadataString = `
  id: ${subjectMetadata.id}
  ethnicity: ${subjectMetadata.ethnicity}
  gender: ${subjectMetadata.gender}
  age: ${subjectMetadata.age}
  location: ${subjectMetadata.location}
  bbtype: ${subjectMetadata.bbtype}
  wfreq: ${subjectMetadata.wfreq}
  `;

  // Get sample-metadata div and write text
  let metaDiv = document.getElementById("sample-metadata");
  metaDiv.textContent = metadataString;
}


// Call updatePlotly() when a change takes place to the DOM
function optionChanged(subjectId) {
    d3.json(url).then(function(data) {
        createBarChart(data, subjectId);
        createBubbleChart(data, subjectId);
        createDemographicInfo(data, subjectId);
    });
}