
// Monitored moves
var monitorMoves = [
    'robocup', 'approach', 'standup', 'head', 'walk'
];

// Menu panel
var menu = [
    {
        'type': 'button',
        'name': 'Reset position',
        'cmd': '/localisation/resetPosition'
    }
];

// Canvas size
var field;
var ctx;

// Field dimensions
var fieldLength = 9;
var fieldWidth = 6;
var fieldBorder = 0.5;
var goalWidth = 2.6;
var penaltyMark = 2.1;
var goalAreaLength = 1;
var goalAreaWidth = 5;

// Robot position
var robotX = 0;
var robotY = 0;
var robotYaw = 0;

// Ball position
var ballX = 0;
var ballY = 0;

function redraw()
{
    ctx.clearRect(0, 0, field.width, field.height);

    ctx.save();
    var l = fieldLength+2*fieldBorder;
    var h = fieldWidth+2*fieldBorder;
    ctx.translate(field.width/2, field.height/2);
    ctx.scale(field.width/l, -field.height/h);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 0.05;

    // Border lines
    ctx.beginPath();
    ctx.moveTo(-fieldLength/2,fieldWidth/2);
    ctx.lineTo(fieldLength/2,fieldWidth/2);
    ctx.lineTo(fieldLength/2,-fieldWidth/2);
    ctx.lineTo(-fieldLength/2,-fieldWidth/2);
    ctx.lineTo(-fieldLength/2,fieldWidth/2);
    ctx.stroke();

    // Center circle
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, Math.PI*2);
    ctx.stroke();
    
    // Middle line
    ctx.beginPath();
    ctx.moveTo(0, fieldWidth/2);
    ctx.lineTo(0, -fieldWidth/2);
    ctx.stroke();
    
    // Goals
    ctx.beginPath();
    ctx.moveTo(-fieldLength/2, goalWidth/2);
    ctx.lineTo(-fieldLength/2-fieldBorder/2, goalWidth/2);
    ctx.moveTo(-fieldLength/2, -goalWidth/2);
    ctx.lineTo(-fieldLength/2-fieldBorder/2, -goalWidth/2);
    ctx.moveTo(fieldLength/2, goalWidth/2);
    ctx.lineTo(fieldLength/2+fieldBorder/2, goalWidth/2);
    ctx.moveTo(fieldLength/2, -goalWidth/2);
    ctx.lineTo(fieldLength/2+fieldBorder/2, -goalWidth/2);
    ctx.stroke();
    
    // Penalty mark
    ctx.beginPath();
    ctx.moveTo(-fieldLength/2 + penaltyMark, 0);
    ctx.lineTo(-fieldLength/2 + penaltyMark + 0.1, 0);
    ctx.moveTo(fieldLength/2 - penaltyMark, 0);
    ctx.lineTo(fieldLength/2 - penaltyMark + 0.1, 0);
    ctx.moveTo(-0.05, 0);
    ctx.lineTo(0.05, 0);
    ctx.stroke();

    // Goal area
    ctx.beginPath();
    ctx.moveTo(-fieldLength/2, goalAreaWidth/2);
    ctx.lineTo(-fieldLength/2+goalAreaLength, goalAreaWidth/2);
    ctx.lineTo(-fieldLength/2+goalAreaLength, -goalAreaWidth/2);
    ctx.lineTo(-fieldLength/2, -goalAreaWidth/2);
    
    ctx.moveTo(fieldLength/2, goalAreaWidth/2);
    ctx.lineTo(fieldLength/2-goalAreaLength, goalAreaWidth/2);
    ctx.lineTo(fieldLength/2-goalAreaLength, -goalAreaWidth/2);
    ctx.lineTo(fieldLength/2, -goalAreaWidth/2);
    ctx.stroke();

    ctx.save();
    // Drawing the robot
    ctx.lineWidth = 0.07;
    
    ctx.translate(robotX, robotY);
    ctx.rotate(robotYaw);
    
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.moveTo(0, 0);
    ctx.lineTo(0.25, 0);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.strokeStyle = 'green';
    ctx.moveTo(0, -0.3);
    ctx.lineTo(0, 0.3);
    ctx.stroke();

    ctx.restore();
    
    ctx.save();
    ctx.beginPath();
    // Drawing the ball
    ctx.strokeStyle = '#333';
    ctx.fillStyle = '#ff3';
    ctx.moveTo(ballX, ballY);
    ctx.arc(ballX, ballY, 0.1, 0, Math.PI*2);
    ctx.stroke();
    ctx.fill();
    ctx.restore();
    
    ctx.restore();
}

