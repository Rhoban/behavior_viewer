#-------------------------------------------------
#
# Project created by QtCreator 2017-04-20T15:38:53
#
#-------------------------------------------------

QT       += core gui network webkit webkitwidgets
CONFIG += c++11
RESOURCES += www.qrc

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = BehaviorViewer
TEMPLATE = app


SOURCES += main.cpp\
        mainwindow.cpp \
        Rhio.cpp

WORKSPACE = $$(HOME)/workspace
QMAKE_RPATHDIR += $$WORKSPACE/devel_release/lib/

LIBS += -L$$WORKSPACE/devel_release/lib/ -lRhIOClient -lzmq
INCLUDEPATH += $$WORKSPACE/src/rhoban/rhio/Client/src
INCLUDEPATH += $$WORKSPACE/src/rhoban/rhio/Common/src
INCLUDEPATH += $$WORKSPACE/src/rhobandeps/libzmq/include

HEADERS  += mainwindow.h \
    Rhio.h

FORMS    += mainwindow.ui

RESOURCES += \
    www.qrc

DISTFILES += \
    www/robocup.js
