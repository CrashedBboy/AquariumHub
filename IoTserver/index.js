var net = require('net');
var mysql = require('mysql');

var sockets = [];
var svraddr = '140.115.152.224';
var svrport = 8080;

var svr = net.createServer(function(sock){
    console.log('Connected: ' + sock.remoteAddress + ': ' + sock.remotePort);
    sock.write('Hello ' + sock.remoteAddress + ': ' + sock.remotePort + '\n');
    sockets.push(sock);

    sock.on('data', function(data){
        var len = sockets.length;
        var msg = data.toString().split(" ");
        var action = msg[0];
        var id = msg[1];
        console.log('connection: ' + len);
        console.log('action: ' + action + ' id: ' + id); 
        //MySQL
        //詢問頻道
        if(action == 'ASKTOPIC'){
            //connection
            var con = mysql.createConnection({
                host     : '140.115.189.142',
                user     : 'test',
                password : 'test',
                database : 'test'
            });
            con.connect(function(err){
                if(err)
                    console.log('Error connection to DB');
                console.log('Connection established');
            });

            //query id is leagal or illeagal
            var sqlFindDevice = 'SELECT * FROM user_device WHERE device_id = ?';
            var sqlFindEmpty = 'SELECT * FROM user_ichannel WHERE user_id = ?';
            console.log('sqlFindUser: ' + sqlFindDevice);
            console.log('sqlFindEmpty: ' + sqlFindEmpty);
            con.query(sqlFindDevice, [id], function(err, rows){
                if(err)
                    throw err;
                //格式正確
                if(rows.length > 0){
                    console.log('User is legal');
                    con.query(sqlFindEmpty, [-1], function(err, rows){
                        if(err)
                            throw err;
                        console.log('Channel is empty or not');
                        //空頻道
                        if(rows.length > 0){
                            sock.write('TOPIC ' + rows[1].channel_id + '\n');

                        {
                        //BUSY
                        else
                            sock.write('BUSY' + '\n');
                    });
                }
                //格式錯誤
                else
                    sock.write('INVALID \n');
                con.end(function(err){});
            });
        }
        else
            sock.write('INVALID \n');
    });
});

svr.listen(svrport, svraddr);
console.log('Server Creted at ' + svraddr + ': ' + svrport + '\n');
