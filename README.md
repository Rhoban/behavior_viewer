# Behavior viewer

## Building

To build it, you'll need Qt5:

    sudo apt-get install qt5-qmake libqt5webkit5-dev

You can edit the `behavior.pro` file to set the `WORKSPACE` accordingly
to your `workspace` installation (int defaults to the `$HOME/workspace`
directory, supposing that `workspace` is installed at the root of your
home directory).

Then:

    mkdir build
    cd build
    qmake ../behavior.pro
    make

You can then run RhobanServer in fake mode and run:

    ./BehaviorViewer

## Using

You can drag and drop the ball and the robot to move it on the field.
You can use the mouse3 button (center click / mouse wheel) to rotate the
robot.

If you click on moves, it will stop/start it.

You can monitor the robot decisions on the right, and edit it if
you are in fake mode (it will have no effect else).

If you want to change the menu, you can edit `www/robocup.js`, the header
of this file contains sections of moves and variables that are monitored.

