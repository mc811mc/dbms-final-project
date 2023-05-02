/* This class will be useful in case we need to convert a pollutant concentration value to its AQI (Air Quality Index) */
function Linear(AQIhigh, AQIlow, Conchigh, Conclow, Concentration) {
    var linear;
    var Conc = parseFloat(Concentration);
    var a;
    a = ((Conc - Conclow) / (Conchigh - Conclow)) * (AQIhigh - AQIlow) + AQIlow;
    linear = Math.round(a);
    return linear;
}

function AQIOzone8hr(Concentration) {
    var Conc = parseFloat(Concentration);
    var c;
    var AQI;
    c = (Math.floor(Conc)) / 1000;
    console.log("AQI O3: ", c);
    if (c >= 0 && c < .055) {
        AQI = Linear(50, 0, 0.054, 0, c);
    }
    else if (c >= .055 && c < .071) {
        AQI = Linear(100, 51, .070, .055, c);
    }
    else if (c >= .071 && c < .086) {
        AQI = Linear(150, 101, .085, .071, c);
    }
    else if (c >= .086 && c < .106) {
        AQI = Linear(200, 151, .105, .086, c);
    }
    else {
        AQI = Linear(300, 201, .200, .106, c);
    }
    return AQI;
}

function AQIPM25(Concentration) {
    var Conc = parseFloat(Concentration);
    var c;
    var AQI;
    c = (Math.floor(10 * Conc)) / 10;
    console.log("AQI pm2.5: ", c);
    if (c >= 0 && c < 12.1) {
        AQI = Linear(50, 0, 12, 0, c);
    }
    else if (c >= 12.1 && c < 35.5) {
        AQI = Linear(100, 51, 35.4, 12.1, c);
    }
    else if (c >= 35.5 && c < 55.5) {
        AQI = Linear(150, 101, 55.4, 35.5, c);
    }
    else if (c >= 55.5 && c < 150.5) {
        AQI = Linear(200, 151, 150.4, 55.5, c);
    }
    else if (c >= 150.5 && c < 250.5) {
        AQI = Linear(300, 201, 250.4, 150.5, c);
    }
    else if (c >= 250.5 && c < 350.5) {
        AQI = Linear(400, 301, 350.4, 250.5, c);
    }
    else {
        AQI = Linear(500, 401, 500.4, 350.5, c);
    }
    return AQI;
}

function AQINO2(Concentration) {
    var Conc = parseFloat(Concentration);
    var c;
    var AQI;
    c = (Math.floor(Conc)) / 1000;
    console.log("AQI NO2: ", c);
    if (c >= 0 && c < .054) {
        AQI = Linear(50, 0, .053, 0, c);
    }
    else if (c >= .054 && c < .101) {
        AQI = Linear(100, 51, .100, .054, c);
    }
    else if (c >= .101 && c < .361) {
        AQI = Linear(150, 101, .360, .101, c);
    }
    else if (c >= .361 && c < .650) {
        AQI = Linear(200, 151, .649, .361, c);
    }
    else if (c >= .650 && c < 1.250) {
        AQI = Linear(300, 201, 1.249, .650, c);
    }
    else if (c >= 1.250 && c < 1.650) {
        AQI = Linear(400, 301, 1.649, 1.250, c);
    }
    else {
        AQI = Linear(500, 401, 2.049, 1.650, c);
    }
    return AQI;
}

