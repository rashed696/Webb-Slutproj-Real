const systemInformation = require('systeminformation');
const { shell } = require('electron');

// Används för att övervaka ändringar på en fil
const fs = require('fs');
require('log-timestamp');

const cpuInfoFile = "./JS/out.txt";
console.log("Watching for file changes on" + cpuInfoFile);


let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");


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
        }, 100);
        // console.log(`${fileName} file changed`);
        // let text = valueOf(saveDataFromTextFile(cpuInfoFile));
        saveDataFromTextFile(cpuInfoFile);
        console.log(dynamicData.cpu.activeLoad);
    }
});

// let showButton = document.querySelector("#show-button");
let cpuNameDisplay = document.querySelector("#cpu-name");
let gpuNameDisplay = document.querySelector("#gpu-name");
let memNameDisplay = document.querySelector("#mem-name");

let cpuRealTimeDisplay = document.querySelector('#cpu-data');
let staticData; 
let staticDataToCatch = 
{
    "cpu": "speed, manufacturer, brand, speed, cores",
    "mem": "total, free",
    "graphics": "*",
    "osInfo": "distro, platform, hostname",
    "diskLayout": "*"
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
    }
}

let outputStaticData = ()=>
{
    cpuNameDisplay.textContent = `CPU: ${staticData.cpu.manufacturer + " " + staticData.cpu.brand + " @ " + staticData.cpu.speed} GHz`;
    gpuNameDisplay.textContent = `GPU: ${staticData.graphics.controllers[0].vendor + " " + staticData.graphics.controllers[0].model}`;
    memNameDisplay.textContent = `Memory: ${convertBytesToGigabytes(staticData.mem.total)} GB`;
}

console.log(dynamicData.cpu);


let saveStaticData = (aData)=>
{
    staticData = Object.assign({}, aData);
    console.log(staticData);

    outputStaticData();
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
                if(allText.length > 0)
                {
                    dynamicData.cpu.activeLoad = Object.assign({}, {"activeLoad": textToArray(allText)[1]});
                }
            }
        }
    });
    rawFile.send(null);
}
//REnsa arrayen och skapa ett JSON objekt
let textToArray = (string) =>
{
    let textArray = string.split(" \r\n");
    for(let i = textArray.length -1; i > 0; i--)
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

let dynamicDataArray = saveDataFromTextFile('./JS/out.txt');
// dynamicData.cpu.activeLoad = dynamicDataArray[1];
console.log(dynamicDataArray);


// let findInArray = (stringToFind, aArray)=>
// {
//     console.log(aArray.indexOf(stringToFind));
// }

// findInArray("loadPercentage", dynamicDataArray);


let convertBytesToGigabytes = (bytes) =>
{
    return bytes / 1065825792;
}

systemInformation.get(staticDataToCatch).then(data => saveStaticData(data));
shell.openPath("C:/Users/rashed696/Docs/Webb/Webb-Slutproj-Real/JS/launch_cmd.vbs");




// let cpuInfo;
// let gpuInfo;

// setInterval(() => {
//     systemInformation.currentLoad().then(data=> cpuRealTimeDisplay.textContent = `CPU usage: ${data.currentLoadSystem}  %`);
//     getAccurateCPUusage();
//   },1000);

// let cmd ''= spawn('C:/Users/rashed696/Docs/Webb/JS/test.cmd');

let getAccurateCPUusage = () =>
{
// ''    cmd.stdout.on('data', ()=>
//     {
//         console.log(data.toString());
//     });
//     cmd.stderr.on('data', () =>
//     {
//         console.error(data.toString());
//     });

    
}

let readFile = (fileName)=>
{

}


/* Denna funktion är hämtad från stack overflow
 * https://stackoverflow.com/questions/37322862/check-if-electron-app-is-launched-with-admin-privileges-on-windows
 * Hämtad: 11-03-2021 14:00
*/
// let isAdmin = ()=>
// {
//     var exec = require('child_process').exec; 
//     exec('NET SESSION', function(err,so,se) {
//         //   console.log(se.length === 0 ? "admin" : "not admin");
//           se.length === 0 ? true : false;
//         });
// }

// if(isAdmin)
// {
//     console.log("Är admin");
// }

let updateCPUtext = (newText)=>
{
    cpuNameDisplay.textContent = newText; 
}

let updateGPUtext = (newText)=>
{
    gpuNameDisplay.textContent = newText; 
}

async function getCpuData()
{
    cpuNameDisplay.textContent = ("CPU: Retrieving CPU information...");
    try 
    {
        const data = await systemInformation.cpu();
        console.log('CPU info: ');
        console.log(data);
        cpuInfo = Object.assign({}, data);
        updateCPUtext(`CPU: ${cpuInfo.manufacturer} ${cpuInfo.brand}`);    
    }
    catch (e)
    {
        console.error(e);
    }
    systemInformation.cpuCurrentSpeed().then(data => cpuNameDisplay.textContent += ` @ ${data.max} GHz`);
}

async function getGpuData()
{
    gpuNameDisplay.textContent = ("GPU: Retrieving GPU information...");
    try 
    {
        const data = await systemInformation.graphics();
        console.log('GPU info: ');
        console.log(data);
        gpuInfo = Object.assign({}, data);
        updateGPUtext(`GPU: ${gpuInfo.controllers[0].model}`);
    }
    catch (e)
    {
        console.error(e);
    }
}

// let renderGraphics = ()=>
// {
//     ctx.fillStyle = "#330022";
//     ctx.fillRect(2,10,50,50);
// }

// renderGraphics();

// getCpuData();
// getGpuData();






