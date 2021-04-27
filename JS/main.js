const systemInformation = require('systeminformation');
const { shell } = require('electron');


https://thisdavej.com/how-to-watch-for-files-changes-in-node-js/#i-need-a-quick-solution

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






systemInformation.get(staticDataToCatch).then(data => saveStaticData(data));
shell.openPath("C:/Users/rashed696/Docs/Webb/Webb-Slutproj-Real/JS/launch_cmd.vbs");

let saveStaticData = (aData)=>
{
    staticData = Object.assign({}, aData);
    console.log(staticData);

    outputStaticData();
}

let readTextFile = (path)=>
{
    let rawFile = new XMLHttpRequest();
    rawFile.open("GET", path, false);
    rawFile.addEventListener("readystatechange", ()=>
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                let allText = rawFile.responseText;
                alert(allText);
            }
        }
    });
    rawFile.send(null);
}


readTextFile('./JS/out.txt');


let outputStaticData = ()=>
{
    cpuNameDisplay.textContent = `CPU: ${staticData.cpu.manufacturer + " " + staticData.cpu.brand + " @ " + staticData.cpu.speed} GHz`;
    gpuNameDisplay.textContent = `GPU: ${staticData.graphics.controllers[0].vendor + " " + staticData.graphics.controllers[0].model}`;
    memNameDisplay.textContent = `Memory: ${convertBytesToGigabytes(staticData.mem.total)} GB`;
}

let convertBytesToGigabytes = (bytes) =>
{
    return bytes / 1065825792;
}





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
let isAdmin = ()=>
{
    var exec = require('child_process').exec; 
    exec('NET SESSION', function(err,so,se) {
        //   console.log(se.length === 0 ? "admin" : "not admin");
          se.length === 0 ? true : false;
        });
}

if(isAdmin)
{
    console.log("Är admin");
}

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



// getCpuData();
// getGpuData();






