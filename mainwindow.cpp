#include <QWebFrame>
#include "mainwindow.h"
#include "ui_mainwindow.h"

MainWindow::MainWindow(Rhio *rhio, QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow),
    rhio(rhio)
{
    ui->setupUi(this);
    ui->webView->page()->mainFrame()->addToJavaScriptWindowObject("rhio", rhio);
    ui->horizontalLayout->setMargin(0);
    ui->horizontalLayout->setSpacing(0);
}

MainWindow::~MainWindow()
{
    delete ui;
}
