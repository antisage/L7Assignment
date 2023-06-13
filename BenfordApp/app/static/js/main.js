const app = new Vue({
  el: '#app',
  delimiters: ['[[', ']]'],

  data: {

    highchart: null,
    chartOptions: chartOptions,


    benfordData: [30.1,17.6,12.5,9.7,7.9,6.7,5.8,5.1,4.6],
    testData: [0,0,0,0,0,0,0,0,0],

    inputFileMenu: [],
    inputFileChoice: '',

    csvPreviewFile: {},
    csvPreviewFilename: '',
    csvPreviewHeaders: [],
    csvPreviewData: [],

    csvFile: {},
    csvFilename: '',
    csvFilesize: 0,
    csvHeaders: [],
    csvData: [],

    dataIsLoaded: false,
    tabulator: null,
    tabulatorColumns: [],
    tabulatorData: [],
    selectedField: '',
    selectedFieldName: '',

    chisqrOutput: 0,
    inputFilename: '', 
  },

  watch: {
    tabulatorColumns:{
      handler: function (newData) {
        this.tabulator.setColumns(newData);
      }
    },

    tabulatorData:{
      handler: function (newData) {
        this.tabulator.replaceData(newData);
      }
    },

    inputFilename: function(){
      if( this.inputFilename == '' ) {
        console.log('inputFilename is null');
        this.clearCsvPreview();
      }
    }

  },

  methods: {
    downloadTable: function() {
      if(this.dataIsLoaded ){
        this.tabulator.download("csv", this.csvFilename)
      }
    },
    setinputFileChoice: function(event) {
      this.inputFileChoice = event.target.value;
    },

    selectField: function(header) {
      let colDefs = this.tabulator.getColumnDefinitions();
      let colElems = document.getElementsByClassName('tabulator-col');
      for( def of colDefs ){
      	if ( def.title == header ) {
          for ( var colElem of colElems ) {
          	if ( colElem.getAttribute('tabulator-field') == def.field){
              this.selectedFieldName = def.field;

              if( this.selectedField.length != '' ) {
                this.selectedField.classList.toggle('tabulator-title-selected');
              }
              this.selectedField = colElem.firstChild;
              this.selectedField.classList.toggle('tabulator-title-selected');
              this.okToClearField =true;
            	break;
            }
          }
        }
      }
    },

    genResult: function () {
      if( this.selectedFieldName != '' ) {
        let colDefs = this.tabulator.getColumnDefinitions();
        let tabledata = this.tabulator.getData()
        let coldata = [];
        for( let i of colDefs){
          if(i.field == this.selectedFieldName ) {
          	for( let x of tabledata ) {
              coldata.push( x[i.field] );
            }
            break;
          }
        }
        axios.post('/getBenfordAnalysis', { params: coldata} )
        .then( (res) => {
          this.testData = res.data.dist;
          let chartPoints = res.data.dist;
          this.chisqrOutput = res.data.chisqr;
          this.chartOptions.series[1].data = chartPoints;
          this.highchart = Highcharts.chart('container', this.chartOptions);

          this.$nextTick( function(){
            $("#result").modal();
          })
        });
      }
    },

    loadPreview: function(event){
      this.csvPreviewFile = event.target.files[0];
      this.csvPreviewFilename = this.csvPreviewFile.name;

      let self = this;
      Papa.parse( this.csvPreviewFile, {
        preview: 10,
        encoding: "utf8",
        complete: function(results) {
          self.csvPreviewHeaders = results.data[0];
          results.data.shift()
          self.csvPreviewData = results.data;
        }
      });
    },

    loadLocalCsv: function() {
      this.csvFile = this.csvPreviewFile;
      this.csvFilename = this.csvPreviewFilename;
      this.parseCsvForTabulator();
      $("#file-load").modal("hide");
    },

    parseCsvForTabulator: function(){
      let self = this;
      Papa.parse( this.csvFile, {
        encoding: "utf8",
        skipEmptyLines: 'greedy',
        complete: function(results) {
          self.csvHeaders = results.data[0];
          for( var head in self.csvHeaders ){ 
            if( !isNaN( self.csvHeaders[head] ) ){
              self.csvHeaders[head] = '_' + self.csvHeaders[head];
            }
            self.csvHeaders[head] = self.csvHeaders[head].replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '_');
          }
          results.data[0] = self.csvHeaders;
          results.data.shift()
          self.csvData = results.data;
          self.loadTabulator();
        }
      });
    },

    loadTabulator: function() {
      if( this.tabulatorColumns.length > 0 ){
        this.tabulator.clearFilter(true);
        this.tabulator.setGroupBy(""); 
      }
      var tabCols = [];
      for ( var head of this.csvHeaders ) {
        let tempObj = {};
        tempObj.title = head;
        tempObj.field = head.replace(' ', '').toLowerCase();
        tempObj.hozAlign = "left";
        tempObj.headerFilter = "input";
        tempObj.bottomCalc = "count";
        tabCols.push(tempObj);
      }
      var tabData = [];
      for( var row of this.csvData) {
        let tempObj = {}
        for( var i in tabCols ) {
          tempObj[ tabCols[i].field ] = row[i];
        }
        tabData.push(tempObj);
      }
      this.tabulatorColumns = tabCols;
      this.tabulatorData = tabData;
      this.selectedField = '';
      this.selectedFieldName = '';
      this.dataIsLoaded = true;
    },

    getinputFile: function() {
      axios.post( '/getinputFile', { params: this.inputFileChoice } )
        .then( (res) => {
          this.csvFilename = this.inputFileChoice;
          this.csvHeaders = res.data['csvHeaders'];
          this.csvData = res.data['csvData'];
          this.loadTabulator();
        })
    },
  },

  mounted: function(){
    this.tabulator = new Tabulator(this.$refs.table, {
      height: "500px",
      layout: "fitColumns",
      groupToggleElement:"header", 
      data: this.tabulatorData,
      columns: this.tabulatorColumns,
      reactiveData: true,
    });
    this.highchart = Highcharts.chart('container', this.chartOptions);
  }
});
