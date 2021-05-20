const systemInformation = require('systeminformation');
const { shell } = require('electron');
let overviewStatus = document.querySelectorAll('.dial-status');
let overviewDial = document.querySelectorAll('.dial-circle');

//Fixa performance issues

// Används för att övervaka ändringar på en fil
const fs = require('fs');
const { isRegExp } = require('util');
require('log-timestamp');

const cpuInfoFile = "./JS/out.txt";
console.log("Watching for file changes on" + cpuInfoFile);


// let canvas = document.querySelector("#canvas");
// let ctx = canvas.getContext("2d");


let fsWait = false;

// https://thisdavej.com/how-to-watch-for-files-changes-in-node-js/#i-need-a-quick-solution
fs.watch(cpuInfoFile, (event, fileName) =>
{
    if(fileName)
    {
        if(fsWait)
        {
            return;
        }

        fsWait = setTimeout(() =>
        {
            fsWait = false;
        }, 1000);

        // console.log(event);

        saveDataFromTextFile(cpuInfoFile);
        outputDynamicData();
    }
});

let getDynamicData = () =>
{
    setInterval(()=>
    {
        systemInformation.get(dynamicDataToCatch).then(data => saveDynamicData(data));
    }, 1000);
}


let saveDynamicData = (dataToSave)=>
{
    dynamicData = Object.assign(dynamicData, dataToSave);
}



// let showButton = document.querySelector("#show-button");
let cpuNameDisplay = document.querySelector("#cpu-name");
let gpuNameDisplay = document.querySelector("#gpu-name");
let memNameDisplay = document.querySelector("#mem-name");

// let cpuRealTimeDisplay = document.querySelector('#cpu-data');
let staticData; 
let staticDataToCatch = 
{
    "cpu": "speed, manufacturer, brand, speed, cores",
    "mem": "total, free",
    "graphics": "*",
    "osInfo": "distro, platform, hostname",
    "diskLayout": "*"
}

let dynamicDataToCatch = 
{
    // "graphics":"*",
    "mem":"active"
}

let dynamicData = 
{
    "cpu":
    {
        "activeLoad": null,
        "speed": null
    },
    "graphics":
    {
        "activeLoad": null
    },
    "mem":
    {
        "total": null
    }
}

let outputDynamicData = () =>
{
    if(dynamicData)
    {
        // console.log(dynamicData);
        if(dynamicData.cpu != null)
        {
            // overviewDial[0]
            // console.log(overviewDial[0].style.transform);
            overviewStatus[0].textContent = `${dynamicData.cpu.activeLoad}%/100%`;
        }
        if(dynamicData.graphics != null)
        {
            if(dynamicData.graphics == false)
            {
                overviewStatus[1].textContent = "GPU not supported";
            }
            else
            {
                overviewStatus[1].textContent = `${dynamicData.graphics[0].utilizationGpu}% / 100%`;
            }
        }


        if(dynamicData.mem.active)
        {
            overviewStatus[2].textContent = `${convertBytesToGigabytes(dynamicData.mem.active).toFixed(1)}/${convertBytesToGigabytes(staticData.mem.total)}GB`;

        }
    }  
}

let saveStaticData = (aData)=>
{
    staticData = Object.assign({}, aData);
    console.log(staticData);

    if(staticData.graphics.controllers[0].vendor.toLowerCase().includes("nvidia"))
    {
        dynamicDataToCatch = Object.assign(dynamicDataToCatch, {"graphics": "*"});
    }
    else
    {
        dynamicData = Object.assign(dynamicData, {"graphics": false})
    }
    // outputStaticData();
}

let saveDataFromTextFile = (path)=>
{
    let rawFile = new XMLHttpRequest();
    rawFile.open("GET", path, true);
    rawFile.addEventListener("readystatechange", ()=>
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                // console.log("Size: " + rawFile.getAllResponseHeaders());
                let allText = rawFile.responseText;

                let textArray = textToArray(allText);
                let rowToRead = textArray.length - 1;

                if(textArray.length >= 20)
                {
                    shell.openPath("C:/Users/rashed696/Docs/Webb/Webb-Slutproj-Real/JS/launch_clear_cmd.vbs");
                    rowToRead = 1;
                }
                if(textArray.length > 0)
                {
                    dynamicData = Object.assign({}, {"cpu": {"activeLoad": parseInt(textArray[rowToRead])}});
                }

            }
        }
    });
    rawFile.send(null);
}
//Rensa arrayen och skapa ett JSON objekt
let textToArray = (string) =>
{
    let textArray = string.split(" \r\n");

    let maxTextArray = textArray.length -1;
    let i = 0;

    for(i = maxTextArray; i > 0; i--)
    {
        if (textArray[i] == "")
        {
            textArray.splice(i,1);
        }
        else
        {
            textArray[i] = textArray[i].trim();
        }
    }
    return textArray;
}

let convertBytesToGigabytes = (bytes) =>
{
    return bytes / 1065825792;
}

systemInformation.get(staticDataToCatch).then(data => saveStaticData(data));
getDynamicData();
shell.openPath("C:/Users/rashed696/Docs/Webb/Webb-Slutproj-Real/JS/launch_cmd.vbs");






