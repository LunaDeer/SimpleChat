let ipList = getLocalIP();
function getLocalIP() {
    const os = require('os');
    const osType = os.type(); //系统类型
    const netInfo = os.networkInterfaces(); //网络信息
    let ip = [];
    if (osType === 'Windows_NT') { 
        for (let dev in netInfo) {
            // if (dev === '本地连接' || dev === '以太网') {
            {
                for (let j = 0; j < netInfo[dev].length; j++) {
                    // console.log(netInfo[dev][j]);
                    if (netInfo[dev][j].family === 'IPv4') {
                        // if(netInfo[dev][j].internal === false)
                        {
                            ip.push(netInfo[dev][j].address);
                        }
                        // break;
                    }
                }
            }
        }
    } else if (osType === 'Linux') {
        ip.push(netInfo.eth0[0].address);
    } else if (osType === 'Darwin') {
    	// mac操作系统
    	// ip = netInfo.eth0[0].address;
    } else {
    	// 其他操作系统
    }
    console.log(ip);
    return ip;
}

module.exports = {
    ipList
}

