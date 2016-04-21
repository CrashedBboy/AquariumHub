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
        
        //ask empty topic
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

            var sqlFindDevice = 'SELECT * FROM user_device WHERE device_id = ?';
            var sqlFindChannel = 'SELECT * FROM user_ichannel WHERE user_id = ?';
            var sqlUpdateChannel = 'UPDATE user_ichannel SET user_id = ? WHERE channel_id = ?';
            var sqlUpdateDevice = 'UPDATE user_device SET last_online = CURRENT_TIMESTAMP, online_status = TRUE WHERE user_id = ?';
            
            //query id is legal or illegal
            con.query(sqlFindDevice, [id], function(err, rows, fields){
                if(err)
                    throw err;
                if(rows.length > 0){
                    console.log('User is legal');
                    var user_id = rows[0].user_id;
                    //use topic or not
                    con.query(sqlFindChannel, user_id, function(err, rows){
                        if(err)
                            throw err;
                        if(rows.length > 0)
                            sock.write('TOPIC ' + rows[0].channel_id);
                        else{
                            //find the empty channel
                            con.query(sqlFindChannel, [-1], function(err, rows){
                                if(err)
                                    throw err;
                                console.log('Channel is empty or not');
                                if(rows.length > 0){
                                    var channel_id = rows[0].channel_id;
                                    sock.write('TOPIC ' + channel_id + '\n');
                                    //update the user id of the channel
                                    con.query(sqlUpdateChannel, [user_id, channel_id], function(err, rows){
                                        if(err)
                                            throw err;
                                        console.log('Update channel');    
                                    });
                                    //update the online info of the device
                                    con.query(sqlUpdateDevice, [user_id], function(err, rows){
                                        if(err)
                                            throw err;    
                                    });
                                }
                                //BUSY
                                else
                                    sock.write('BUSY' + '\n');
                                con.end(function(err){});
                            });
                        }
                    });

                }
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