function AQICO(Concentration) {
    var Conc = parseFloat(Concentration);
    var c;
    var AQI;
    c = (Math.floor(10 * Conc)) / 10;
    console.log("AQI CO: ", c);
    if (c >= 0 && c < 4.5) {
        AQI = Linear(50, 0, 4.4, 0, c);
    }
    else if (c >= 4.5 && c < 9.5) {
        AQI = Linear(100, 51, 9.4, 4.5, c);
    }
    else if (c >= 9.5 && c < 12.5) {
        AQI = Linear(150, 101, 12.4, 9.5, c);
    }
    else if (c >= 12.5 && c < 15.5) {
        AQI = Linear(200, 151, 15.4, 12.5, c);
    }
    else if (c >= 15.5 && c < 30.5) {
        AQI = Linear(300, 201, 30.4, 15.5, c);
    }
    else if (c >= 30.5 && c < 40.5) {
        AQI = Linear(400, 301, 40.4, 30.5, c);
    }
    else {
        AQI = Linear(500, 401, 50.4, 40.5, c);
    }
    return AQI;
}

function AQISO224hr(Concentration) {
    var Conc = parseFloat(Concentration);
    var c;
    var AQI;
    c = Math.floor(Conc);
    console.log("AQI SO2: ", c);
    if (c >= 304 && c < 605) {
        AQI = Linear(300, 201, 604, 305, c);
    }
    else if (c >= 605 && c < 805) {
        AQI = Linear(400, 301, 804, 605, c);
    }
    else {
        AQI = Linear(500, 401, 1004, 805, c);
    }
    return AQI;
}

