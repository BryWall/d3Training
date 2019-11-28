google.charts.load('current', {
    packages: ['corechart']
});
    
google.charts.setOnLoadCallback(drawChart);

function drawChart () {
    fetch('./acte_naissance_05.json')
        .then(res => res.json())
        .then(({data}) => {
            const dataFormated = Object.entries(data.reduce((acc, {an_evenement_mois, an_pere_naissance_annee, an_nombre, an_evenement_annee}) => {
                if(acc[an_evenement_annee]){
                    acc[an_evenement_annee].annee_pere += parseInt(an_pere_naissance_annee) * an_nombre
                    acc[an_evenement_annee].total += an_nombre;
                } 
                else{
                    acc[an_evenement_annee] = {
                        "total" : an_nombre,
                        "annee_pere" : parseInt(an_pere_naissance_annee)
                    }
                }
                return acc;
            }, {})).map(birth => [birth[0], birth[1].annee_pere / birth[1].total]);




            //const dataFormated = data.map(({an_evenement_mois, an_pere_naissance_annee, an_nombre, an_evenement_annee}) => {
                //return [new Date(`${an_evenement_mois}/01/${an_evenement_annee}`), parseInt(an_pere_naissance_annee)]
            //})
            console.log(dataFormated);
            let dataTable = new google.visualization.DataTable();
            dataTable.addColumn('string', "annee");
            dataTable.addColumn('number', "number");
            dataTable.addRows(dataFormated);



        
            var options = {
                title: "Total de naissance en fonction des années",
                width: "100%",
                height : 500,
                legend: 'none'
            };
        
            var chart = new google.visualization.LineChart(document.getElementById('lab'));
        
            chart.draw(dataTable, options);
        });
}