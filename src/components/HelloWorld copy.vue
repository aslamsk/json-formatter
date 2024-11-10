<template>
  <v-container>
    <!-- JSON Beautifier -->
     <v-row>
      <v-col cols="12" sm="5">
        <v-textarea
          v-model="rawJson"
          label="Input JSON"
          rows="15"
        ></v-textarea>
      </v-col>
      <v-col cols="12" sm="2" class="d-flex justify-center">
        <div>
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
          @click="formattedXml = convertJSONtoXML(rawJson)"
          :disabled="!rawJson"
          color="secondary"
          variant="outlined"
          elevation="2"
          class="my-2"
        >
          Convert JSON to XML
        </v-btn>
        </div>
        
      </v-col>
      <v-col cols="12" sm="5">
        <v-textarea
          v-model="formattedJson"
          label="Formatted JSON"
          rows="10"
          readonly
        ></v-textarea>
      </v-col>
     </v-row>


    <!-- JSON to XML -->
    <!-- <v-row>
      <v-col cols="12">
        
      </v-col>
    </v-row> -->
    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="formattedXml"
          label="Converted XML"
          rows="10"
          readonly
        ></v-textarea>
      </v-col>
    </v-row>

    <!-- JSON to CSV -->
    <v-row>
      <v-col cols="12">
        <v-btn
          @click="formattedCsv = convertJSONtoCSV(rawJson)"
          :disabled="!rawJson"
          color="success"
          variant="outlined"
          elevation="2"
          class="my-2"
        >
          Convert JSON to CSV
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="formattedCsv"
          label="Converted CSV"
          rows="10"
          readonly
        ></v-textarea>
      </v-col>
    </v-row>

    <!-- Download options -->
    <v-row class="my-4">
      <v-col cols="12" md="4">
        <v-btn
          @click="saveFile(formattedJson, 'formatted.json', 'application/json')"
          :disabled="!formattedJson"
          color="primary"
          variant="elevated"
          elevation="2"
        >
          Download JSON
        </v-btn>
      </v-col>
      <v-col cols="12" md="4">
        <v-btn
          @click="saveFile(formattedXml, 'formatted.xml', 'application/xml')"
          :disabled="!formattedXml"
          color="secondary"
          variant="elevated"
          elevation="2"
        >
          Download XML
        </v-btn>
      </v-col>
      <v-col cols="12" md="4">
        <v-btn
          @click="saveFile(formattedCsv, 'data.csv', 'text/csv')"
          :disabled="!formattedCsv"
          color="success"
          variant="elevated"
          elevation="2"
        >
          Download CSV
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import json2xml from 'json2xml';
import Papa from 'papaparse'; // For CSV conversion
import { saveAs } from 'file-saver';

export default {
  data() {
    return {
      rawJson: '',
      formattedJson: '',
      formattedXml: '',
      formattedCsv: '',
    };
  },
  methods: {
    beautifyJSON(json) {
      try {
        return this.formattedJson =  JSON.stringify(JSON.parse(json), null, 2); // Beautifies JSON
      } catch (error) {
        return 'Invalid JSON';
      }
    },
    convertJSONtoXML(json) {
      try {
        const jsonObject = JSON.parse(json);
        return json2xml(jsonObject); // Convert JSON to XML
      } catch (error) {
        return 'Invalid JSON';
      }
    },
    convertJSONtoCSV(json) {
      try {
        const jsonObject = JSON.parse(json);
        return Papa.unparse(jsonObject); // Convert JSON to CSV
      } catch (error) {
        return 'Invalid JSON';
      }
    },
    saveFile(content, fileName, type) {
      const blob = new Blob([content], { type });
      saveAs(blob, fileName); // Trigger file download
    },
  },
};
</script>

<style scoped>
.v-btn {
  margin-top: 10px;
}
</style>
