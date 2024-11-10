<template>
  <v-container>
    <!-- JSON Beautifier and Converters -->
    <v-row>
      <v-col cols="12" sm="5">
        <v-textarea
          v-model="rawJson"
          label="Input JSON"
          rows="30"
        ></v-textarea>
      </v-col>
      
      <v-col cols="12" sm="2" class="d-flex justify-center align-center flex-column">
        <v-btn
          @click="beautifyJSON(rawJson)"
          :disabled="!rawJson"
          color="primary"
          variant="outlined"
          elevation="2"
          class="my-2"
        >
          Beautify JSON
        </v-btn>
        
        <v-btn
          @click="convertJSONtoXML(rawJson)"
          :disabled="!rawJson"
          color="secondary"
          variant="outlined"
          elevation="2"
          class="my-2"
        >
          Convert to XML
        </v-btn>
        
        <v-btn
          @click="convertJSONtoCSV(rawJson)"
          :disabled="!rawJson"
          color="success"
          variant="outlined"
          elevation="2"
        >
          Convert to CSV
        </v-btn>
        <v-btn
          @click="downloadOutput"
          :disabled="!output"
          color="primary"
          variant="elevated"
          elevation="2"
        >
          Download Output
        </v-btn>
      </v-col>
      
      <v-col cols="12" sm="5">
        <v-textarea
          v-model="output"
          label="Output"
          rows="30"
          readonly
        ></v-textarea>
      </v-col>
    </v-row>

    <!-- Download Options -->
    <!-- <v-row class="my-4 justify-center">
      <v-col cols="12" md="4">
        <v-btn
          @click="downloadOutput"
          :disabled="!output"
          color="primary"
          variant="elevated"
          elevation="2"
        >
          Download Output
        </v-btn>
      </v-col>
    </v-row> -->
  </v-container>
</template>

<script>
import json2xml from 'json2xml';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

export default {
  data() {
    return {
      rawJson: '',
      output: '',
      currentFormat: 'json', // Track current format (json, xml, csv)
    };
  },
  methods: {
    beautifyJSON(json) {
      try {
        this.output = JSON.stringify(JSON.parse(json), null, 2);
        this.currentFormat = 'json';
      } catch (error) {
        this.output = 'Invalid JSON';
      }
    },
    convertJSONtoXML(json) {
      try {
        const jsonObject = JSON.parse(json);
        this.output = json2xml(jsonObject);
        this.currentFormat = 'xml';
      } catch (error) {
        this.output = 'Invalid JSON';
      }
    },
    convertJSONtoCSV(json) {
      try {
        const jsonObject = JSON.parse(json);
        this.output = Papa.unparse(jsonObject);
        this.currentFormat = 'csv';
      } catch (error) {
        this.output = 'Invalid JSON';
      }
    },
    downloadOutput() {
      let fileType, fileName;
      switch (this.currentFormat) {
        case 'json':
          fileType = 'application/json';
          fileName = 'formatted.json';
          break;
        case 'xml':
          fileType = 'application/xml';
          fileName = 'formatted.xml';
          break;
        case 'csv':
          fileType = 'text/csv';
          fileName = 'data.csv';
          break;
        default:
          return;
      }
      const blob = new Blob([this.output], { type: fileType });
      saveAs(blob, fileName);
    },
  },
};
</script>

<style scoped>
.v-btn {
  margin-top: 10px;
}
</style>