function CalcAQI(form2) {
    var b;

    document.form2.inputbox.style.textAlign = "center";
    document.form2.inputbox.style.backgroundColor = "white";

    var f;
    f = document.form2.inputbox.value
    f = f.replace(/\,/, '');

    if (document.form2.outputbox3.value == 'Good') {
        document.form2.outputbox3.style.backgroundColor = "#00e000";
        document.form2.outputbox3.style.color = "black";
        document.form2.HealthEffects.value = "None";
        document.form2.Cautionary.value = "None";
        if (document.form2.pollutant.selectedIndex == '1') {
            document.form2.TextSensitive.value = "People with respiratory or heart disease, the elderly and children are the groups most at risk.";
        }
        else if (document.form2.pollutant.selectedIndex == '2') {
            document.form2.TextSensitive.value = "People with respiratory disease are the group most at risk.";
        }
        else if (document.form2.pollutant.selectedIndex == '3') {
            document.form2.TextSensitive.value = "People with heart disease are the group most at risk.";
        }
        else if (document.form2.pollutant.selectedIndex == '4' || form2.pollutant.selectedIndex == '5') {
            document.form2.TextSensitive.value = "People with asthma are the group most at risk.";
        }
        else if (document.form2.pollutant.selectedIndex == '6' || form2.pollutant.selectedIndex == '7') {
            document.form2.TextSensitive.value = "Children and people with asthma are the groups most at risk.";
        }
        else if (document.form2.pollutant.selectedIndex == '8') {
            document.form2.TextSensitive.value = "People with asthma or other respiratory diseases, the elderly, and children are the groups most at risk.";
        }
    }
    else if (document.form2.outputbox3.value == 'Moderate') {
        document.form2.outputbox3.style.backgroundColor = "#ffff00";
        document.form2.outputbox3.style.color = "black";
        if (document.form2.pollutant.selectedIndex == '1') {
            document.form2.TextSensitive.value = "People with respiratory or heart disease, the elderly and children are the groups most at risk.";
            document.form2.HealthEffects.value = "Unusually sensitive people should consider reducing prolonged or heavy exertion.";
            document.form2.Cautionary.value = "Unusually sensitive people should consider reducing prolonged or heavy exertion.";
        }
        else if (document.form2.pollutant.selectedIndex == '2') {
            document.form2.TextSensitive.value = "People with respiratory disease are the group most at risk.";
            document.form2.HealthEffects.value = "Unusually sensitive people should consider reducing prolonged or heavy exertion.";
            document.form2.Cautionary.value = "Unusually sensitive people should consider reducing prolonged or heavy exertion.";
        }
        else if (document.form2.pollutant.selectedIndex == '3') {
            document.form2.TextSensitive.value = "People with heart disease are the group most at risk.";
            document.form2.HealthEffects.value = "None";
            document.form2.Cautionary.value = "None";
        }
        else if (document.form2.pollutant.selectedIndex == '4' || form2.pollutant.selectedIndex == '5') {
            document.form2.TextSensitive.value = "People with asthma are the group most at risk.";
            document.form2.HealthEffects.value = "None";
            document.form2.Cautionary.value = "None";
        }
        else if (document.form2.pollutant.selectedIndex == '6' || form2.pollutant.selectedIndex == '7') {
            document.form2.TextSensitive.value = "Children and people with asthma are the groups most at risk.";
            if (document.form2.pollutant.selectedIndex == '6') {
                document.form2.HealthEffects.value = "Unusually sensitive individuals may experience respiratory symptoms.";
                document.form2.Cautionary.value = "Unusually sensitive people should consider limiting prolonged outdoor exertion.";
            }
        }
        else if (document.form2.pollutant.selectedIndex == '8') {
            document.form2.TextSensitive.value = "People with asthma or other respiratory diseases, the elderly, and children are the groups most at risk.";
            document.form2.HealthEffects.value = "Unusually sensitive individuals may experience respiratory symptoms.";
            document.form2.Cautionary.value = "Unusually sensitive people should consider reducing prolonged or heavy outdoor exertion.";
        }
    }
    else if (document.form2.outputbox3.value == 'Unhealthy for Sensitive Groups') {
        document.form2.outputbox3.style.backgroundColor = "#ff7600";
        document.form2.outputbox3.style.color = "black";
        if (document.form2.pollutant.selectedIndex == '1') {
            document.form2.TextSensitive.value = "People with respiratory or heart disease, the elderly and children are the groups most at risk.";
            document.form2.HealthEffects.value = "Increasing likelihood of respiratory symptoms in sensitive individuals, aggravation of heart or lung disease and premature mortality in persons with cardiopulmonary disease and the elderly.";
            document.form2.Cautionary.value = "People with respiratory or heart disease, the elderly and children should limit prolonged exertion.";
        }
        else if (document.form2.pollutant.selectedIndex == '2') {
            document.form2.TextSensitive.value = "People with respiratory disease are the group most at risk.";
            document.form2.HealthEffects.value = "Increasing likelihood of respiratory symptoms and aggravation of lung disease, such as asthma";
            document.form2.Cautionary.value = "People with respiratory disease, such as asthma, should limit outdoor exertion.";
        }
        else if (document.form2.pollutant.selectedIndex == '3') {
            document.form2.TextSensitive.value = "People with heart disease are the group most at risk.";
            document.form2.HealthEffects.value = "Increasing likelihood of reduced exercise tolerance due to increased cardiovascular symptoms, such as chest pain, in people with cardiovascular disease.";
            document.form2.Cautionary.value = "People with cardiovascular disease, such as angina, should limit heavy exertion and avoid sources of CO, such as heavy traffic.";
        }
        else if (document.form2.pollutant.selectedIndex == '4' || form2.pollutant.selectedIndex == '5') {
            document.form2.TextSensitive.value = "People with asthma are the group most at risk.";
            document.form2.HealthEffects.value = "Increasing likelihood of respiratory symptoms, such as chest tightness and breathing discomfort, in people with asthma.";
            document.form2.Cautionary.value = "People with asthma should consider limiting outdoor exertion.";
        }
        else if (document.form2.pollutant.selectedIndex == '6' || form2.pollutant.selectedIndex == '7') {
            document.form2.HealthEffects.value = "Increasing likelihood of respiratory symptoms and breathing discomfort in active children and adults and people with respiratory disease, such as asthma.";
            document.form2.TextSensitive.value = "Children and people with asthma are the groups most at risk.";
            if (document.form2.pollutant.selectedIndex == '6') {
                document.form2.Cautionary.value = "Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.";
            }
            else if (document.form2.pollutant.selectedIndex == '7') {
                document.form2.Cautionary.value = "Active children and adults, and people with respiratory disease, such as asthma, should limit heavy outdoor exertion.";
            }
        }
        else if (document.form2.pollutant.selectedIndex == '8') {
            document.form2.TextSensitive.value = "People with asthma or other respiratory diseases, the elderly, and children are the groups most at risk.";
            document.form2.HealthEffects.value = "Increasing likelihood of respiratory symptoms and breathing discomfort in active children, the elderly, and people with lung disease, such as asthma.";
            document.form2.Cautionary.value = "Active children, the elderly, and people with lung disease, such as asthma, should reduce prolonged or heavy outdoor exertion.";
        }
    }
    else if (document.form2.outputbox3.value == 'Unhealthy') {
        document.form2.outputbox3.style.backgroundColor = "#ff0000";
        document.form2.outputbox3.style.color = "black";
        if (document.form2.pollutant.selectedIndex == '1') {
            document.form2.TextSensitive.value = "People with respiratory or heart disease, the elderly and children are the groups most at risk.";
            document.form2.HealthEffects.value = "Increased aggravation of heart or lung disease and premature mortality in persons with cardiopulmonary disease and the elderly; increased respiratory effects in general population.";
            document.form2.Cautionary.value = "People with respiratory or heart disease, the elderly and children should avoid prolonged exertion; everyone else should limit prolonged exertion.";
        }
        else if (document.form2.pollutant.selectedIndex == '2') {
            document.form2.TextSensitive.value = "People with respiratory disease are the group most at risk.";
            document.form2.HealthEffects.value = "Increased respiratory symptoms and aggravation of lung disease, such as asthma; possible respiratory effects in general population.";
            document.form2.Cautionary.value = "People with respiratory or heart disease, the elderly and children are the groups most at risk.";
            document.form2.HealthEffects.value = "Increased aggravation of heart or lung disease and premature mortality in persons with cardiopulmonary disease and the elderly; increased respiratory effects in general population.";
            document.form2.Cautionary.value = "People with respiratory or heart disease, the elderly and children should avoid prolonged exertion; everyone else should limit prolonged exertion.";
        }
        else if (document.form2.pollutant.selectedIndex == '3') {
            document.form2.TextSensitive.value = "People with heart disease are the group most at risk.";
            document.form2.HealthEffects.value = "Reduced exercise tolerance due to increased cardiovascular symptoms, such as chest pain, in people with cardiovascular disease.";
            document.form2.Cautionary.value = "People with cardiovascular disease, such as angina, should limit moderate exertion and avoid sources of CO, such as heavy traffic.";
        }
        else if (document.form2.pollutant.selectedIndex == '4' || form2.pollutant.selectedIndex == '5') {
            document.form2.TextSensitive.value = "People with asthma are the group most at risk.";
            document.form2.HealthEffects.value = "Increased respiratory symptoms, such as chest tightness and wheezing in people with asthma; possible aggravation of heart or lung disease.";
            document.form2.Cautionary.value = "Children, asthmatics, and people with heart or lung disease should limit outdoor exertion.";
        }
        else if (document.form2.pollutant.selectedIndex == '6' || form2.pollutant.selectedIndex == '7') {
            document.form2.TextSensitive.value = "Children and people with asthma are the groups most at risk.";
            document.form2.HealthEffects.value = "Greater likelihood of respiratory symptoms and breathing difficulty in active children and adults and people with respiratory disease, such as asthma; possible respiratory effects in general population.";
            if (document.form2.pollutant.selectedIndex == '6') {
                document.form2.Cautionary.value = "Active children and adults, and people with respiratory disease, such as asthma, should avoid prolonged outdoor exertion; everyone else, especially children, should limit prolonged outdoor exertion.";
            }
            else if (document.form2.pollutant.selectedIndex == '7') {
                document.form2.Cautionary.value = "Active children and adults, and people with respiratory disease, such as asthma, should avoid heavy outdoor exertion; everyone else, especially children, should limit heavy outdoor exertion.";
            }
        }
        else if (document.form2.pollutant.selectedIndex == '8') {
            document.form2.TextSensitive.value = "People with asthma or other respiratory diseases, the elderly, and children are the groups most at risk.";
            document.form2.HealthEffects.value = "Greater likelihood of respiratory symptoms in active children, the elderly, and people with lung disease, such as asthma; possible respiratory effects in general population.";
            document.form2.Cautionary.value = "Active children, the elderly, and people with lung disease, such as asthma, should avoid prolonged or heavy outdoor exertion; everyone else, expecially children, should reduce prolonged or heavy outdoor exertion.";
        }
    }
    else if (document.form2.outputbox3.value == 'Very Unhealthy') {
        document.form2.outputbox3.style.backgroundColor = "#990049";
        document.form2.outputbox3.style.color = "#ffffff";
        if (document.form2.pollutant.selectedIndex == '1') {
            document.form2.TextSensitive.value = "People with respiratory or heart disease, the elderly and children are the groups most at risk.";
            document.form2.HealthEffects.value = "Significant aggravation of heart or lung disease and premature mortality in persons with cardiopulmonary disease and the elderly; significant increase in respiratory effects in general population.";
            document.form2.Cautionary.value = "People with respiratory or heart disease, the elderly and children should avoid any outdoor activity; everyone else should avoid prolonged exertion.";
        }
        else if (document.form2.pollutant.selectedIndex == '2') {
            document.form2.TextSensitive.value = "People with respiratory disease are the group most at risk.";
            document.form2.HealthEffects.value = "Significant increase in respiratory symptoms and aggravation of lung disease, such as asthma; increasing likelihood of respiratory effects in general population.";
            document.form2.Cautionary.value = "People with respiratory disease, such as asthma, should avoid any outdoor activity; everyone else, especially the elderly and children, should limit outdoor exertion.";
        }
        else if (document.form2.pollutant.selectedIndex == '3') {
            document.form2.TextSensitive.value = "People with heart disease are the group most at risk.";
            document.form2.HealthEffects.value = "Significant aggravation of cardiovascular symptoms, such as chest pain, in people with cardiovascular disease.";
            document.form2.Cautionary.value = "People with cardiovascular disease, such as angina, should avoid exertion and sources of CO, such as heavy traffic.";
        }
        else if (document.form2.pollutant.selectedIndex == '4' || form2.pollutant.selectedIndex == '5') {
            document.form2.TextSensitive.value = "People with asthma are the group most at risk.";
            document.form2.HealthEffects.value = "Significant increase in respiratory symptoms, such as wheezing and shortness of breath, in people with asthma; aggravation of heart or lung disease.";
            document.form2.Cautionary.value = "Children, asthmatics, and people with heart or lung disease should avoid outdoor exertion; everyone else should limit outdoor exertion.";
        }
        else if (document.form2.pollutant.selectedIndex == '6' || document.form2.pollutant.selectedIndex == '7') {
            document.form2.TextSensitive.value = "Children and people with asthma are the groups most at risk.";
            document.form2.HealthEffects.value = "Increasingly severe symptoms and impaired breathing likely in active children and adults and people with respiratory disease, such as asthma; increasing likelihood of respiratory effects in general population.";
            document.form2.Cautionary.value = "Active children and adults, and people with respiratory disease, such as asthma, should avoid all outdoor exertion; everyone else, especially children, should limit outdoor exertion.";
        }
        else if (document.form2.pollutant.selectedIndex == '8') {
            document.form2.TextSensitive.value = "People with asthma or other respiratory diseases, the elderly, and children are the groups most at risk.";
            document.form2.HealthEffects.value = "Increasingly severe symptoms and impaired breathing likely in active children, the elderly, and people with lung disease, such as asthma; increasing likelihood of respiratory effects in general population.";
            document.form2.Cautionary.value = "Active children, the elderly, and people with lung disease, such as asthma, should avoid all outdoor exertion; everyone else, especially children, should avoid prolonged or heavy outdoor exertion.";
        }
    }
    else if (document.form2.outputbox3.value == 'Hazardous') {
        document.form2.outputbox3.style.backgroundColor = "#7E0023";
        document.form2.outputbox3.style.color = "#ffffff";
        if (document.form2.pollutant.selectedIndex == '1') {
            document.form2.TextSensitive.value = "People with respiratory or heart disease, the elderly and children are the groups most at risk.";
            document.form2.HealthEffects.value = "Serious aggravation of heart or lung disease and premature mortality in persons with cardiopulmonary disease and the elderly; serious risk of respiratory effects in general population.";
            document.form2.Cautionary.value = "Everyone should avoid any outdoor exertion; people with respiratory or heart disease, the elderly and children should remain indoors.";
        }
        else if (document.form2.pollutant.selectedIndex == '2') {
            document.form2.TextSensitive.value = "People with respiratory disease are the group most at risk.";
            document.form2.HealthEffects.value = "Serious risk of respiratory symptoms and aggravation of lung disease, such as asthma; respiratory effects likely in general population.";
            document.form2.Cautionary.value = "Everyone should avoid any outdoor exertion; people with respiratory disease, such as asthma, should remain indoors.";
        }
        else if (document.form2.pollutant.selectedIndex == '3') {
            document.form2.TextSensitive.value = "People with heart disease are the group most at risk.";
            document.form2.HealthEffects.value = "Serious aggravation of cardiovascular symptoms, such as chest pain, in people with cardiovascular disease; impairment of strenuous activities in general population.";
            document.form2.Cautionary.value = "People with cardiovascular disease, such as angina, should avoid exertion and sources of CO, such as heavy traffic; everyone else should limit heavy exertion.";
        }
        else if (document.form2.pollutant.selectedIndex == '4' || form2.pollutant.selectedIndex == '5') {
            document.form2.TextSensitive.value = "People with asthma are the group most at risk.";
            document.form2.HealthEffects.value = "Severe respiratory symptoms, such as wheezing and shortness of breath, in people with asthma; increased aggravation of heart or lung disease; possible respiratory effects in general population.";
            document.form2.Cautionary.value = "Children, asthmatics, and people with heart or lung disease should remain indoors; everyone else should avoid outdoor exertion.";
        }
        else if (document.form2.pollutant.selectedIndex == '6' || document.form2.pollutant.selectedIndex == '7') {
            document.form2.TextSensitive.value = "Children and people with asthma are the groups most at risk.";
            document.form2.HealthEffects.value = "Severe respiratory effects and impaired breathing likely in active children and adults and people with respiratory disease, such as asthma; increasingly severe respiratory effects likely in general population.";
            document.form2.Cautionary.value = "Everyone should avoid all outdoor exertion.";
        }
        else if (document.form2.pollutant.selectedIndex == '8') {
            document.form2.TextSensitive.value = "People with asthma or other respiratory diseases, the elderly, and children are the groups most at risk.";
            document.form2.HealthEffects.value = "Severe respiratory effects and impaired breathing likely in active children, the elderly, and people with lung disease, such as asthma; increasingly severe respiratory effects likely in general population.";
            document.form2.Cautionary.value = "Children, the elderly, and people with lung disease, such as asthma, should remain indoors; everyone else, especially children, should avoid outdoor exertion.";
        }
    }
    else {
        document.form2.outputbox3.style.backgroundColor = "#ffffff";
        document.form2.outputbox3.style.color = "black";
        document.form2.TextSensitive.value = "";
        document.form2.HealthEffects.value = "";
        document.form2.Cautionary.value = "";
    }

    return true;
}