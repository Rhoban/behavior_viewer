#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QTimer>
#include <QWebInspector>
#include <QMainWindow>
#include "Rhio.h"

namespace Ui {
class MainWindow;
}

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(Rhio *rhio, QWidget *parent = 0);
    ~MainWindow();

public slots:
    void on_actionInspector_triggered();
    void on_actionAccessibility_triggered();
    void on_actionSuperBigleux_triggered();

 private:
    bool accessibility;
    bool superBigleuxMode;
    QAction *inspectorAction;
    QAction *accessibilityAction;
    QAction *superBigleuxAction;
    QWebInspector *inspector;
    Ui::MainWindow *ui;
    Rhio *rhio;
};

#endif // MAINWINDOW_H
