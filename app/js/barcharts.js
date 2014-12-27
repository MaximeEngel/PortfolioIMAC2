// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {'packages':['corechart']});

var accentColor;
var widthChart;

$( document ).ready(function() {
    accentColor = $("#cover").css("background-color");
    
    resizeChart();
    $(window).resize(function(){
        resizeChart();

        drawChart("chart_prog");
        drawChart("chart_software");
        drawChart("chart_web");
    });

    // Set a callback to run when the Google Visualization API is loaded.
    google.setOnLoadCallback(function(){
        drawChart("chart_prog");
        drawChart("chart_software");
        drawChart("chart_web");
    });
});

function resizeChart()
{
    var windowWidth = $(window).width();
    if (windowWidth < 992)
    {
        widthChart = $("#competences").width() - parseInt($(".chart").css("margin-left"));
        $(".chart").css("width", widthChart+"px");
    }
    else
    {
        widthChart = $("#competences").width() / 2 - 4 * parseInt($(".chart").css("margin-left")) ;
        $(".chart").css("width", widthChart+"px");
    }
}

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart(chartId) {

    $.getJSON("json/charts/"+chartId+".json", function(data)
    {
         // Create the data table.
        $("#"+chartId).css("height", (data.ratioSize * widthChart)+"px");

        var dataTable = new google.visualization.DataTable();

        $.each(data.columns, function(key, val){
            dataTable.addColumn(val.type, val.label);
        });

        $.each(data.rows, function(key, val){
            dataTable.addRow([val.label, val.value]);
        });

        // Set chart options
        var options =   {   
                            'title':data.title,
                            'colors' : [accentColor],
                            'hAxis' : {minValue : data.minValue, maxValue : data.maxValue},
                            'legend' : { position : 'none' }
                        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.BarChart(document.getElementById(chartId));
        chart.draw(dataTable, options);
    });
}