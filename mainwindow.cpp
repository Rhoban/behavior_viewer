#include <QWebFrame>
#include <QWebInspector>
#include "mainwindow.h"
#include "ui_mainwindow.h"

MainWindow::MainWindow(Rhio *rhio, QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow),
    inspector(NULL),
    rhio(rhio)
{
    ui->setupUi(this);
    ui->webView->page()->mainFrame()->addToJavaScriptWindowObject("rhio", rhio);
    ui->horizontalLayout->setMargin(0);
    ui->horizontalLayout->setSpacing(0);
    ui->webView->settings()->setAttribute(QWebSettings::DeveloperExtrasEnabled, true);

    inspectorAction = new QAction(tr("Show inspector"), this);
    inspectorAction->setShortcut(QKeySequence::Find);
    connect(inspectorAction, SIGNAL(triggered()), this, SLOT(on_actionInspector_triggered()));
    addAction(inspectorAction);
}

MainWindow::~MainWindow()
{
    if (inspector) {
        delete inspector;
    }
    delete inspectorAction;
    delete ui;
}

void MainWindow::on_actionInspector_triggered()
{
    if (inspector == NULL) {
        inspector = new QWebInspector;
        inspector->setPage(ui->webView->page());
    }
    inspector->setVisible(true);
}