function update()
{
    // Getting field positions
    robotX = rhio.getFloat('/localisation/fieldX');
    robotY = rhio.getFloat('/localisation/fieldY');
    robotYaw = rhio.getFloat('/localisation/fieldOrientation');
    ballX = rhio.getFloat('/localisation/ballFieldX');
    ballY = rhio.getFloat('/localisation/ballFieldY');

    // Getting the moves
    moves = rhio.cmd('/moves/moves');
    var lines = moves.split("\n");
    for (var k in lines) {
        var line = lines[k];
        var parts = line.split(' ').filter(function(x) { return x; });
        if (parts.length >= 2) {
            var name = parts[0];
            var status = parts[1];

            var div = $('.move_'+name);

            if (status == 'fading-in' || status == 'fading-out') {
                div.removeClass('running');
                div.addClass('fading');
            } else if (status != '-' && status != 'stopped') {
                div.addClass('running');
                div.removeClass('fading');
            } else {
                div.removeClass('running');
                div.removeClass('fading');
            }
            div.find('.state').text(status);
        }
    }

    redraw();
}

function eventToM(e)
{
    var x = (e.pageX - e.target.offsetLeft) / $('#field').width();
    var y = (e.pageY - e.target.offsetTop) / $('#field').height();

    x -= 0.5;
    y -= 0.5;
    y *= -1;
    x *= fieldLength + fieldBorder*2;
    y *= fieldWidth + fieldBorder*2;

    return [x, y];
}

function near(pos, x, y, dist)
{
    if (dist == undefined) {
        dist = 0.4;
    }

    var norm = Math.sqrt(Math.pow(pos[0]-x, 2) + Math.pow(pos[1]-y,2));

    return norm < dist;
}

function robotWorld(x, y, rx, ry, yaw)
{
    x -= rx;
    y -= ry;
    var x_ = x*Math.cos(-yaw) - y*Math.sin(-yaw);
    var y_ = x*Math.sin(-yaw) + y*Math.cos(-yaw);

    return [x_, y_];
}

function updateRobotPosition(x, y, yaw)
{
    rhio.cmd('/localisation/moveOnField '+x+' '+y+' '+yaw);
}

function updateBallPosition(x, y)
{
    rhio.cmd('/localisation/fakeBall '+x+' '+y);
}

$(document).ready(function() {
    // Initializing Canvas
    field = document.getElementById('field');
    ctx = field.getContext('2d');

    // Update interval
    setInterval(function() {
        update();
    }, 50);

    // Handling dragging
    var dragging = null;
    var rotating = null;
    var prev;
    var base;

    $('#field').mousedown(function(e) {
        var pos = eventToM(e);
        prev = pos;
        base = pos;

        if (e.which == 1) {
            if (near(pos, ballX, ballY)) {
                dragging = 'ball';
            } else if (near(pos, robotX, robotY)) {
                dragging = 'robot';
            } else {
                dragging = null;
            }
        }
        if (e.which == 2) {
            if (near(pos, robotX, robotY, 2)) {
                var a = Math.atan2(pos[1]-robotY, pos[0]-robotX);
                var y = robotYaw;
                base = [a, y];
                rotating = 'robot';
            }
        }
    });

    // Generating moves
    var html = '';
    for (var k in monitorMoves) {
        var name = monitorMoves[k];
        html += '<div class="move move_'+name+'">';
        html += '<span class="name">'+name+'</span><br/>';
        html += '[<span class="state">?</span>]';
        html += '</div>';
    }
    $('.moves').html(html);
    $('.move').click(function() {
        var name = $(this).find('.name').text();
        if ($(this).hasClass('running')) {
            rhio.cmd('/moves/stop '+name);
        } else {
            rhio.cmd('/moves/start '+name);
        }
    });

    $('#field').mousemove(function(e) {
        var pos = eventToM(e);

        if (dragging == 'ball') {
            updateBallPosition(pos[0], pos[1]);
        } else if (dragging == 'robot') {
            updateRobotPosition(pos[0]-prev[0], pos[1]-prev[1], 0);
        } else if (rotating == 'robot') {
            var a = Math.atan2(pos[1]-robotY, pos[0]-robotX);
            var old = base[0];
            updateRobotPosition(0, 0, a-old);
            base[0] = a;
        }

        prev = pos;
    });

    $('#field').mouseup(function() {
        dragging = null;
        rotating = null;
    });

    $('.resetPosition').click(function() {
        rhio.cmd('/localisation/resetPosition');
        rhio.cmd('/localisation/fakeBall 1 0');
    });
});