#include "mainwindow.h"
#include <QApplication>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);

    QString server = "localhost";
    if (argc > 1) {
        server = QString(argv[1]);
    }

    MainWindow w(server);
    w.show();

    return a.exec();
}
