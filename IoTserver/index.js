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
                user     : '',
                password : '',
                database : ''
            });
            con.connect(function(err){
                if(err)
                    console.log('Error connection to DB');
                console.log('Connection established');
            });

            //query id is leagal or illeagal
            var sqlFindDevice = 'SELECT * FROM user_device WHERE device_id = ?';
            var sqlFindEmpty = 'SELECT * FROM user_ichannel WHERE user_id = ?';
            var sqlUpdateChannel = 'UPDATE user_ichannel SET user_id = ? WHERE channel_id = ?';
            con.query(sqlFindDevice, [id], function(err, rows, fields){
                if(err)
                    throw err;
                //格式正確
                if(rows.length > 0){
                    console.log('User is legal');
                    var user_id = rows[0].user_id;
                    con.query(sqlFindEmpty, [-1], function(err, rows){
                        if(err)
                            throw err;
                        console.log('Channel is empty or not');
                        //空頻道
                        if(rows.length > 0){
                            var channel_id = rows[0].channel_id;
                            sock.write('TOPIC ' + channel_id + '\n');
                            con.query(sqlUpdateChannel, [user_id, channel_id], function(err, rows){
                                if(err)
                                    throw err;
                                console.log('Update channel');    
                            });
                        }
                        //BUSY
                        else
                            sock.write('BUSY' + '\n');
                        con.end(function(err){});
                    });
                }
                //格式錯誤
                else
                    sock.write('INVALID \n');
            });
        }
        else
            sock.write('INVALID \n');
    });
});

svr.listen(svrport, svraddr);
console.log('Server Creted at ' + svraddr + ': ' + svrport + '\n');
