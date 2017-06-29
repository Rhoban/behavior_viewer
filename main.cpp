#include "mainwindow.h"
#include "Rhio.h"
#include <QApplication>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);

    QString server = "localhost";
    unsigned int port = RhIO::ServersPortBase;

    if (argc > 1) {
        server = QString(argv[1]);
    }
    
    if (argc > 2) {
        port = atoi(argv[2]);
    }

    Rhio rhio(server.toStdString(), port);

    MainWindow w(&rhio);
    w.show();

    return a.exec();
}
