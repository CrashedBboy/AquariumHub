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
        console.log('connection: ' + len);
        console.log(': ' + data);

        //MySQL
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
        con.query('SELECT * FROM Customer', function(err, rows){
            if(err)
                throw err;
            console.log('Data received from DB: \n');
            for(var i = 0; i < rows.length; i++)
                console.log(rows[i].name);    
        });
        con.end(function(err){});
    });
});

svr.listen(svrport, svraddr);
console.log('Server Creted at ' + svraddr + ': ' + svrport + '\n');
