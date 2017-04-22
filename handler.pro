#-------------------------------------------------
#
# Project created by QtCreator 2017-04-20T15:38:53
#
#-------------------------------------------------

QT       += core gui network webkit webkitwidgets
CONFIG += c++11
RESOURCES += www.qrc

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = handler
TEMPLATE = app


SOURCES += main.cpp\
        mainwindow.cpp \
        Rhio.cpp

WORKSPACE = $$(HOME)/workspace
QMAKE_RPATHDIR += $$WORKSPACE/devel_release/lib/

LIBS += -L$$WORKSPACE/devel_release/lib/ -lRhIOClient -lzmq
INCLUDEPATH += $$WORKSPACE/src/rhoban/rhio/Client/src
INCLUDEPATH += $$WORKSPACE/src/rhoban/rhio/Common/src

HEADERS  += mainwindow.h \
    Rhio.h

FORMS    += mainwindow.ui

RESOURCES += \
    www.qrc

DISTFILES += \
    www/dist/fonts/glyphicons-halflings-regular.eot \
    www/dist/fonts/glyphicons-halflings-regular.woff \
    www/dist/fonts/glyphicons-halflings-regular.woff2 \
    www/dist/fonts/glyphicons-halflings-regular.ttf \
    www/dist/fonts/glyphicons-halflings-regular.svg