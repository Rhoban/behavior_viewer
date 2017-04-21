#ifndef __RHIO_H
#define __RHIO_H

#include <string>
#include <QObject>
#include <RhIOClient.hpp>

using namespace RhIO;

class Rhio : public QObject
{
    Q_OBJECT

public:
    Rhio(std::string server);
    virtual ~Rhio();

signals:

public slots:
    bool getBool(QString name);
    void setBool(QString name, bool v);
    float getFloat(QString name);
    void setFloat(QString name, float f);
    QString cmd(QString cmd);

private:
    ClientSub *clientSub;
    ClientReq *client;
};

#endif // RHIO_H
