
// Monitored moves
var monitorMoves = [
    'robocup', 'approach', 'search', 'playing',
    'standup', 'head', 'walk', 'placer', 'goal_keeper'
];

// Menu panel
var menu = [
    {
        // Reset the robot & ball position on the field
        'type': 'button',
        'label': 'Reset position',
        'action': function() {
            rhio.cmd('/localisation/resetPosition');
            rhio.cmd('/localisation/fakeBall 1 0');
            rhio.setFloat('/decision/shareX', (fieldLength/2));
            rhio.setFloat('/decision/shareY', (fieldWidth/2));
        }
    },
    {
        "type": "separator"
    },
    {
        'type': 'bool',
        'label': 'Is goal keeper',
        'node': '/moves/robocup/goalKeeper',
    },
    {
        'type': 'bool',
        'label': 'Is auto placing',
        'node': '/moves/robocup/autoKickOff',
        'draw': function(ctx) {
            var x = rhio.getFloat('/moves/robocup/autoTargetX')/100.0;
            var y = rhio.getFloat('/moves/robocup/autoTargetY')/100.0;

            ctx.save();
            ctx.globalAlpha=0.5;
            ctx.beginPath();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 0.05;
            ctx.moveTo(x-0.1, y-0.1);
            ctx.lineTo(x+0.1, y+0.1);
            ctx.moveTo(x+0.1, y-0.1);
            ctx.lineTo(x-0.1, y+0.1);
            ctx.stroke();
            ctx.restore();
        }
    },
    {
        'type': 'separator'
    },
    {
        'type': 'bool',
        'label': 'Ball quality is good',
        'node': '/decision/isBallQualityGood'
    },
    {
        'type': 'bool',
        'label': 'Field quality is good',
        'node': '/decision/isFieldQualityGood'
    },
    {
        'type': 'bool',
        'label': 'Is fallen',
        'node': '/decision/isFallen'
    },
    {
        'type': 'bool',
        'label': 'Ball position is shared',
        'node': '/decision/ballIsShared'
    },
    {
        'type': 'bool',
        'label': 'Am I handled ?',
        'node': '/decision/handled'
    },
    {
        'type': 'bool',
        'label': 'Should let play (team)',
        'node': '/decision/shouldLetPlayTeam'
    },
    {
        "type": "separator"
    },
    {
        'type': 'bool',
        'readOnly': true,
        'label': 'Should let play',
        'node': '/decision/shouldLetPlay'
    },
    {
        "type": "separator"
    },
    {
        'type': 'zone',
        'update': function(div) {
            div.html('<pre>'+rhio.cmd('/referee/playing')+'</pre>');
        }
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
var robotHeadYaw = 0;

// Ball position
var ballX = 0;
var ballY = 0;
var sharedBallX = 0;
var sharedBallY = 0;

// Camera aperture
var cameraAperture = 0;

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
    ctx.moveTo(-fieldLength/2 + penaltyMark + 0.05, 0.05);
    ctx.lineTo(-fieldLength/2 + penaltyMark + 0.05, -0.05);
    ctx.moveTo(fieldLength/2 - penaltyMark, 0);
    ctx.lineTo(fieldLength/2 - penaltyMark + 0.1, 0);
    ctx.moveTo(fieldLength/2 - penaltyMark + 0.05, 0.05);
    ctx.lineTo(fieldLength/2 - penaltyMark + 0.05, -0.05);
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

    // Camera cone
    ctx.save();
    ctx.beginPath();
    ctx.rotate(robotHeadYaw*Math.PI/180);
    ctx.fillStyle = '#aaa';
    ctx.globalAlpha=0.4;


    ctx.moveTo(0,0);
    ctx.lineTo(50*Math.cos(cameraAperture/2),50*Math.sin(cameraAperture/2));
    ctx.lineTo(50*Math.cos(cameraAperture/2),-50*Math.sin(cameraAperture/2));
    ctx.lineTo(0,0);
    ctx.fill();
    ctx.restore();

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

    // Drawing the shared ball
    ctx.beginPath();
    ctx.strokeStyle = '#333';
    ctx.fillStyle = '#16c0f8';
    ctx.moveTo(sharedBallX, sharedBallY);
    ctx.arc(sharedBallX, sharedBallY, 0.1, 0, Math.PI*2);
    ctx.stroke();
    ctx.fill();

    ctx.restore();

    for (var k in menu) {
        if ('draw' in menu[k]) {
            menu[k].draw(ctx);
        }
    }
    
    ctx.restore();
}

function update()
{
    // Getting field positions
    robotX = rhio.getFloat('/localisation/fieldX');
    robotY = rhio.getFloat('/localisation/fieldY');
    robotYaw = rhio.getFloat('/localisation/fieldOrientation');
    robotHeadYaw = rhio.getFloat('/lowlevel/head_yaw/goalPosition');
    ballX = rhio.getFloat('/localisation/ballFieldX');
    ballY = rhio.getFloat('/localisation/ballFieldY');
    sharedBallX = rhio.getFloat("/decision/shareX");
    sharedBallY = rhio.getFloat("/decision/shareY");

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

    // Updating menu
    for (var k in menu) {
        var entry = menu[k];

        if (entry.type == 'bool') {
            $('.menu_'+k+' input').prop('checked', rhio.getBool(entry.node));
        }
        if (entry.type == 'zone') {
            entry.update($('.menu_'+k));
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

function updateSharedBallPosition(x, y)
{
    rhio.setFloat('/decision/shareX', x);
    rhio.setFloat('/decision/shareY', y);
}

$(document).ready(function() {
    // Initializing Canvas
    field = document.getElementById('field');
    ctx = field.getContext('2d');

    // Update interval
    setInterval(function() {
        update();
    }, 50);

    cameraAperture = rhio.getFloat('/model/cameraModelAngularWidth')*Math.PI/180;

    // Handling dragging
    var dragging = null;
    var rotating = null;
    var prev;
    var saveRobotPos;

    $('#field').mousedown(function(e) {
        var pos = eventToM(e);
        prev = pos;

        if (e.which == 1) {
            if (near(pos, ballX, ballY)) {
                dragging = 'ball';
            } else if (near(pos, sharedBallX, sharedBallY)) {
                dragging = 'shared';
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
                saveRobotPos = [robotX, robotY];
                rotating = 'robot';
            }
        }
    });

    $('#field').mousemove(function(e) {
        var pos = eventToM(e);

        if (dragging == 'ball') {
            updateBallPosition(pos[0], pos[1]);
        } else if (dragging == 'shared') {
            updateSharedBallPosition(pos[0], pos[1]);
        } else if (dragging == 'robot') {
            updateRobotPosition(pos[0], pos[1], robotYaw);
        } else if (rotating == 'robot') {
            var a = Math.atan2(pos[1]-robotY, pos[0]-robotX);
            updateRobotPosition(saveRobotPos[0], saveRobotPos[1], a);
        }

        prev = pos;
    });

    $('#field').mouseup(function() {
        dragging = null;
        rotating = null;
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

    // Generating menu
    html = '';
    for (var k in menu) {
        var entry = menu[k];

        if (entry.type == 'button') {
            html += '<button class="menu_'+k+' btn btn-primary">'+entry.label+'</button><br/>';
        } else if (entry.type == 'bool') {
            var checked = rhio.getBool(entry.node);
            html += '<label title="'+entry.node+'" class="menu_'+k+'';
                if ('readOnly' in entry) {
                    html += ' readonly';
            }
            html += '">';
            html += '<input ';
            if (checked) {
                html += 'checked="checked" ';
            }
            if ('readOnly' in entry) {
                html += 'readonly ';
            }
            html += ' type="checkbox" /> '+entry.label;
            html += '</label><br/>';
        } else if (entry.type == 'separator') {
            html += '<hr/>';
        } else if (entry.type == 'zone') {
            html += '<div class="menu_'+k+'"></div>';
        }
    }
    $('.menu').html(html);
    for (var k in menu) {
        var entry = menu[k];
        (function(entry, k) {
            if (!('readOnly' in entry)) {
                $('.menu_'+k).click(function() {
                    if (entry.type == 'button') {
                        entry.action();
                    } else if (entry.type == 'bool') {
                        if ($(this).find('input').is(':checked')) {
                            rhio.setBool(entry.node, true);
                        } else {
                            rhio.setBool(entry.node, false);
                        }
                    }
                });
            }
        })(entry, k);
    }
});
