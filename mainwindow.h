#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QTimer>
#include <QMainWindow>
#include "Rhio.h"

namespace Ui {
class MainWindow;
}

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QString server, QWidget *parent = 0);
    ~MainWindow();

private:
    Ui::MainWindow *ui;
    Rhio rhio;
};

#endif // MAINWINDOW_H
