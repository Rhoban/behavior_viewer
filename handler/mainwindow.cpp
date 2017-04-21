#include <QWebFrame>
#include "mainwindow.h"
#include "ui_mainwindow.h"

MainWindow::MainWindow(QString server, QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow),
    rhio(server.toStdString())
{
    ui->setupUi(this);
    ui->webView->page()->mainFrame()->addToJavaScriptWindowObject("rhio", &rhio);
    ui->horizontalLayout->setMargin(0);
    ui->horizontalLayout->setSpacing(0);
}

MainWindow::~MainWindow()
{

    delete ui;
}
