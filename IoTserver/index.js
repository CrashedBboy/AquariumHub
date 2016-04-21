var net = require('net');
var mysql = require('mysql');

var sockets = [];
var severAddr = '140.115.152.224';
var severPort = 8080;
var supernodeAddr = '';
var supernodePort = ;

var flag = 0;

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
                    console.log('Error connect to DB');
                console.log('Server connection established');
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
                        if(rows.length > 0){
                            var channel_id = rows[0].channel_id;
                            //return to client
                            sock.write('TOPIC ' + channel_id);
                            //return to supernode
                            var supernode = new net.Socket();
                            supernode.connect(supernodePort, supernodeAddr, function(){
                                supernode.write('NEW ' + user_id + ' ' + channel_id);
                                supernode.destroy();
                                console.log('SuperNode connect');
                            });
                            supernode.on('close', function(){
                                console.log('Supernode connection close');    
                            });
                        }
                        else{
                            //find the empty channel
                            con.query(sqlFindChannel, [-1], function(err, rows){
                                if(err)
                                    throw err;
                                console.log('Channel is empty or not');
                                if(rows.length > 0){
                                    var channel_id = rows[0].channel_id;
                                    //return to client
                                    sock.write('TOPIC ' + channel_id);
                                    //return to supernode
                                    var supernode = new net.Socket();
                                    supernode.connect(supernodePort, supernodeAddr, function(){
                                        supernode.write('NEW ' + user_id + ' ' + channel_id);
                                        supernode.destroy();
                                        console.log('SuperNode connect');
                                    });
                                    supernode.on('close', function(){
                                        console.log('Supernode connection close');    
                                    });
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

svr.listen(severPort, severAddr);
console.log('Server Creted at ' + severAddr + ': ' + severPort + '\n');

