#include "mainwindow.h"
#include "Rhio.h"
#include <QApplication>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);

    QString server = "localhost";
    if (argc > 1) {
        server = QString(argv[1]);
    }

    Rhio rhio(server.toStdString());

    MainWindow w(&rhio);
    w.show();

    return a.exec();
}
