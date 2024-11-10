<template>
    <v-container>
      <v-row>
        <v-col cols="6">
          <v-textarea v-model="originalText" label="Original Text" outlined rows="10"></v-textarea>
        </v-col>
        <v-col cols="6">
          <v-textarea v-model="modifiedText" label="Modified Text" outlined rows="10"></v-textarea>
        </v-col>
      </v-row>
      <v-btn @click="compareText" color="primary">Compare</v-btn>
      <v-row v-if="diffResult">
        <v-col cols="12">
          <v-card>
            <v-card-title>Differences</v-card-title>
            <v-card-text v-html="diffResult"></v-card-text>
            <v-btn @click="exportJSON" color="primary">Export as JSON</v-btn>
            <v-btn @click="exportCSV" color="primary">Export as CSV</v-btn>
            <v-btn @click="exportXML" color="primary">Export as XML</v-btn>
            <v-btn @click="exportPDF" color="primary">Export as PDF</v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import * as Diff from 'diff';
  import { jsPDF } from "jspdf";
  
  export default {
    data() {
      return {
        originalText: '',
        modifiedText: '',
        diffResult: null,
        diffData: null // Store the diff data in a structured format
      };
    },
    methods: {
      compareText() {
        const diff = Diff.diffChars(this.originalText, this.modifiedText);
        this.diffResult = this.formatDiff(diff);
        this.diffData = diff; // Store the raw diff for export
      },
      formatDiff(diff) {
        return diff
          .map((part) => {
            let className = 'text-body-1'; // Default text color for unchanged text
            
            if (part.added) {
              className = 'text-green'; // Green for added text
            } else if (part.removed) {
              className = 'text-red'; // Red for removed text
            }
  
            return `<span class="${className}">${part.value}</span>`;
          })
          .join('');
      },
      exportJSON() {
        const blob = new Blob([JSON.stringify(this.diffData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'diff_result.json';
        a.click();
      },
      exportCSV() {
        const csv = this.diffData
          .map((part) => {
            return `${part.added ? 'Added' : part.removed ? 'Removed' : 'Unchanged'},${part.value.replace(/[\r\n]+/g, ' ')}`;
          })
          .join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'diff_result.csv';
        a.click();
      },
      exportXML() {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<diffResult>\n';
        this.diffData.forEach((part) => {
          xml += `<diff type="${part.added ? 'added' : part.removed ? 'removed' : 'unchanged'}">${part.value}</diff>\n`;
        });
        xml += '</diffResult>';
        
        const blob = new Blob([xml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'diff_result.xml';
        a.click();
      },
      exportPDF() {
        const doc = new jsPDF();
        doc.setFont("helvetica", "normal");
        doc.text("Differences", 10, 10);
        
        this.diffData.forEach((part, index) => {
          const color = part.added ? 'green' : part.removed ? 'red' : 'black';
          doc.setTextColor(color === 'green' ? 0 : color === 'red' ? 255 : 0);
          doc.text(part.value.replace(/[\r\n]+/g, ' '), 10, 20 + (index * 10)); // Adjust position based on index
        });
  
        doc.save('diff_result.pdf');
      }
    }
  };
  </script>
  
  