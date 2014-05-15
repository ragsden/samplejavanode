/**
 * Created by raghu on 3/1/14.
 */

/**
 * learning series name : njymyway
 * episode 5 : multi threading using I/O operations
 *
 * in addition to episode3, I'm creating four frames to see the non blocking/ time slicing approach of handling multiple
 * requests.
 * I'm handling 2 requests keeping the response alive until the end of 3 seconds loop
 * for the other 2 requests, I have spun off a timer and terminated the response immediately.
 * You will notice that the last 2 frames display the response immediately
 * the first 2 frames takes 3 seconds to load and they load at the same time. This is because the set time out acts
 * like a non bocking function and queues up the next execution time and the main thread executes items from the queue.
 * You will notice a difference in milliseconds between frame 1 and 2
 * */
var http = require('http');
var url = require('url');
var exec = require('child_process').execFile;

    http.createServer(function (req, res) {
    var url_parts = url.parse(req.url, true);
    var pathname = url_parts.pathname;
    var host = (url_parts.host || '');
    var query = url_parts.query;
    var reqid = query.reqid;

    console.log(reqid);

    if(pathname == "/")
    {
        frame(res,host);
    }
    else if(pathname == "/io")
    {
        res.write("serving request " + reqid + "\n");

        io(res, reqid);

        console.log("added response " + reqid);

    }
    else
    {
        res.write("serving request " + reqid + "\n");

        sleep(0,res, reqid);

        console.log("added response " + reqid);

        if(pathname == "/sleepend")
        {
            res.write("end time for request : (" + reqid + ") = " + new Date().getMinutes() + ":" + new Date().getSeconds() + ":" + new Date().getMilliseconds() + "\n");
            res.end();
        }
    }
}).listen(Number(process.env.PORT || 5000));
console.log('Server running at http://127.0.0.1:5000/');

io = function(res, reqid)
{
    console.log(__dirname + '/sc.sh');
    res.write("start I/O time for request : (" + reqid + ") = " + new Date().getMinutes() + ":" + new Date().getSeconds() + ":" + new Date().getMilliseconds() + "\n");
    exec(__dirname + '/sc.sh' ,

        function (error, stdout, stderr) {

            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);

            if (error !== null) {
                console.log('exec error: ' + error);
            }
            res.write(stdout);
            res.write("end I/O time for request : (" + reqid + ") = " + new Date().getMinutes() + ":" + new Date().getSeconds() + ":" + new Date().getMilliseconds() + "\n");
            res.end();
        });
}

sleep = function (counter, res, reqid)
{
    if(counter == 0)
        res.write("start time for request : (" + reqid + ") = " + new Date().getMinutes() + ":" + new Date().getSeconds() + ":" + new Date().getMilliseconds() + "\n");

    res.write("counter for request : (" + reqid + ") = " + counter + "\n");
    console.log("counter for request : (" + reqid + ") = " + counter + "\n");

    counter++;

    if (counter < 6)
    {
        setTimeout(function()
        {
            sleep(counter, res, reqid);
        }, 500);
        return;
    }

    res.write("end time for request : (" + reqid + ") = " + new Date().getMinutes() + ":" + new Date().getSeconds()  + ":" + new Date().getMilliseconds()+ "\n");
    console.log("end time for request : (" + reqid + ") = " + new Date().getMinutes() + ":" + new Date().getSeconds()  + ":" + new Date().getMilliseconds()+ "\n");
    res.end();

}

frame = function (res, host)
{
    res.write("<html></html><body><H1>This is the home page with SIX frames episode 5</H1>" +
        "<iframe width='450px' src='" + host + "/io?reqid=1'></iframe>" +
        "<iframe width='450px' src='" + host + "/io?reqid=2'></iframe> </br>" +
        "<iframe width='450px' src='" + host + "/sleep?reqid=3'></iframe> " +
        "<iframe width='450px' src='" + host + "/sleep?reqid=4'></iframe> </br>" +
        "<iframe width='450px' src='" + host + "/sleepend?reqid=5'></iframe> " +
        "<iframe width='450px' src='" + host + "/sleepend?reqid=6'></iframe>" +
        "</body></html>");
    res.end();

}
