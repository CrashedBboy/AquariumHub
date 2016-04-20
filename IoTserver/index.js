var net = require('net');
var mysql = require('mysql');

var sockets = [];
var svraddr = '';
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
                host     : '',
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
            var queryString = 'SELECT * FROM Customer WHERE id = ' + id;
            console.log('sql: ' + queryString);
            con.query(queryString, [id], function(err, rows){
                if(err)
                    throw err;
                //格式正確
                if(rows.length > 0){
                    for(var i in rows)
                        sock.write('HELLO ' + rows[i].id + '\n');
                }
                //格式錯誤
                else
                    sock.write('INVALID \n');
            });
            con.end(function(err){});
        }
    });
});

svr.listen(svrport, svraddr);
console.log('Server Creted at ' + svraddr + ': ' + svrport + '\n');
